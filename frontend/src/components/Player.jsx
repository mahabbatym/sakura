import { useState, useEffect } from 'react';
import { useMusic } from '../context/MusicContext';
import { SkipBack, SkipForward, Play, Pause, Volume2, X, Shuffle, Repeat, Repeat1, Moon, VolumeX } from 'lucide-react';
import WaveformVisualizer from './WaveformVisualizer';

const Player = ({ onClose }) => {
  const {
    currentTrack, isPlaying, setIsPlaying, nextTrack, prevTrack, audioRef, toMediaUrl,
    repeatMode, setRepeatMode, shuffleEnabled, setShuffleEnabled,
    isMuted, setIsMuted, volume, setVolume, setSleepTimerMinutes,
  } = useMusic();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!audioRef?.current) return;
    audioRef.current.volume = volume;
  }, [volume, audioRef]);

  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const resetOnTrackChange = () => {
      setCurrentTime(0);
      setDuration(audio.duration);
    };
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('loadeddata', resetOnTrackChange);
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('loadeddata', resetOnTrackChange);
    };
  }, [audioRef, currentTrack?.id]);

  const handleSeek = (e) => {
    if (!audioRef?.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = percent * duration;
  };

  const formatTime = (sec) => {
    if (isNaN(sec)) return '0:00';
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!currentTrack) return null;

  const coverUrl = currentTrack.cover_image ? toMediaUrl(currentTrack.cover_image) : '/default-cover.jpg';
  const artistImageUrl = currentTrack.Artist?.image ? toMediaUrl(currentTrack.Artist.image) : '';
  const artistName = currentTrack.Artist?.name || currentTrack.artist || currentTrack.artist_name || 'Белгісіз автор';

  return (
    <footer className="player-bar">
      <button className="player-close" onClick={onClose} aria-label="Close player">
        <X className="ui-icon" />
      </button>
      <div className="player-left">
        <img src={coverUrl} alt="cover" className="player-cover" loading="lazy" />
        <div className="player-track-info">
          <h4>{currentTrack.title}</h4>
          <div className="player-artist-row">
            {artistImageUrl ? <img src={artistImageUrl} alt="artist" className="artist-avatar" /> : null}
            <p>{artistName}</p>
          </div>
        </div>
      </div>
      
      <div className="player-center">
        <WaveformVisualizer />
        <div className="player-controls">
          <button onClick={prevTrack} className="control-btn" aria-label="Previous">
            <SkipBack className="ui-icon" />
          </button>
          <button onClick={() => setIsPlaying(!isPlaying)} className="control-btn play-btn">
            {isPlaying ? <Pause className="ui-icon" /> : <Play className="ui-icon" />}
          </button>
          <button onClick={nextTrack} className="control-btn" aria-label="Next">
            <SkipForward className="ui-icon" />
          </button>
        </div>
        <div className="progress-container">
          <span className="time">{formatTime(currentTime)}</span>
          <div className="progress-bar" onClick={handleSeek}>
            <div className="progress" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
          </div>
          <span className="time">{formatTime(duration)}</span>
        </div>
      </div>
      
      <div className="player-right">
        <button className={`icon-btn ${shuffleEnabled ? 'active-pill' : ''}`} onClick={() => setShuffleEnabled(!shuffleEnabled)}><Shuffle className="ui-icon" /></button>
        <button className={`icon-btn ${repeatMode !== 'off' ? 'active-pill' : ''}`} onClick={() => setRepeatMode(repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off')}>
          {repeatMode === 'one' ? <Repeat1 className="ui-icon" /> : <Repeat className="ui-icon" />}
        </button>
        <button className="icon-btn" onClick={() => setSleepTimerMinutes(15)}><Moon className="ui-icon" /></button>
        <button className="icon-btn" onClick={() => setIsMuted(!isMuted)}>
          {isMuted ? <VolumeX className="ui-icon" /> : <Volume2 className="ui-icon" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="volume-slider"
        />
      </div>
    </footer>
  );
};

export default Player;