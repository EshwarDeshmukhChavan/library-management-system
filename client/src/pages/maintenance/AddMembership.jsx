import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import { membersAPI } from '../../services/api';
import '../../pages/home/Home.css';

const AddMembership = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '', lastName: '', contactNumber: '', contactAddress: '',
    aadharCardNo: '', startDate: '', endDate: '', duration: '6'
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };

    // Auto-calculate end date based on duration
    if ((name === 'startDate' || name === 'duration') && updated.startDate) {
      const start = new Date(updated.startDate);
      const months = parseInt(updated.duration);
      start.setMonth(start.getMonth() + months);
      updated.endDate = start.toISOString().split('T')[0];
    }

    setForm(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { firstName, lastName, contactNumber, contactAddress, aadharCardNo, startDate, endDate } = form;
    if (!firstName || !lastName || !contactNumber || !contactAddress || !aadharCardNo || !startDate || !endDate) {
      setError('All fields are required.');
      return;
    }

    try {
      await membersAPI.create({ firstName, lastName, contactNumber, contactAddress, aadharCardNo, startDate, endDate });
      navigate('/confirmation');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add membership.');
    }
  };

  return (
    <AppLayout>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        <div className="page-header"><h2>Add Membership</h2></div>
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group"><label htmlFor="add-mem-fname">First Name *</label>
              <input type="text" id="add-mem-fname" name="firstName" value={form.firstName} onChange={handleChange} required /></div>
            <div className="form-group"><label htmlFor="add-mem-lname">Last Name *</label>
              <input type="text" id="add-mem-lname" name="lastName" value={form.lastName} onChange={handleChange} required /></div>
            <div className="form-group"><label htmlFor="add-mem-contact">Contact Number *</label>
              <input type="text" id="add-mem-contact" name="contactNumber" value={form.contactNumber} onChange={handleChange} required /></div>
            <div className="form-group"><label htmlFor="add-mem-address">Contact Address *</label>
              <input type="text" id="add-mem-address" name="contactAddress" value={form.contactAddress} onChange={handleChange} required /></div>
            <div className="form-group"><label htmlFor="add-mem-aadhar">Aadhar Card No *</label>
              <input type="text" id="add-mem-aadhar" name="aadharCardNo" value={form.aadharCardNo} onChange={handleChange} required /></div>
            <div className="form-group"><label htmlFor="add-mem-start">Start Date *</label>
              <input type="date" id="add-mem-start" name="startDate" value={form.startDate} onChange={handleChange} required /></div>
            <div className="form-group"><label htmlFor="add-mem-end">End Date *</label>
              <input type="date" id="add-mem-end" name="endDate" value={form.endDate} readOnly className="readonly-field" /></div>
            <div className="form-group"><label>Membership Duration *</label>
              <div className="radio-group">
                <label className="radio-label"><input type="radio" name="duration" value="6" checked={form.duration === '6'} onChange={handleChange} /> Six Months</label>
                <label className="radio-label"><input type="radio" name="duration" value="12" checked={form.duration === '12'} onChange={handleChange} /> One Year</label>
                <label className="radio-label"><input type="radio" name="duration" value="24" checked={form.duration === '24'} onChange={handleChange} /> Two Years</label>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" id="btn-confirm-add-mem">✓ Confirm</button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/cancel')}>✕ Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default AddMembership;
