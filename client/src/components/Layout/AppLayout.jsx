import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AppLayout.css';

const AppLayout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/logout');
  };

  const handleHome = () => {
    navigate(isAdmin ? '/admin-home' : '/user-home');
  };

  // Determine which sidebar to show based on current path
  const getSidebarItems = () => {
    const path = location.pathname;

    if (path.includes('/transactions') || path.includes('/book-available') ||
        path.includes('/search-results') || path.includes('/book-issue') ||
        path.includes('/return-book') || path.includes('/pay-fine')) {
      return {
        title: 'Transactions',
        items: [
          { label: 'Is book available?', path: '/book-available', id: 'nav-book-available' },
          { label: 'Issue book?', path: '/book-issue', id: 'nav-book-issue' },
          { label: 'Return book?', path: '/return-book', id: 'nav-return-book' },
          { label: 'Pay Fine?', path: '/pay-fine', id: 'nav-pay-fine' }
        ]
      };
    }

    if (path.includes('/reports') || path.includes('/master-list') ||
        path.includes('/active-issues') || path.includes('/overdue-returns') ||
        path.includes('/issue-requests')) {
      return {
        title: 'Reports',
        items: [
          { label: 'Master List of Books', path: '/master-list-books', id: 'nav-master-books' },
          { label: 'Master List of Movies', path: '/master-list-movies', id: 'nav-master-movies' },
          { label: 'Master List of Memberships', path: '/master-list-memberships', id: 'nav-master-memberships' },
          { label: 'Active Issues', path: '/active-issues', id: 'nav-active-issues' },
          { label: 'Overdue Returns', path: '/overdue-returns', id: 'nav-overdue-returns' },
          { label: 'Issue Requests', path: '/issue-requests', id: 'nav-issue-requests' }
        ]
      };
    }

    if (path.includes('/maintenance') || path.includes('/add-membership') ||
        path.includes('/update-membership') || path.includes('/add-book') ||
        path.includes('/update-book') || path.includes('/user-management')) {
      return {
        title: 'Maintenance',
        items: [
          { label: 'Membership', type: 'header' },
          { label: 'Add', path: '/add-membership', id: 'nav-add-membership' },
          { label: 'Update', path: '/update-membership', id: 'nav-update-membership' },
          { label: 'Books/Movies', type: 'header' },
          { label: 'Add', path: '/add-book', id: 'nav-add-book' },
          { label: 'Update', path: '/update-book', id: 'nav-update-book' },
          { label: 'User Management', type: 'header' },
          { label: 'Manage', path: '/user-management', id: 'nav-user-management' }
        ]
      };
    }

    return null;
  };

  const sidebar = getSidebarItems();

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-left">
          <div className="header-logo">
            <span className="logo-icon">📚</span>
            <h1>Library Management System</h1>
          </div>
        </div>
        <div className="header-right">
          <span className="user-info">
            <span className="user-icon">👤</span>
            {user?.name}
            <span className={`role-badge ${isAdmin ? 'admin' : 'user'}`}>
              {isAdmin ? 'Admin' : 'User'}
            </span>
          </span>
          <button className="header-btn" onClick={handleHome} id="btn-home">
            🏠 Home
          </button>
          <button className="header-btn logout-btn" onClick={handleLogout} id="btn-logout">
            🚪 Log Out
          </button>
        </div>
      </header>

      <div className="app-body">
        {sidebar && (
          <aside className="app-sidebar">
            <h3 className="sidebar-title">{sidebar.title}</h3>
            <nav className="sidebar-nav">
              {sidebar.items.map((item, index) => (
                item.type === 'header' ? (
                  <div key={index} className="sidebar-header">{item.label}</div>
                ) : (
                  <Link
                    key={index}
                    to={item.path}
                    id={item.id}
                    className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </nav>
          </aside>
        )}
        <main className={`app-main ${sidebar ? 'with-sidebar' : 'full-width'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
