import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import { usersAPI } from '../../services/api';
import '../../pages/home/Home.css';

const UserManagement = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('new');
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [form, setForm] = useState({ username: '', password: '', name: '', isActive: true, isAdmin: false });
  const [error, setError] = useState('');

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try { const res = await usersAPI.getAll(); setUsers(res.data); }
    catch (err) { console.error('Error:', err); }
  };

  const handleUserChange = (id) => {
    setSelectedUserId(id);
    const user = users.find(u => u.id === parseInt(id));
    if (user) {
      setForm({ username: user.username, password: '', name: user.name, isActive: user.isActive, isAdmin: user.isAdmin });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name) { setError('Name is required.'); return; }

    try {
      if (mode === 'new') {
        if (!form.username || !form.password) { setError('Username and password are required for new users.'); return; }
        await usersAPI.create(form);
      } else {
        const data = { name: form.name, isActive: form.isActive, isAdmin: form.isAdmin };
        if (form.password) data.password = form.password;
        await usersAPI.update(parseInt(selectedUserId), data);
      }
      navigate('/confirmation');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save user.');
    }
  };

  return (
    <AppLayout>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        <div className="page-header"><h2>User Management</h2></div>
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group"><label>Mode *</label>
              <div className="radio-group">
                <label className="radio-label"><input type="radio" name="mode" value="new" checked={mode === 'new'} onChange={(e) => { setMode(e.target.value); setSelectedUserId(''); setForm({ username: '', password: '', name: '', isActive: true, isAdmin: false }); }} /> New User</label>
                <label className="radio-label"><input type="radio" name="mode" value="existing" checked={mode === 'existing'} onChange={(e) => setMode(e.target.value)} /> Existing User</label>
              </div>
            </div>
            {mode === 'existing' && (
              <div className="form-group"><label htmlFor="user-select">Select User *</label>
                <select id="user-select" value={selectedUserId} onChange={(e) => handleUserChange(e.target.value)} required>
                  <option value="">-- Select User --</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.username})</option>)}
                </select>
              </div>
            )}
            {mode === 'new' && (
              <div className="form-group"><label htmlFor="user-username">Username *</label>
                <input type="text" id="user-username" value={form.username} onChange={(e) => setForm({...form, username: e.target.value})} required /></div>
            )}
            <div className="form-group"><label htmlFor="user-name">Name *</label>
              <input type="text" id="user-name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required /></div>
            <div className="form-group"><label htmlFor="user-password">{mode === 'new' ? 'Password *' : 'New Password (leave blank to keep current)'}</label>
              <input type="password" id="user-password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} {...(mode === 'new' ? {required: true} : {})} /></div>
            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({...form, isActive: e.target.checked})} id="user-active" /> Active
              </label>
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" checked={form.isAdmin} onChange={(e) => setForm({...form, isAdmin: e.target.checked})} id="user-admin" /> Admin
              </label>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" id="btn-confirm-user">✓ Confirm</button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/cancel')}>✕ Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default UserManagement;
