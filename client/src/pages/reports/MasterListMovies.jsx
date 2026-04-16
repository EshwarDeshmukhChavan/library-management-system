import { useState, useEffect } from 'react';
import AppLayout from '../../components/Layout/AppLayout';
import { reportsAPI } from '../../services/api';
import '../../pages/home/Home.css';

const MasterListMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadMovies(); }, []);

  const loadMovies = async () => {
    try { const res = await reportsAPI.getMovies(); setMovies(res.data); }
    catch (err) { console.error('Error:', err); }
    finally { setLoading(false); }
  };

  if (loading) return <AppLayout><div className="loading-screen"><div className="spinner"></div><p>Loading...</p></div></AppLayout>;

  return (
    <AppLayout>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        <div className="page-header"><h2>Master List of Movies</h2><p>{movies.length} movies in the library</p></div>
        {movies.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📭</div><p>No movies found.</p></div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table" id="master-movies-table">
              <thead><tr><th>Serial No</th><th>Name of Movie</th><th>Author Name</th><th>Category</th><th>Status</th><th>Cost (₹)</th><th>Procurement Date</th></tr></thead>
              <tbody>
                {movies.map(m => (
                  <tr key={m.id}>
                    <td><code>{m.serialNo}</code></td><td>{m.name}</td><td>{m.authorName}</td>
                    <td>{m.category?.name}</td><td><span className={`status-badge ${m.status.toLowerCase()}`}>{m.status}</span></td>
                    <td>₹{m.cost}</td><td>{new Date(m.procurementDate).toLocaleDateString()}</td>
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

export default MasterListMovies;
