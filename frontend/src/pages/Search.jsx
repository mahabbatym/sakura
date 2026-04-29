import { useState, useEffect } from 'react';
import { getTracks } from '../api/api';
import TrackCard from '../components/TrackCard';
import { Search as SearchIcon } from 'lucide-react';
import { usePullToRefresh } from '../hooks/usePullToRefresh';

const Search = () => {
  const [query, setQuery] = useState('');
  const [allTracks, setAllTracks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTracks = async () => {
    try {
      const res = await getTracks();
      setAllTracks(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Тректерді жүктеу сәтсіз аяқталды');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  const { containerRef, pullDistance, refreshing } = usePullToRefresh(fetchTracks, true);

  useEffect(() => {
    if (!query.trim()) {
      setFiltered(allTracks);
      return;
    }

    const results = allTracks.filter(t =>
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.Artist?.name.toLowerCase().includes(query.toLowerCase())
      );
    setFiltered(results);
  }, [query, allTracks]);

  return (
    <section className="main-content page-refresh-root" ref={containerRef}>
      <div className="pull-refresh-indicator" style={{ height: `${pullDistance}px` }}>
        <span>{refreshing ? 'Жаңартылуда...' : 'Жаңарту үшін тартыңыз'}</span>
      </div>
      <header className="top-bar sticky">
        <div className="search-bar">
          <span className="search-icon" aria-hidden="true"><SearchIcon className="ui-icon" /></span>
          <input 
            type="text" 
            placeholder="Не тыңдағыңыз келеді?" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
          />
        </div>
      </header>

      {loading ? (
        <div className="skeleton-grid">
          {Array.from({ length: 6 }).map((_, index) => <div key={index} className="skeleton-card" />)}
        </div>
      ) : null}
      {error ? <p className="error-text">{error}</p> : null}
      
      {!loading && !error && filtered.length === 0 ? (
        <div className="empty-state">
          <h3>Ештеңе табылмады</h3>
          <p>Басқа сөзбен іздеп көріңіз немесе фильтрді өзгертіңіз</p>
        </div>
      ) : null}

      {!loading && !error && filtered.length > 0 ? (
        <div className="grid-cards">
          {filtered.map(track => <TrackCard key={track.id} track={track} tracksList={filtered} />)}
        </div>
      ) : null}
    </section>
  );
};

export default Search;