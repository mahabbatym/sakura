import { Link } from 'react-router-dom';

const ArtistDashboard = () => (
  <main className="main-content">
    <h2 className="section-title">Artist Dashboard</h2>
    <div className="pricing-grid">
      <Link to="/artist/upload" className="card">Upload</Link>
      <Link to="/artist/analytics" className="card">Analytics</Link>
      <Link to="/artist/earnings" className="card">Earnings</Link>
      <Link to="/artist/profile" className="card">Profile</Link>
    </div>
  </main>
);

export default ArtistDashboard;
