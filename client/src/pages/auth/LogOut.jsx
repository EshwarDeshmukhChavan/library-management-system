import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const LogOut = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
  }, []);

  return (
    <div className="login-page">
      <div className="login-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      <div className="login-card" style={{ textAlign: 'center' }}>
        <div className="login-header">
          <span className="login-icon">👋</span>
          <h1>Logged Out</h1>
          <p className="login-subtitle">You have successfully logged out.</p>
        </div>
        <button className="login-btn" onClick={() => navigate('/')} id="btn-back-login">
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default LogOut;
