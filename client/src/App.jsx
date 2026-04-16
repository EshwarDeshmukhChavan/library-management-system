import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import AdminLogin from './pages/auth/AdminLogin';
import UserLogin from './pages/auth/UserLogin';
import LogOut from './pages/auth/LogOut';

// Home Pages
import AdminHome from './pages/home/AdminHome';
import UserHome from './pages/home/UserHome';

// Transaction Pages
import Transactions from './pages/transactions/Transactions';
import BookAvailable from './pages/transactions/BookAvailable';
import SearchResults from './pages/transactions/SearchResults';
import BookIssue from './pages/transactions/BookIssue';
import ReturnBook from './pages/transactions/ReturnBook';
import PayFine from './pages/transactions/PayFine';

// Report Pages
import Reports from './pages/reports/Reports';
import MasterListBooks from './pages/reports/MasterListBooks';
import MasterListMovies from './pages/reports/MasterListMovies';
import MasterListMemberships from './pages/reports/MasterListMemberships';
import ActiveIssues from './pages/reports/ActiveIssues';
import OverdueReturns from './pages/reports/OverdueReturns';
import IssueRequests from './pages/reports/IssueRequests';

// Maintenance Pages
import Maintenance from './pages/maintenance/Maintenance';
import AddMembership from './pages/maintenance/AddMembership';
import UpdateMembership from './pages/maintenance/UpdateMembership';
import AddBook from './pages/maintenance/AddBook';
import UpdateBook from './pages/maintenance/UpdateBook';
import UserManagement from './pages/maintenance/UserManagement';

// Utility Pages
import Cancel from './pages/utility/Cancel';
import Confirmation from './pages/utility/Confirmation';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<AdminLogin />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/logout" element={<LogOut />} />

          {/* Home Pages */}
          <Route path="/admin-home" element={<ProtectedRoute><AdminHome /></ProtectedRoute>} />
          <Route path="/user-home" element={<ProtectedRoute><UserHome /></ProtectedRoute>} />

          {/* Transactions */}
          <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
          <Route path="/book-available" element={<ProtectedRoute><BookAvailable /></ProtectedRoute>} />
          <Route path="/search-results" element={<ProtectedRoute><SearchResults /></ProtectedRoute>} />
          <Route path="/book-issue" element={<ProtectedRoute><BookIssue /></ProtectedRoute>} />
          <Route path="/return-book" element={<ProtectedRoute><ReturnBook /></ProtectedRoute>} />
          <Route path="/pay-fine" element={<ProtectedRoute><PayFine /></ProtectedRoute>} />

          {/* Reports */}
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/master-list-books" element={<ProtectedRoute><MasterListBooks /></ProtectedRoute>} />
          <Route path="/master-list-movies" element={<ProtectedRoute><MasterListMovies /></ProtectedRoute>} />
          <Route path="/master-list-memberships" element={<ProtectedRoute><MasterListMemberships /></ProtectedRoute>} />
          <Route path="/active-issues" element={<ProtectedRoute><ActiveIssues /></ProtectedRoute>} />
          <Route path="/overdue-returns" element={<ProtectedRoute><OverdueReturns /></ProtectedRoute>} />
          <Route path="/issue-requests" element={<ProtectedRoute><IssueRequests /></ProtectedRoute>} />

          {/* Maintenance (Admin Only) */}
          <Route path="/maintenance" element={<ProtectedRoute adminOnly><Maintenance /></ProtectedRoute>} />
          <Route path="/add-membership" element={<ProtectedRoute adminOnly><AddMembership /></ProtectedRoute>} />
          <Route path="/update-membership" element={<ProtectedRoute adminOnly><UpdateMembership /></ProtectedRoute>} />
          <Route path="/add-book" element={<ProtectedRoute adminOnly><AddBook /></ProtectedRoute>} />
          <Route path="/update-book" element={<ProtectedRoute adminOnly><UpdateBook /></ProtectedRoute>} />
          <Route path="/user-management" element={<ProtectedRoute adminOnly><UserManagement /></ProtectedRoute>} />

          {/* Utility */}
          <Route path="/cancel" element={<ProtectedRoute><Cancel /></ProtectedRoute>} />
          <Route path="/confirmation" element={<ProtectedRoute><Confirmation /></ProtectedRoute>} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
