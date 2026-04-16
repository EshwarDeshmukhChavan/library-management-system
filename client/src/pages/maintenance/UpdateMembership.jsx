import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import { membersAPI } from '../../services/api';
import '../../pages/home/Home.css';

const UpdateMembership = () => {
  const navigate = useNavigate();
  const [membershipId, setMembershipId] = useState('');
  const [member, setMember] = useState(null);
  const [action, setAction] = useState('extend');
  const [extensionMonths, setExtensionMonths] = useState('6');
  const [error, setError] = useState('');
  const [searchError, setSearchError] = useState('');

  const handleSearch = async () => {
    setSearchError('');
    if (!membershipId) { setSearchError('Membership number is required.'); return; }
    try {
      const res = await membersAPI.getById(membershipId);
      setMember(res.data);
    } catch (err) {
      setSearchError('Member not found.');
      setMember(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await membersAPI.update(membershipId, { action, extensionMonths: parseInt(extensionMonths) });
      navigate('/confirmation');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update membership.');
    }
  };

  return (
    <AppLayout>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        <div className="page-header"><h2>Update Membership</h2></div>
        <div className="form-card">
          <div className="form-group">
            <label htmlFor="update-mem-id">Membership Number *</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="text" id="update-mem-id" value={membershipId} onChange={(e) => setMembershipId(e.target.value)} placeholder="e.g., MEM000001" style={{ flex: 1 }} />
              <button type="button" className="btn btn-primary" onClick={handleSearch}>🔍 Search</button>
            </div>
          </div>
          {searchError && <div className="error-message">{searchError}</div>}

          {member && (
            <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
              {error && <div className="error-message">{error}</div>}
              <div className="success-message" style={{ marginBottom: '1rem' }}>
                Member: {member.firstName} {member.lastName} | Status: {member.status}
              </div>
              <div className="form-group"><label>Start Date</label>
                <input type="date" value={member.startDate?.split('T')[0]} readOnly className="readonly-field" /></div>
              <div className="form-group"><label>End Date</label>
                <input type="date" value={member.endDate?.split('T')[0]} readOnly className="readonly-field" /></div>
              <div className="form-group"><label>Action</label>
                <div className="radio-group">
                  <label className="radio-label"><input type="radio" name="action" value="extend" checked={action === 'extend'} onChange={(e) => setAction(e.target.value)} /> Extend Membership</label>
                  <label className="radio-label"><input type="radio" name="action" value="remove" checked={action === 'remove'} onChange={(e) => setAction(e.target.value)} /> Remove Membership</label>
                </div>
              </div>
              {action === 'extend' && (
                <div className="form-group"><label>Extension Duration</label>
                  <div className="radio-group">
                    <label className="radio-label"><input type="radio" name="ext" value="6" checked={extensionMonths === '6'} onChange={(e) => setExtensionMonths(e.target.value)} /> Six Months</label>
                    <label className="radio-label"><input type="radio" name="ext" value="12" checked={extensionMonths === '12'} onChange={(e) => setExtensionMonths(e.target.value)} /> One Year</label>
                    <label className="radio-label"><input type="radio" name="ext" value="24" checked={extensionMonths === '24'} onChange={(e) => setExtensionMonths(e.target.value)} /> Two Years</label>
                  </div>
                </div>
              )}
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" id="btn-confirm-update-mem">✓ Confirm</button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/cancel')}>✕ Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default UpdateMembership;
