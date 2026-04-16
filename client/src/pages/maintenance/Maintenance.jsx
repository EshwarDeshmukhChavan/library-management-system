import { Link } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import '../../pages/home/Home.css';

const Maintenance = () => {
  return (
    <AppLayout>
      <div className="maintenance-landing">
        <div className="page-header">
          <h2>Housekeeping</h2>
          <p>Manage memberships, books/movies, and users</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div className="form-card">
            <h3>Membership</h3>
            <div className="landing-links">
              <Link to="/add-membership" className="landing-link" id="link-add-membership"><span className="link-icon">➕</span>Add</Link>
              <Link to="/update-membership" className="landing-link" id="link-update-membership"><span className="link-icon">✏️</span>Update</Link>
            </div>
          </div>
          <div className="form-card">
            <h3>Books/Movies</h3>
            <div className="landing-links">
              <Link to="/add-book" className="landing-link" id="link-add-book"><span className="link-icon">➕</span>Add</Link>
              <Link to="/update-book" className="landing-link" id="link-update-book"><span className="link-icon">✏️</span>Update</Link>
            </div>
          </div>
          <div className="form-card">
            <h3>User Management</h3>
            <div className="landing-links">
              <Link to="/user-management" className="landing-link" id="link-user-mgmt"><span className="link-icon">👤</span>Manage</Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Maintenance;
