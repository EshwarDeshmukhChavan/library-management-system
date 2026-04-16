import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import { booksAPI, membersAPI, transactionsAPI } from '../../services/api';
import '../../pages/home/Home.css';

const BookIssue = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [authorName, setAuthorName] = useState('');
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
      const [booksRes, membersRes] = await Promise.all([
        booksAPI.getNames(),
        membersAPI.getAll({ status: 'ACTIVE' })
      ]);

      const availableBooks = booksRes.data.filter(b => b.status === 'AVAILABLE');
      setBooks(availableBooks);
      setMembers(membersRes.data);

      // Pre-select from URL params
      const bookId = searchParams.get('bookId');
      if (bookId) {
        setSelectedBookId(bookId);
        const book = booksRes.data.find(b => b.id === parseInt(bookId));
        if (book) setAuthorName(book.authorName);
      }

      // Set today as default issue date
      const today = new Date().toISOString().split('T')[0];
      setIssueDate(today);

      // Set return date as today + 15 days
      const ret = new Date();
      ret.setDate(ret.getDate() + 15);
      setReturnDate(ret.toISOString().split('T')[0]);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookChange = (bookId) => {
    setSelectedBookId(bookId);
    const book = books.find(b => b.id === parseInt(bookId));
    setAuthorName(book ? book.authorName : '');
  };

  const handleIssueDateChange = (date) => {
    setIssueDate(date);
    const ret = new Date(date);
    ret.setDate(ret.getDate() + 15);
    setReturnDate(ret.toISOString().split('T')[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedBookId) {
      setError('Please select a book.');
      return;
    }
    if (!selectedMemberId) {
      setError('Please select a member.');
      return;
    }
    if (!issueDate) {
      setError('Issue date is required.');
      return;
    }
    if (!returnDate) {
      setError('Return date is required.');
      return;
    }

    // Validate return date <= issue + 15 days
    const issueDt = new Date(issueDate);
    const returnDt = new Date(returnDate);
    const maxReturn = new Date(issueDt);
    maxReturn.setDate(maxReturn.getDate() + 15);

    if (returnDt > maxReturn) {
      setError('Return date cannot be more than 15 days from issue date.');
      return;
    }

    try {
      await transactionsAPI.issue({
        bookMovieId: parseInt(selectedBookId),
        memberId: parseInt(selectedMemberId),
        issueDate,
        returnDate,
        remarks
      });
      navigate('/confirmation');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to issue book.');
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="loading-screen"><div className="spinner"></div><p>Loading...</p></div>
      </AppLayout>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <AppLayout>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        <div className="page-header">
          <h2>Book Issue</h2>
          <p>Issue a book to a member</p>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="issue-book-name">Enter Book Name *</label>
              <select
                id="issue-book-name"
                value={selectedBookId}
                onChange={(e) => handleBookChange(e.target.value)}
                required
              >
                <option value="">-- Select Book --</option>
                {books.map(b => (
                  <option key={b.id} value={b.id}>{b.name} ({b.serialNo})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="issue-author">Enter Author</label>
              <input type="text" id="issue-author" value={authorName} readOnly className="readonly-field" />
            </div>

            <div className="form-group">
              <label htmlFor="issue-member">Member *</label>
              <select
                id="issue-member"
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                required
              >
                <option value="">-- Select Member --</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.firstName} {m.lastName} ({m.membershipId})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="issue-date">Issue Date *</label>
              <input
                type="date"
                id="issue-date"
                value={issueDate}
                min={today}
                onChange={(e) => handleIssueDateChange(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="return-date">Return Date *</label>
              <input
                type="date"
                id="return-date"
                value={returnDate}
                min={issueDate}
                onChange={(e) => setReturnDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="issue-remarks">Remarks</label>
              <textarea
                id="issue-remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={3}
                placeholder="Optional remarks..."
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" id="btn-confirm-issue">
                ✓ Confirm
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/cancel')} id="btn-cancel-issue">
                ✕ Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default BookIssue;
