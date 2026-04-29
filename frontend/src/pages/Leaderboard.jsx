import { useEffect, useState } from 'react';
import axios from '../api/axios';

const Leaderboard = () => {
  const [data, setData] = useState({ topListeners: [], trendingTracks: [] });

  useEffect(() => {
    axios.get('/social/leaderboard').then((res) => setData(res.data)).catch(() => {});
  }, []);

  return (
    <main className="main-content">
      <h2 className="section-title">Leaderboard</h2>
      <div className="pricing-grid">
        <div className="card">
          <h4>Top listeners</h4>
          {data.topListeners.map((item) => <p key={item.id}>{item.username} — {item.playCount}</p>)}
        </div>
        <div className="card">
          <h4>Trending tracks</h4>
          {data.trendingTracks.map((item) => <p key={item.id}>{item.title} — {item.plays}</p>)}
        </div>
      </div>
    </main>
  );
};

export default Leaderboard;
