import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(username, password);
      if (user.isAdmin) {
        navigate('/admin-home');
      } else {
        setError('This account does not have admin privileges. Please use User Login.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      <div className="login-card">
        <div className="login-header">
          <span className="login-icon">📚</span>
          <h1>Library Management System</h1>
          <p className="login-subtitle">Admin Login</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message" id="login-error">{error}</div>}
          <div className="form-group">
            <label htmlFor="admin-username">User ID</label>
            <input
              type="text"
              id="admin-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="admin-password">Password</label>
            <input
              type="password"
              id="admin-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <button type="submit" className="login-btn" id="admin-login-btn" disabled={loading}>
            {loading ? <span className="spinner-small"></span> : 'Login'}
          </button>
        </form>
        <div className="login-footer">
          <Link to="/user-login" className="switch-login">Switch to User Login →</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
