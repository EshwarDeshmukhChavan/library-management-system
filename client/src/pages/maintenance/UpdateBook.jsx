import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import { booksAPI } from '../../services/api';
import '../../pages/home/Home.css';

const UpdateBook = () => {
  const navigate = useNavigate();
  const [type, setType] = useState('BOOK');
  const [books, setBooks] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [form, setForm] = useState({ name: '', serialNo: '', status: '', date: '' });
  const [error, setError] = useState('');

  useEffect(() => { loadBooks(); }, [type]);

  const loadBooks = async () => {
    try {
      const res = await booksAPI.getAll({ type });
      setBooks(res.data);
    } catch (err) { console.error('Error:', err); }
  };

  const handleBookChange = (id) => {
    setSelectedId(id);
    const book = books.find(b => b.id === parseInt(id));
    if (book) {
      setForm({
        name: book.name,
        serialNo: book.serialNo,
        status: book.status,
        date: book.procurementDate?.split('T')[0] || ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.serialNo || !form.status) {
      setError('All fields are required.');
      return;
    }

    try {
      await booksAPI.update(parseInt(selectedId), { ...form, type });
      navigate('/confirmation');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update.');
    }
  };

  return (
    <AppLayout>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        <div className="page-header"><h2>Update Book/Movie</h2></div>
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group"><label>Type *</label>
              <div className="radio-group">
                <label className="radio-label"><input type="radio" name="type" value="BOOK" checked={type === 'BOOK'} onChange={(e) => { setType(e.target.value); setSelectedId(''); }} /> Book</label>
                <label className="radio-label"><input type="radio" name="type" value="MOVIE" checked={type === 'MOVIE'} onChange={(e) => { setType(e.target.value); setSelectedId(''); }} /> Movie</label>
              </div>
            </div>
            <div className="form-group"><label htmlFor="update-book-select">Select {type === 'BOOK' ? 'Book' : 'Movie'} *</label>
              <select id="update-book-select" value={selectedId} onChange={(e) => handleBookChange(e.target.value)} required>
                <option value="">-- Select --</option>
                {books.map(b => <option key={b.id} value={b.id}>{b.name} ({b.serialNo})</option>)}
              </select>
            </div>
            {selectedId && (
              <>
                <div className="form-group"><label htmlFor="update-book-serial">Serial No *</label>
                  <input type="text" id="update-book-serial" value={form.serialNo} readOnly className="readonly-field" /></div>
                <div className="form-group"><label htmlFor="update-book-status">Status *</label>
                  <select id="update-book-status" value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} required>
                    <option value="AVAILABLE">Available</option>
                    <option value="ISSUED">Issued</option>
                  </select>
                </div>
                <div className="form-group"><label htmlFor="update-book-date">Date</label>
                  <input type="date" id="update-book-date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} /></div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" id="btn-confirm-update-book">✓ Confirm</button>
                  <button type="button" className="btn btn-secondary" onClick={() => navigate('/cancel')}>✕ Cancel</button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default UpdateBook;
