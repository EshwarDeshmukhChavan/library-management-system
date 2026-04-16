import { Link } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import '../../pages/home/Home.css';

const Transactions = () => {
  return (
    <AppLayout>
      <div className="transactions-landing">
        <div className="page-header">
          <h2>Transactions</h2>
          <p>Manage book issues, returns, and fines</p>
        </div>
        <div className="landing-links">
          <Link to="/book-available" className="landing-link" id="link-book-available">
            <span className="link-icon">🔍</span>
            Is book available?
          </Link>
          <Link to="/book-issue" className="landing-link" id="link-book-issue">
            <span className="link-icon">📖</span>
            Issue book?
          </Link>
          <Link to="/return-book" className="landing-link" id="link-return-book">
            <span className="link-icon">↩️</span>
            Return book?
          </Link>
          <Link to="/pay-fine" className="landing-link" id="link-pay-fine">
            <span className="link-icon">💰</span>
            Pay Fine?
          </Link>
        </div>
      </div>
    </AppLayout>
  );
};

export default Transactions;
