import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AppLayout from '../../components/Layout/AppLayout';
import '../../pages/home/Home.css';

const Confirmation = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  return (
    <AppLayout>
      <div className="utility-page">
        <div className="utility-card">
          <div className="utility-icon">✅</div>
          <h2>Transaction Completed Successfully</h2>
          <p>The transaction has been completed.</p>
          <button className="btn btn-primary" onClick={() => navigate(isAdmin ? '/admin-home' : '/user-home')} id="btn-confirm-home">
            🏠 Go Home
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Confirmation;
