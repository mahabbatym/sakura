import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { updateUserProfile } from '../api/api';
import { logout as logoutApi } from '../api/api';

const MusicContext = createContext();

export const useMusic = () => useContext(MusicContext);

export const MusicProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [user, setUser] = useState(null);
  const [likedTracks, setLikedTracks] = useState([]);   
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
    localStorage.setItem('likedTracks', JSON.stringify(likedTracks));
  }, [likedTracks]);
 
  useEffect(() => {
    if (currentTrack) {
      audioRef.current.src = toMediaUrl(currentTrack.file_url);
      if (isPlaying) {
        const p = audioRef.current.play();
        if (p?.catch) p.catch(() => {});
      }
    }
  }, [currentTrack, isPlaying]);

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
    const audio = audioRef.current;
    const onEnded = () => {
      if (queue.length && currentTrack) {
        const idx = queue.findIndex(t => t.id === currentTrack.id);
        const next = queue[idx + 1] || queue[0];
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
  }, [queue, currentTrack]);

  const playTrack = (track, queueList = []) => {
    setCurrentTrack(track);
    setQueue(queueList);
    setIsPlaying(true);
  };

  const nextTrack = () => {
    if (queue.length && currentTrack) {
      const idx = queue.findIndex(t => t.id === currentTrack.id);
      const next = queue[idx + 1] || queue[0];
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
      audioRef, toMediaUrl
    }}>
      {children}
    </MusicContext.Provider>
  );
};