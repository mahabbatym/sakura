import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTracks } from '../api/api';
import TrackCard from '../components/TrackCard';
import { UserCircle } from 'lucide-react';
import { usePullToRefresh } from '../hooks/usePullToRefresh';
import SubscriptionBanner from '../components/SubscriptionBanner';

const Home = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState('free');
 
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setPlan(parsed.subscriptionPlan || 'free');
    }
  }, []);

  const fetchTracks = async () => {
    try {
      const res = await getTracks({ limit: 'all' });
      const shuffledTracks = shuffleArray(res.data);
      setTracks(shuffledTracks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  const { containerRef, pullDistance, refreshing } = usePullToRefresh(fetchTracks, true);

  if (loading) {
    return (
      <div className="skeleton-grid">
        {Array.from({ length: 8 }).map((_, index) => <div key={index} className="skeleton-card" />)}
      </div>
    );
  }
 
  return (
    <div ref={containerRef} className="main-content home-page page-refresh-root">
      <div className="pull-refresh-indicator" style={{ height: `${pullDistance}px` }}>
        <span>{refreshing ? 'Жаңартылуда...' : 'Жаңарту үшін тартыңыз'}</span>
      </div>
      <header className="top-bar home-top-bar">
        <div className="home-heading">
          <span className="home-kicker">Home</span>
          <h1>{user ? `${user.username || 'тыңдарман'}, қайырлы күн` : 'Қайырлы күн'}</h1>
        </div>
        <div className="home-slogan" aria-label="Sakura slogan">
          <p>Sakura — Music for your soul</p>
        </div>
        <div className="user-info">
          {user ? (
            <Link to="/profile" className="profile-link">
              <UserCircle className="ui-icon" />
              <span>Жеке бет</span>
            </Link>
          ) : (
            <button className="auth-btn login" onClick={() => window.location.href = '/login'}>Кіру</button>
          )}
        </div>
      </header>

      <section>
        <SubscriptionBanner plan={plan} />
        <h2 className="section-title">Барлық музыкалар</h2>
        <div className="grid-cards home-all-tracks">
          {tracks.map(track => (
            <TrackCard key={track.id} track={track} tracksList={tracks} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
