import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPlaylists, createPlaylist, deletePlaylist, getPlaylist, removeTrackFromPlaylist, updatePlaylist } from '../api/api';
import { useMusic } from '../context/MusicContext';
import { Play, Shuffle, Trash2 } from 'lucide-react';
import { usePullToRefresh } from '../hooks/usePullToRefresh';

const Library = () => {
  const [searchParams] = useSearchParams();
  const [playlists, setPlaylists] = useState([]);
  const [newName, setNewName] = useState('');
  const [newCoverUrl, setNewCoverUrl] = useState('');
  const [newCoverFile, setNewCoverFile] = useState(null);
  const [newMode, setNewMode] = useState('sequence');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistCoverUrl, setPlaylistCoverUrl] = useState('');
  const [playlistCoverFile, setPlaylistCoverFile] = useState(null);
  const [playlistMode, setPlaylistMode] = useState('sequence');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, playTrack, toMediaUrl } = useMusic();

  const fetchPlaylists = async () => {
    try {
      const res = await getPlaylists();
      setPlaylists(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Плейлисттерді жүктеу сәтсіз аяқталды');
    }
  };

  useEffect(() => {
    if (user) fetchPlaylists();
  }, [user]);

  const { containerRef, pullDistance, refreshing } = usePullToRefresh(fetchPlaylists, !!user);

  useEffect(() => {
    if (searchParams.get('create') === '1') {
      const input = document.getElementById('createPlaylistInput');
      if (input) input.focus();
    }
  }, [searchParams]);

  if (!user) {
    return <main className="main-content"><p>Жүктелуде...</p></main>;
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const payload = new FormData();
      payload.append('name', newName);
      payload.append('play_mode', newMode);
      if (newCoverUrl.trim()) payload.append('cover_image', newCoverUrl.trim());
      if (newCoverFile) payload.append('cover', newCoverFile);

      await createPlaylist(payload);
      setNewName('');
      setNewCoverUrl('');
      setNewCoverFile(null);
      setNewMode('sequence');
      setError('');
      setSuccess('Плейлист сәтті құрылды');
      fetchPlaylists();
    } catch (err) {
      setError(err.response?.data?.message || 'Плейлист құру сәтсіз аяқталды');
    }
  };

  const handleDeletePlaylist = async (id) => {
    if (window.confirm('Плейлистті жою?')) {
      try {
        await deletePlaylist(id);
        fetchPlaylists();
        if (selectedPlaylist?.id === id) setSelectedPlaylist(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Плейлистті жою сәтсіз аяқталды');
      }
    }
  };

  const handleViewPlaylist = async (id) => {
    try {
      const res = await getPlaylist(id);
      setSelectedPlaylist(res.data);
      setPlaylistCoverUrl(res.data.cover_image || '');
      setPlaylistCoverFile(null);
      setPlaylistMode(res.data.play_mode || 'sequence');
      setSuccess('');
    } catch (err) {
      setError(err.response?.data?.message || 'Плейлистті ашу сәтсіз аяқталды');
    }
  };

  const shuffleTracks = (tracks) => {
    const next = [...tracks];
    for (let i = next.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    return next;
  };

  const handlePlayPlaylist = (forceMode) => {
    if (!selectedPlaylist?.Tracks?.length) return;
    const mode = forceMode || selectedPlaylist.play_mode || 'sequence';
    const queue = mode === 'shuffle' ? shuffleTracks(selectedPlaylist.Tracks) : selectedPlaylist.Tracks;
    playTrack(queue[0], queue);
  };

  const handleSavePlaylistMeta = async () => {
    if (!selectedPlaylist) return;
    try {
      const payload = new FormData();
      payload.append('play_mode', playlistMode);
      payload.append('cover_image', playlistCoverUrl);
      if (playlistCoverFile) payload.append('cover', playlistCoverFile);

      await updatePlaylist(selectedPlaylist.id, payload);
      const res = await getPlaylist(selectedPlaylist.id);
      setSelectedPlaylist(res.data);
      setSuccess('Плейлист параметрлері сақталды');
      fetchPlaylists();
    } catch (err) {
      setError(err.response?.data?.message || 'Плейлистті жаңарту сәтсіз аяқталды');
    }
  };

  const handleRemoveTrack = async (playlistId, trackId) => {
    try {
      await removeTrackFromPlaylist(playlistId, trackId);
      if (selectedPlaylist?.id === playlistId) {
        const updated = await getPlaylist(playlistId);
        setSelectedPlaylist(updated.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Тректі өшіру сәтсіз аяқталды');
    }
  };

  return (
    <main className="main-content page-refresh-root" ref={containerRef}>
      <div className="pull-refresh-indicator" style={{ height: `${pullDistance}px` }}>
        <span>{refreshing ? 'Жаңартылуда...' : 'Жаңарту үшін тартыңыз'}</span>
      </div>
      <div className="library-header">
        <p className="text-muted">Your Library</p>
        <h2 className="section-title">Менің плейлисттерім</h2>
      </div>
      {error ? <p className="error-text">{error}</p> : null}
      {success ? <p className="success-text">{success}</p> : null}

      <form onSubmit={handleCreate} className="library-create-form">
        <div className="library-create-row">
          <input id="createPlaylistInput" type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Жаңа плейлист аты" />
          <select value={newMode} onChange={(e) => setNewMode(e.target.value)}>
            <option value="sequence">Ретімен</option>
            <option value="shuffle">Рандом</option>
          </select>
          <button type="submit">Құру</button>
        </div>
        <div className="library-create-row">
          <input type="text" value={newCoverUrl} onChange={(e) => setNewCoverUrl(e.target.value)} placeholder="Плейлист cover URL (міндетті емес)" />
          <input type="file" accept="image/*" onChange={(e) => setNewCoverFile(e.target.files?.[0] || null)} />
        </div>
      </form>

      <div className="grid-cards">
        {playlists.map(p => (
          <div key={p.id} className="card playlist-card" onClick={() => handleViewPlaylist(p.id)}>
            <img src={p.cover_image ? toMediaUrl(p.cover_image) : 'https://via.placeholder.com/150/F48FB1/FFFFFF?text=Playlist'} alt={p.name} />
            <h4>{p.name}</h4>
            <p>{p.Tracks?.length || 0} трек</p>
            <button className="icon-btn" onClick={(e) => { e.stopPropagation(); handleDeletePlaylist(p.id); }} aria-label="Delete playlist">
              <Trash2 className="ui-icon" />
            </button>
          </div>
        ))}
      </div>

      {!playlists.length ? (
        <div className="empty-state">
          <h3>Әлі плейлист жоқ</h3>
          <p>Жоғарыдағы форма арқылы бірінші плейлистіңізді жасаңыз.</p>
        </div>
      ) : null}

      {selectedPlaylist && (
        <div className="playlist-details">
          <h3>{selectedPlaylist.name}</h3>

          <div className="playlist-meta-controls">
            <input type="text" value={playlistCoverUrl} onChange={(e) => setPlaylistCoverUrl(e.target.value)} placeholder="Cover URL" />
            <input type="file" accept="image/*" onChange={(e) => setPlaylistCoverFile(e.target.files?.[0] || null)} />
            <select value={playlistMode} onChange={(e) => setPlaylistMode(e.target.value)}>
              <option value="sequence">Ретімен</option>
              <option value="shuffle">Рандом</option>
            </select>
            <button type="button" onClick={handleSavePlaylistMeta}>Сақтау</button>
          </div>

          <div className="playlist-play-actions">
            <button type="button" className="icon-btn" onClick={() => handlePlayPlaylist('sequence')}>
              <Play className="ui-icon" /> Ретімен ойнату
            </button>
            <button type="button" className="icon-btn" onClick={() => handlePlayPlaylist('shuffle')}>
              <Shuffle className="ui-icon" /> Рандом ойнату
            </button>
          </div>

          {selectedPlaylist.Tracks?.map(track => (
            <div key={track.id} className="playlist-track-row">
              <span>{track.title} - {track.Artist?.name || track.artist || 'Белгісіз автор'}</span>
              <button className="icon-btn" onClick={() => handleRemoveTrack(selectedPlaylist.id, track.id)} aria-label="Remove track">×</button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Library;
