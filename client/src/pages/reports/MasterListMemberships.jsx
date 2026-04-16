import { useState, useEffect } from 'react';
import AppLayout from '../../components/Layout/AppLayout';
import { reportsAPI } from '../../services/api';
import '../../pages/home/Home.css';

const MasterListMemberships = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadMembers(); }, []);

  const loadMembers = async () => {
    try { const res = await reportsAPI.getMemberships(); setMembers(res.data); }
    catch (err) { console.error('Error:', err); }
    finally { setLoading(false); }
  };

  if (loading) return <AppLayout><div className="loading-screen"><div className="spinner"></div><p>Loading...</p></div></AppLayout>;

  return (
    <AppLayout>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        <div className="page-header"><h2>List of Active Memberships</h2><p>{members.length} members</p></div>
        {members.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📭</div><p>No memberships found.</p></div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table" id="master-memberships-table">
              <thead><tr>
                <th>Membership Id</th><th>Name</th><th>Contact Number</th><th>Contact Address</th>
                <th>Aadhar Card No</th><th>Start Date</th><th>End Date</th><th>Status</th><th>Pending Fine (₹)</th>
              </tr></thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id}>
                    <td><code>{m.membershipId}</code></td>
                    <td>{m.firstName} {m.lastName}</td>
                    <td>{m.contactNumber}</td><td>{m.contactAddress}</td><td>{m.aadharCardNo}</td>
                    <td>{new Date(m.startDate).toLocaleDateString()}</td>
                    <td>{new Date(m.endDate).toLocaleDateString()}</td>
                    <td><span className={`status-badge ${m.status.toLowerCase()}`}>{m.status}</span></td>
                    <td style={{ color: m.pendingFine > 0 ? '#ff6b6b' : 'inherit' }}>₹{m.pendingFine}</td>
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

export default MasterListMemberships;
