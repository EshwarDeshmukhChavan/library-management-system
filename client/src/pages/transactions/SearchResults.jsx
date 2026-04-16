import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import { booksAPI } from '../../services/api';
import '../../pages/home/Home.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    searchBooks();
  }, []);

  const searchBooks = async () => {
    try {
      const bookName = searchParams.get('bookName') || '';
      const authorName = searchParams.get('authorName') || '';
      const res = await booksAPI.search({ bookName, authorName });
      setResults(res.data);
    } catch (err) {
      console.error('Error searching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleIssue = () => {
    if (selectedBook) {
      navigate(`/book-issue?bookId=${selectedBook.id}`);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Searching...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        <div className="page-header">
          <h2>Book Availability</h2>
          <p>Search results for your query</p>
        </div>

        {results.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>No books found matching your search criteria.</p>
          </div>
        ) : (
          <>
            <div className="data-table-wrapper">
              <table className="data-table" id="search-results-table">
                <thead>
                  <tr>
                    <th>Book Name</th>
                    <th>Author Name</th>
                    <th>Serial Number</th>
                    <th>Available</th>
                    <th>Select</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((book) => (
                    <tr key={book.id}>
                      <td>{book.name}</td>
                      <td>{book.authorName}</td>
                      <td><code>{book.serialNo}</code></td>
                      <td>
                        <span className={`status-badge ${book.status === 'AVAILABLE' ? 'available' : 'issued'}`}>
                          {book.status === 'AVAILABLE' ? 'Y' : 'N'}
                        </span>
                      </td>
                      <td>
                        {book.status === 'AVAILABLE' ? (
                          <input
                            type="radio"
                            name="selectBook"
                            value={book.id}
                            onChange={() => setSelectedBook(book)}
                            checked={selectedBook?.id === book.id}
                            id={`radio-book-${book.id}`}
                            style={{ accentColor: 'var(--accent-primary)', width: '18px', height: '18px', cursor: 'pointer' }}
                          />
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {selectedBook && (
              <div className="form-actions" style={{ marginTop: '1.5rem' }}>
                <button className="btn btn-primary" onClick={handleIssue} id="btn-issue-selected">
                  📖 Issue Selected Book
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default SearchResults;
