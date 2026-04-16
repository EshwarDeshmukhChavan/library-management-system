import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import { booksAPI } from '../../services/api';
import '../../pages/home/Home.css';

const BookAvailable = () => {
  const [bookNames, setBookNames] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await booksAPI.getNames();
      const books = res.data;
      const uniqueNames = [...new Set(books.map(b => b.name))].sort();
      const uniqueAuthors = [...new Set(books.map(b => b.authorName))].sort();
      setBookNames(uniqueNames);
      setAuthors(uniqueAuthors);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');

    if (!selectedBook && !selectedAuthor) {
      setError('Please select a book name or author name before searching.');
      return;
    }

    const params = new URLSearchParams();
    if (selectedBook) params.set('bookName', selectedBook);
    if (selectedAuthor) params.set('authorName', selectedAuthor);

    navigate(`/search-results?${params.toString()}`);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        <div className="page-header">
          <h2>Book Availability</h2>
          <p>Search for available books by name or author</p>
        </div>

        <div className="form-card">
          <form onSubmit={handleSearch}>
            {error && <div className="error-message" id="search-error">{error}</div>}
            <div className="form-group">
              <label htmlFor="book-name-search">Enter Book Name</label>
              <select
                id="book-name-search"
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
              >
                <option value="">-- Select Book Name --</option>
                {bookNames.map((name, i) => (
                  <option key={i} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="author-search">Enter Author</label>
              <select
                id="author-search"
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
              >
                <option value="">-- Select Author --</option>
                {authors.map((name, i) => (
                  <option key={i} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" id="btn-search">
                🔍 Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default BookAvailable;
