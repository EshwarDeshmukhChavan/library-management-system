import { Link } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import '../../pages/home/Home.css';

const Reports = () => {
  return (
    <AppLayout>
      <div className="reports-landing">
        <div className="page-header">
          <h2>Available Reports</h2>
          <p>View master lists and activity reports</p>
        </div>
        <div className="landing-links">
          <Link to="/master-list-books" className="landing-link" id="link-master-books">
            <span className="link-icon">📚</span>Master List of Books
          </Link>
          <Link to="/master-list-movies" className="landing-link" id="link-master-movies">
            <span className="link-icon">🎬</span>Master List of Movies
          </Link>
          <Link to="/master-list-memberships" className="landing-link" id="link-master-memberships">
            <span className="link-icon">👥</span>Master List of Memberships
          </Link>
          <Link to="/active-issues" className="landing-link" id="link-active-issues">
            <span className="link-icon">📋</span>Active Issues
          </Link>
          <Link to="/overdue-returns" className="landing-link" id="link-overdue-returns">
            <span className="link-icon">⚠️</span>Overdue Returns
          </Link>
          <Link to="/issue-requests" className="landing-link" id="link-issue-requests">
            <span className="link-icon">📝</span>Pending Issue Requests
          </Link>
        </div>
      </div>
    </AppLayout>
  );
};

export default Reports;
