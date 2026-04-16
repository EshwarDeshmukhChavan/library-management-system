import { useState, useEffect } from 'react';
import AppLayout from '../../components/Layout/AppLayout';
import { reportsAPI } from '../../services/api';
import '../../pages/home/Home.css';

const MasterListBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const res = await reportsAPI.getBooks();
      setBooks(res.data);
    } catch (err) {
      console.error('Error loading books:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <AppLayout><div className="loading-screen"><div className="spinner"></div><p>Loading...</p></div></AppLayout>;
  }

  return (
    <AppLayout>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        <div className="page-header">
          <h2>Master List of Books</h2>
          <p>{books.length} books in the library</p>
        </div>
        {books.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📭</div><p>No books found.</p></div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table" id="master-books-table">
              <thead>
                <tr>
                  <th>Serial No</th>
                  <th>Name of Book</th>
                  <th>Author Name</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Cost (₹)</th>
                  <th>Procurement Date</th>
                </tr>
              </thead>
              <tbody>
                {books.map(book => (
                  <tr key={book.id}>
                    <td><code>{book.serialNo}</code></td>
                    <td>{book.name}</td>
                    <td>{book.authorName}</td>
                    <td>{book.category?.name}</td>
                    <td><span className={`status-badge ${book.status.toLowerCase()}`}>{book.status}</span></td>
                    <td>₹{book.cost}</td>
                    <td>{new Date(book.procurementDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default MasterListBooks;
