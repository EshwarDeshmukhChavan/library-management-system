import { useState, useEffect } from 'react';
import AppLayout from '../../components/Layout/AppLayout';
import { reportsAPI } from '../../services/api';
import '../../pages/home/Home.css';

const OverdueReturns = () => {
  const [overdue, setOverdue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadOverdue(); }, []);

  const loadOverdue = async () => {
    try { const res = await reportsAPI.getOverdueReturns(); setOverdue(res.data); }
    catch (err) { console.error('Error:', err); }
    finally { setLoading(false); }
  };

  if (loading) return <AppLayout><div className="loading-screen"><div className="spinner"></div><p>Loading...</p></div></AppLayout>;

  return (
    <AppLayout>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        <div className="page-header"><h2>Overdue Returns</h2><p>{overdue.length} overdue items</p></div>
        {overdue.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">✅</div><p>No overdue returns.</p></div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table" id="overdue-returns-table">
              <thead><tr>
                <th>Serial No</th><th>Name of Book</th><th>Membership Id</th><th>Date of Issue</th><th>Date of Return</th><th>Fine (₹)</th>
              </tr></thead>
              <tbody>
                {overdue.map(t => (
                  <tr key={t.id}>
                    <td><code>{t.bookMovie?.serialNo}</code></td>
                    <td>{t.bookMovie?.name}</td>
                    <td><code>{t.member?.membershipId}</code></td>
                    <td>{new Date(t.issueDate).toLocaleDateString()}</td>
                    <td>{new Date(t.returnDate).toLocaleDateString()}</td>
                    <td style={{ color: '#ff6b6b', fontWeight: 700 }}>₹{t.fineCalculated}</td>
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

export default OverdueReturns;
