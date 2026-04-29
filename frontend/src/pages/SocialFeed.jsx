import { useEffect, useState } from 'react';
import axios from '../api/axios';

const SocialFeed = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('/social/feed').then((res) => setItems(res.data.activities || [])).catch(() => {});
  }, []);

  return (
    <main className="main-content">
      <h2 className="section-title">Activity Feed</h2>
      <div className="card">
        {items.map((item, index) => <p key={`${item.trackId}-${index}`}>{item.title}</p>)}
      </div>
    </main>
  );
};

export default SocialFeed;
