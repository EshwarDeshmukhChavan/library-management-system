import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import { booksAPI, transactionsAPI } from '../../services/api';
import '../../pages/home/Home.css';

const ReturnBook = () => {
  const navigate = useNavigate();
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [transaction, setTransaction] = useState(null);
  const [authorName, setAuthorName] = useState('');
  const [serialNo, setSerialNo] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await booksAPI.getNames();
      const issued = res.data.filter(b => b.status === 'ISSUED');
      setIssuedBooks(issued);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookChange = async (bookId) => {
    setSelectedBookId(bookId);
    setError('');

    if (!bookId) {
      setTransaction(null);
      setAuthorName('');
      setSerialNo('');
      setIssueDate('');
      setReturnDate('');
      return;
    }

    try {
      const book = issuedBooks.find(b => b.id === parseInt(bookId));
      setAuthorName(book?.authorName || '');
      setSerialNo(book?.serialNo || '');

      const res = await transactionsAPI.getByBook(bookId);
      setTransaction(res.data);
      setIssueDate(res.data.issueDate.split('T')[0]);
      setReturnDate(res.data.returnDate.split('T')[0]);
    } catch (err) {
      setError('Could not find active transaction for this book.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedBookId || !transaction) {
      setError('Please select a book to return.');
      return;
    }
    if (!serialNo) {
      setError('Serial number is mandatory.');
      return;
    }

    const actualReturnDate = returnDate || new Date().toISOString().split('T')[0];

    try {
      const res = await transactionsAPI.returnBook({
        transactionId: transaction.id,
        actualReturnDate,
        remarks
      });

      // Navigate to Pay Fine page with transaction data
      navigate(`/pay-fine?transactionId=${transaction.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process return.');
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="loading-screen"><div className="spinner"></div><p>Loading...</p></div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        <div className="page-header">
          <h2>Return Book</h2>
          <p>Process a book return</p>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="return-book-name">Enter Book Name *</label>
              <select
                id="return-book-name"
                value={selectedBookId}
                onChange={(e) => handleBookChange(e.target.value)}
                required
              >
                <option value="">-- Select Issued Book --</option>
                {issuedBooks.map(b => (
                  <option key={b.id} value={b.id}>{b.name} ({b.serialNo})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="return-author">Enter Author</label>
              <input type="text" id="return-author" value={authorName} readOnly className="readonly-field" />
            </div>

            <div className="form-group">
              <label htmlFor="return-serial">Serial No *</label>
              <input type="text" id="return-serial" value={serialNo} readOnly className="readonly-field" />
            </div>

            <div className="form-group">
              <label htmlFor="return-issue-date">Issue Date</label>
              <input type="date" id="return-issue-date" value={issueDate} readOnly className="readonly-field" />
            </div>

            <div className="form-group">
              <label htmlFor="return-return-date">Return Date</label>
              <input
                type="date"
                id="return-return-date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="return-remarks">Remarks</label>
              <textarea
                id="return-remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={3}
                placeholder="Optional remarks..."
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" id="btn-confirm-return">
                ✓ Confirm
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/cancel')} id="btn-cancel-return">
                ✕ Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default ReturnBook;
