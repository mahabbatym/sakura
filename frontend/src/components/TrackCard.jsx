import { useState } from 'react';
import { useMusic } from '../context/MusicContext';
import { addTrackToPlaylist, getPlaylists } from '../api/api';
import { Heart, Plus, Play, Pause } from 'lucide-react';

const TrackCard = ({ track, tracksList }) => {
  const { playTrack, likedTracks, toggleLike, currentTrack, isPlaying, setIsPlaying, toMediaUrl } = useMusic();
  const [showMenu, setShowMenu] = useState(false);
  const [playlists, setPlaylists] = useState([]);

  const coverUrl = track.cover_image ? toMediaUrl(track.cover_image) : '/default-cover.jpg';
  const artistImageUrl = track.Artist?.image ? toMediaUrl(track.Artist.image) : '';
  const artistName = track.Artist?.name || track.artist || track.artist_name || 'Белгісіз автор';
  const isLiked = likedTracks.includes(track.id);
  const isCurrentlyPlaying = currentTrack?.id === track.id;

  const handlePlayToggle = (e) => {
    e.stopPropagation();
    if (isCurrentlyPlaying) {
      setIsPlaying(!isPlaying);
      return;
    }
    playTrack(track, tracksList);
  };

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await addTrackToPlaylist(playlistId, track.id);
      alert('Трек плейлистке қосылды');
      setShowMenu(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Тректі плейлистке қосу сәтсіз аяқталды');
    }
  };

  const fetchPlaylists = async (e) => {
    e.stopPropagation();
    try {
      const res = await getPlaylists();
      setPlaylists(res.data);
      setShowMenu(!showMenu);
    } catch (err) {
      if (err.response?.status === 401) {
        window.location.href = '/login';
        return;
      }
      alert(err.response?.data?.message || 'Плейлисттерді жүктеу сәтсіз аяқталды');
    }
  };

  return (
    <div className={`card ${isCurrentlyPlaying ? 'active-card' : ''}`} onClick={() => playTrack(track, tracksList)}>
      <div className="card-image-wrapper">
        <img src={coverUrl} alt={track.title} loading="lazy" />
        <button className="play-overlay" onClick={handlePlayToggle} aria-label="Play track">
           {isCurrentlyPlaying && isPlaying ? <Pause className="ui-icon" /> : <Play className="ui-icon" />}
        </button>
      </div>
      <div className="card-info">
        <h4>{track.title}</h4>
        <div className="card-artist-row">
          {artistImageUrl ? <img src={artistImageUrl} alt="artist" className="artist-avatar" /> : null}
          <p className="card-artist-name">{artistName}</p>
        </div>
      </div>
      
      <div className="card-actions" onClick={e => e.stopPropagation()}>
        <button className="icon-btn card-action-btn" onClick={() => toggleLike(track.id)} aria-label="Like">
          <Heart className={`ui-icon ${isLiked ? 'liked' : ''}`} />
        </button>
        <div className="dropdown-container">
          <button className="icon-btn card-action-btn" onClick={fetchPlaylists} aria-label="Add to playlist">
            <Plus className="ui-icon" />
          </button>
          {showMenu && (
            <div className="dropdown-menu">
              <div className="dropdown-header">Плейлистке қосу</div>
              {playlists.length === 0 ? <div className="dropdown-item">Плейлисттер жоқ</div> : null}
              {playlists.map(p => (
                <div key={p.id} className="dropdown-item" onClick={() => handleAddToPlaylist(p.id)}>
                  {p.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackCard;