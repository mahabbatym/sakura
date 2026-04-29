import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { updateUserProfile } from '../api/api';
import { logout as logoutApi } from '../api/api';
import axios from '../api/axios';

const MusicContext = createContext();

export const useMusic = () => useContext(MusicContext);

export const MusicProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [user, setUser] = useState(null);
  const [likedTracks, setLikedTracks] = useState([]);
  const [repeatMode, setRepeatMode] = useState('off');
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState(0);
  const audioRef = useRef(new Audio());

  const mediaBaseUrl = (import.meta.env.VITE_MEDIA_URL || import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '');
  const toMediaUrl = (path) => {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    return `${mediaBaseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (Array.isArray(parsedUser.likedTracks)) {
        setLikedTracks(parsedUser.likedTracks);
        return;
      }
    }
    const storedLikes = localStorage.getItem('likedTracks');
    if (storedLikes) setLikedTracks(JSON.parse(storedLikes));
  }, []);

  useEffect(() => {
    if (Array.isArray(user?.likedTracks)) {
      setLikedTracks(user.likedTracks);
    }
  }, [user?.likedTracks]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    if (!token || !refreshToken) return undefined;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload?.exp) return undefined;
      const expiresAtMs = payload.exp * 1000;
      const refreshInMs = Math.max(1000, expiresAtMs - Date.now() - (5 * 60 * 1000));

      const timer = setTimeout(async () => {
        try {
          const response = await axios.post('/auth/refresh', { refreshToken });
          const nextToken = response.data?.token || response.data?.accessToken;
          if (nextToken) localStorage.setItem('token', nextToken);
          if (response.data?.refreshToken) localStorage.setItem('refreshToken', response.data.refreshToken);
        } catch {
        }
      }, refreshInMs);

      return () => clearTimeout(timer);
    } catch {
      return undefined;
    }
  }, [user?.id, isPlaying]);
 
  useEffect(() => {
    localStorage.setItem('likedTracks', JSON.stringify(likedTracks));
  }, [likedTracks]);
 
  useEffect(() => {
    if (currentTrack) {
      audioRef.current.src = toMediaUrl(currentTrack.file_url);
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
      if (isPlaying) {
        const p = audioRef.current.play();
        if (p?.catch) p.catch(() => {});
      }
    }
  }, [currentTrack, isPlaying, volume, isMuted]);

  useEffect(() => {
    if (currentTrack) {
      if (isPlaying) {
        const p = audioRef.current.play();
        if (p?.catch) p.catch(() => {});
      }
      else audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    audioRef.current.volume = volume;
    audioRef.current.muted = isMuted;
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    const onEnded = () => {
      if (repeatMode === 'one' && currentTrack) {
        audio.currentTime = 0;
        audio.play();
        return;
      }
      if (queue.length && currentTrack) {
        const idx = queue.findIndex(t => t.id === currentTrack.id);
        const next = queue[idx + 1] || (repeatMode === 'all' ? queue[0] : null);
        if (next) {
          setCurrentTrack(next);
          setIsPlaying(true);
        }
      } else {
        setIsPlaying(false);
      }
    };
    audio.addEventListener('ended', onEnded);
    return () => audio.removeEventListener('ended', onEnded);
  }, [queue, currentTrack, repeatMode]);

  useEffect(() => {
    if (!sleepTimerMinutes) return undefined;
    const timer = setTimeout(() => setIsPlaying(false), sleepTimerMinutes * 60 * 1000);
    return () => clearTimeout(timer);
  }, [sleepTimerMinutes, currentTrack?.id]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.target?.tagName === 'INPUT' || event.target?.tagName === 'TEXTAREA') return;
      if (event.code === 'Space') {
        event.preventDefault();
        setIsPlaying((prev) => !prev);
      }
      if (event.code === 'ArrowRight' && audioRef.current) {
        audioRef.current.currentTime = Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + 10);
      }
      if (event.code === 'ArrowLeft' && audioRef.current) {
        audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
      }
      if (event.code === 'ArrowUp') {
        setVolume((prev) => Math.min(1, prev + 0.1));
      }
      if (event.code === 'ArrowDown') {
        setVolume((prev) => Math.max(0, prev - 0.1));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const playTrack = (track, queueList = []) => {
    setCurrentTrack(track);
    setQueue(queueList);
    setIsPlaying(true);
  };

  const nextTrack = () => {
    if (queue.length && currentTrack) {
      const list = shuffleEnabled ? [...queue].sort(() => Math.random() - 0.5) : queue;
      const idx = list.findIndex(t => t.id === currentTrack.id);
      const next = list[idx + 1] || list[0];
      playTrack(next, queue);
    }
  };

  const prevTrack = () => {
    if (queue.length && currentTrack) {
      const idx = queue.findIndex(t => t.id === currentTrack.id);
      const prev = queue[idx - 1] || queue[queue.length - 1];
      playTrack(prev, queue);
    }
  };

  const syncLikedTracks = async (nextLikedTracks) => {
    if (!user?.id) return;
    try {
      const res = await updateUserProfile(user.id, { likedTracks: nextLikedTracks });
      const nextUser = res.data?.user;
      if (nextUser) {
        setUser(nextUser);
        localStorage.setItem('user', JSON.stringify(nextUser));
      }
    } catch {
    }
  };

  const toggleLike = (trackId) => {
    setLikedTracks((prev) => {
      const nextLikedTracks = prev.includes(trackId)
        ? prev.filter((id) => id !== trackId)
        : [...prev, trackId];
      if (user?.id) {
        syncLikedTracks(nextLikedTracks);
      }
      return nextLikedTracks;
    });
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await logoutApi(refreshToken);
      } catch {
      }
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('likedTracks');
    setUser(null);
    setLikedTracks([]);
    window.location.href = '/login';
  };

  return (
    <MusicContext.Provider value={{
      currentTrack, isPlaying, user, setUser,
      likedTracks, toggleLike,
      playTrack, setIsPlaying, nextTrack, prevTrack, logout,
      audioRef, toMediaUrl,
      repeatMode, setRepeatMode, shuffleEnabled, setShuffleEnabled,
      isMuted, setIsMuted, volume, setVolume, sleepTimerMinutes, setSleepTimerMinutes,
    }}>
      {children}
    </MusicContext.Provider>
  );
};