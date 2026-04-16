import { useState, useEffect } from 'react';
import AppLayout from '../../components/Layout/AppLayout';
import { reportsAPI } from '../../services/api';
import '../../pages/home/Home.css';

const IssueRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadRequests(); }, []);

  const loadRequests = async () => {
    try { const res = await reportsAPI.getIssueRequests(); setRequests(res.data); }
    catch (err) { console.error('Error:', err); }
    finally { setLoading(false); }
  };

  if (loading) return <AppLayout><div className="loading-screen"><div className="spinner"></div><p>Loading...</p></div></AppLayout>;

  return (
    <AppLayout>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        <div className="page-header"><h2>Issue Requests</h2><p>{requests.length} requests</p></div>
        {requests.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📭</div><p>No issue requests.</p></div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table" id="issue-requests-table">
              <thead><tr>
                <th>Membership Id</th><th>Name of Book/Movie</th><th>Requested Date</th><th>Request Fulfilled Date</th>
              </tr></thead>
              <tbody>
                {requests.map(r => (
                  <tr key={r.id}>
                    <td><code>{r.member?.membershipId}</code></td>
                    <td>{r.bookMovie?.name}</td>
                    <td>{new Date(r.requestedDate).toLocaleDateString()}</td>
                    <td>{r.fulfilledDate ? new Date(r.fulfilledDate).toLocaleDateString() : <span style={{ color: 'var(--text-muted)' }}>Pending</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default IssueRequests;
