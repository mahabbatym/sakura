import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTracks } from '../api/api';
import TrackCard from '../components/TrackCard';
import { Menu, UserCircle } from 'lucide-react';
import { usePullToRefresh } from '../hooks/usePullToRefresh';
import SubscriptionBanner from '../components/SubscriptionBanner';
import AudioAd from '../components/AudioAd';
import BannerAd from '../components/BannerAd';

const Home = ({ toggleSidebar }) => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState('free');
  const [mobileSection, setMobileSection] = useState('forYou');
 
  const shuffleArray = (array) => {
    let shuffled = [...array];  
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
      const res = await getTracks();
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
 
  const forYou = tracks.slice(0, 16);
   const more = tracks.slice(16, 32);

  return (
    <div ref={containerRef} className="page-refresh-root">
      <div className="pull-refresh-indicator" style={{ height: `${pullDistance}px` }}>
        <span>{refreshing ? 'Жаңартылуда...' : 'Жаңарту үшін тартыңыз'}</span>
      </div>
      <header className="top-bar">
        <div className="left-controls">
          <button className="hamburger-btn" onClick={toggleSidebar} aria-label="Toggle sidebar">
            <Menu className="ui-icon" />
          </button>
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
        <AudioAd enabled={plan === 'free'} />
        <div
          className="mobile-sections-tabs"
          onTouchStart={(event) => {
            const startX = event.touches[0].clientX;
            const onEnd = (endEvent) => {
              const endX = endEvent.changedTouches[0].clientX;
              const delta = endX - startX;
              if (delta > 50) setMobileSection('forYou');
              if (delta < -50) setMobileSection('more');
            };
            event.currentTarget.addEventListener('touchend', onEnd, { once: true });
          }}
        >
          <button className={`chip ${mobileSection === 'forYou' ? 'active' : ''}`} onClick={() => setMobileSection('forYou')}>Тек сен үшін</button>
          <button className={`chip ${mobileSection === 'more' ? 'active' : ''}`} onClick={() => setMobileSection('more')}>Одан әрі</button>
        </div>
        <h2 className="section-title">Тек сен үшін</h2>
        <div className={`grid-cards ${mobileSection !== 'forYou' ? 'mobile-hidden' : ''}`}>
          {forYou.map(track => (
            <TrackCard key={track.id} track={track} tracksList={tracks} />
          ))}
        </div>
        <BannerAd enabled={plan === 'free'} />

        <h2 className="section-title">Одан әрі тыңдаймыз ба?</h2>
        <div className={`grid-cards ${mobileSection !== 'more' ? 'mobile-hidden' : ''}`}>
          {more.map(track => (
            <TrackCard key={track.id} track={track} tracksList={tracks} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;