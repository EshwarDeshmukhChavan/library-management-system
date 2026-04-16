import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import { booksAPI } from '../../services/api';
import '../../pages/home/Home.css';

const AddBook = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    type: 'BOOK', name: '', authorName: '', categoryId: '', cost: '', procurementDate: '', quantity: '1'
  });
  const [error, setError] = useState('');

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    try { const res = await booksAPI.getCategories(); setCategories(res.data); }
    catch (err) { console.error('Error:', err); }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.authorName || !form.categoryId || !form.procurementDate) {
      setError('All fields are required.');
      return;
    }

    try {
      await booksAPI.create(form);
      navigate('/confirmation');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add book/movie.');
    }
  };

  return (
    <AppLayout>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        <div className="page-header"><h2>Add Book/Movie</h2></div>
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group"><label>Type *</label>
              <div className="radio-group">
                <label className="radio-label"><input type="radio" name="type" value="BOOK" checked={form.type === 'BOOK'} onChange={handleChange} /> Book</label>
                <label className="radio-label"><input type="radio" name="type" value="MOVIE" checked={form.type === 'MOVIE'} onChange={handleChange} /> Movie</label>
              </div>
            </div>
            <div className="form-group"><label htmlFor="add-book-name">{form.type === 'BOOK' ? 'Book' : 'Movie'} Name *</label>
              <input type="text" id="add-book-name" name="name" value={form.name} onChange={handleChange} required /></div>
            <div className="form-group"><label htmlFor="add-book-author">Author/Director Name *</label>
              <input type="text" id="add-book-author" name="authorName" value={form.authorName} onChange={handleChange} required /></div>
            <div className="form-group"><label htmlFor="add-book-category">Category *</label>
              <select id="add-book-category" name="categoryId" value={form.categoryId} onChange={handleChange} required>
                <option value="">-- Select Category --</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group"><label htmlFor="add-book-cost">Cost (₹)</label>
              <input type="number" id="add-book-cost" name="cost" value={form.cost} onChange={handleChange} min="0" /></div>
            <div className="form-group"><label htmlFor="add-book-date">Date of Procurement *</label>
              <input type="date" id="add-book-date" name="procurementDate" value={form.procurementDate} onChange={handleChange} required /></div>
            <div className="form-group"><label htmlFor="add-book-qty">Quantity/Copies *</label>
              <input type="number" id="add-book-qty" name="quantity" value={form.quantity} onChange={handleChange} min="1" required /></div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" id="btn-confirm-add-book">✓ Confirm</button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/cancel')}>✕ Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default AddBook;
