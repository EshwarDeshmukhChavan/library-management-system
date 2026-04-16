import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import { transactionsAPI } from '../../services/api';
import '../../pages/home/Home.css';

const PayFine = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [finePaid, setFinePaid] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransaction();
  }, []);

  const loadTransaction = async () => {
    try {
      const transactionId = searchParams.get('transactionId');
      if (!transactionId) {
        // Show form to look up by active transactions
        setLoading(false);
        return;
      }

      // Get the transaction details - it should have fine info after return
      const res = await transactionsAPI.getActive();
      const allTransactions = res.data;
      
      // Also check returned ones that might have pending fine
      const found = allTransactions.find(t => t.id === parseInt(transactionId));
      if (found) {
        setTransaction(found);
      }
    } catch (err) {
      console.error('Error loading transaction:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!transaction) {
      setError('No transaction selected.');
      return;
    }

    if (transaction.fineCalculated > 0 && !finePaid) {
      setError('Fine must be paid before completing the return.');
      return;
    }

    try {
      await transactionsAPI.payFine({
        transactionId: transaction.id,
        finePaid,
        remarks
      });
      navigate('/confirmation');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process fine payment.');
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="loading-screen"><div className="spinner"></div><p>Loading...</p></div>
      </AppLayout>
    );
  }

  if (!transaction) {
    return (
      <AppLayout>
        <div style={{ animation: 'fadeIn 0.4s ease' }}>
          <div className="page-header">
            <h2>Pay Fine</h2>
            <p>Please return a book first to access the fine payment page.</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/return-book')}>
            ↩️ Go to Return Book
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        <div className="page-header">
          <h2>Pay Fine</h2>
          <p>Complete the return transaction</p>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label>Book Name</label>
              <input type="text" value={transaction.bookMovie?.name || ''} readOnly className="readonly-field" />
            </div>

            <div className="form-group">
              <label>Author</label>
              <input type="text" value={transaction.bookMovie?.authorName || ''} readOnly className="readonly-field" />
            </div>

            <div className="form-group">
              <label>Serial No</label>
              <input type="text" value={transaction.bookMovie?.serialNo || ''} readOnly className="readonly-field" />
            </div>

            <div className="form-group">
              <label>Issue Date</label>
              <input type="date" value={transaction.issueDate?.split('T')[0] || ''} readOnly className="readonly-field" />
            </div>

            <div className="form-group">
              <label>Return Date</label>
              <input type="date" value={transaction.returnDate?.split('T')[0] || ''} readOnly className="readonly-field" />
            </div>

            <div className="form-group">
              <label>Actual Return Date</label>
              <input type="date" value={transaction.actualReturnDate?.split('T')[0] || new Date().toISOString().split('T')[0]} readOnly className="readonly-field" />
            </div>

            <div className="form-group">
              <label>Fine Calculated (₹)</label>
              <input
                type="text"
                value={`₹ ${transaction.fineCalculated || 0}`}
                readOnly
                className="readonly-field"
                style={{ fontWeight: transaction.fineCalculated > 0 ? '700' : 'normal', color: transaction.fineCalculated > 0 ? '#ff6b6b' : 'inherit' }}
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={finePaid}
                  onChange={(e) => setFinePaid(e.target.checked)}
                  id="fine-paid-checkbox"
                />
                Fine Paid
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="fine-remarks">Remarks</label>
              <textarea
                id="fine-remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={3}
                placeholder="Optional remarks..."
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" id="btn-confirm-fine">
                ✓ Confirm
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/cancel')} id="btn-cancel-fine">
                ✕ Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default PayFine;
