import { useState, useEffect } from 'react';
import AppLayout from '../../components/Layout/AppLayout';
import { reportsAPI } from '../../services/api';
import '../../pages/home/Home.css';

const ActiveIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadIssues(); }, []);

  const loadIssues = async () => {
    try { const res = await reportsAPI.getActiveIssues(); setIssues(res.data); }
    catch (err) { console.error('Error:', err); }
    finally { setLoading(false); }
  };

  if (loading) return <AppLayout><div className="loading-screen"><div className="spinner"></div><p>Loading...</p></div></AppLayout>;

  return (
    <AppLayout>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        <div className="page-header"><h2>Active Issues</h2><p>{issues.length} active issues</p></div>
        {issues.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">✅</div><p>No active issues.</p></div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table" id="active-issues-table">
              <thead><tr>
                <th>Serial No</th><th>Name of Book/Movie</th><th>Membership Id</th><th>Date of Issue</th><th>Date of Return</th>
              </tr></thead>
              <tbody>
                {issues.map(t => (
                  <tr key={t.id}>
                    <td><code>{t.bookMovie?.serialNo}</code></td>
                    <td>{t.bookMovie?.name}</td>
                    <td><code>{t.member?.membershipId}</code></td>
                    <td>{new Date(t.issueDate).toLocaleDateString()}</td>
                    <td>{new Date(t.returnDate).toLocaleDateString()}</td>
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

export default ActiveIssues;
