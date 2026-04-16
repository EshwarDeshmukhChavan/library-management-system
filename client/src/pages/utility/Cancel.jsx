import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AppLayout from '../../components/Layout/AppLayout';
import '../../pages/home/Home.css';

const Cancel = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  return (
    <AppLayout>
      <div className="utility-page">
        <div className="utility-card">
          <div className="utility-icon">❌</div>
          <h2>Transaction Cancelled</h2>
          <p>The transaction has been cancelled.</p>
          <button className="btn btn-primary" onClick={() => navigate(isAdmin ? '/admin-home' : '/user-home')} id="btn-cancel-home">
            🏠 Go Home
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Cancel;
