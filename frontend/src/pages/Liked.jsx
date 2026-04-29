import { useMusic } from '../context/MusicContext';
import { useEffect, useState } from 'react';
import { getTracks } from '../api/api';
import TrackCard from '../components/TrackCard';
import { Heart, Play, Shuffle } from 'lucide-react';
import { usePullToRefresh } from '../hooks/usePullToRefresh';

const Liked = () => {
  const { likedTracks, playTrack } = useMusic();
  const [tracks, setTracks] = useState([]);
  const [likedTracksData, setLikedTracksData] = useState([]);

  const fetchAll = async () => {
    const res = await getTracks({ limit: 'all' });
    setTracks(res.data);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const { containerRef, pullDistance, refreshing } = usePullToRefresh(fetchAll, true);

  useEffect(() => {
    setLikedTracksData(tracks.filter(t => likedTracks.includes(t.id)));
  }, [tracks, likedTracks]);

  const shuffleTracks = (list) => {
    const next = [...list];
    for (let i = next.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    return next;
  };

  const playLiked = (mode) => {
    if (!likedTracksData.length) return;
    const queue = mode === 'shuffle' ? shuffleTracks(likedTracksData) : likedTracksData;
    playTrack(queue[0], queue);
  };

  return (
    <main className="main-content page-refresh-root" ref={containerRef}>
      <div className="pull-refresh-indicator" style={{ height: `${pullDistance}px` }}>
        <span>{refreshing ? 'Жаңартылуда...' : 'Жаңарту үшін тартыңыз'}</span>
      </div>
      <h2 className="section-title"><Heart className="ui-icon" /> Сүйікті тректерім</h2>
      <div className="playlist-play-actions">
        <button type="button" className="icon-btn" onClick={() => playLiked('sequence')}>
          <Play className="ui-icon" /> Ретімен ойнату
        </button>
        <button type="button" className="icon-btn" onClick={() => playLiked('shuffle')}>
          <Shuffle className="ui-icon" /> Рандом ойнату
        </button>
      </div>
      <div className="grid-cards">
        {likedTracksData.map(track => (
          <TrackCard key={track.id} track={track} tracksList={likedTracksData} />
        ))}
      </div>
    </main>
  );
};

export default Liked;
