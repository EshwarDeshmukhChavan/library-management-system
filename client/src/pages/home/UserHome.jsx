import { Link } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import './Home.css';

const categories = [
  { from: 'SC(B/M)000001', to: 'SC(B/M)000004', name: 'Science' },
  { from: 'EC(B/M)000001', to: 'EC(B/M)000004', name: 'Economics' },
  { from: 'FC(B/M)000001', to: 'FC(B/M)000004', name: 'Fiction' },
  { from: 'CH(B/M)000001', to: 'CH(B/M)000004', name: 'Children' },
  { from: 'PD(B/M)000001', to: 'PD(B/M)000004', name: 'Personal Development' }
];

const UserHome = () => {
  return (
    <AppLayout>
      <div className="home-page">
        <div className="home-welcome">
          <h2>Home Page</h2>
          <p>Welcome to the Library Management System. Choose a module to get started.</p>
        </div>

        <div className="home-modules">
          <Link to="/reports" className="module-card reports" id="module-reports">
            <span className="module-icon">📊</span>
            <h3>Reports</h3>
            <p>View master lists, active issues, and overdue returns</p>
          </Link>
          <Link to="/transactions" className="module-card transactions" id="module-transactions">
            <span className="module-icon">🔄</span>
            <h3>Transactions</h3>
            <p>Issue books, return books, and manage fines</p>
          </Link>
        </div>

        <div className="home-section">
          <h3 className="section-title">Product Details</h3>
          <div className="data-table-wrapper">
            <table className="data-table" id="product-details-table">
              <thead>
                <tr>
                  <th>Code No From</th>
                  <th>Code No To</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, index) => (
                  <tr key={index}>
                    <td><code>{cat.from}</code></td>
                    <td><code>{cat.to}</code></td>
                    <td>{cat.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default UserHome;
