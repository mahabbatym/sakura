import axios from './axios';
export const getPlaylist = (id) => axios.get(`/playlists/${id}`);
export const deletePlaylist = (id) => axios.delete(`/playlists/${id}`);
export const addTrackToPlaylist = (playlistId, trackId) => axios.post(`/playlists/${playlistId}/tracks`, { trackId });
export const removeTrackFromPlaylist = (playlistId, trackId) => axios.delete(`/playlists/${playlistId}/tracks/${trackId}`);
 
export const register = (data) => axios.post('/auth/register', data);
export const login = (data) => axios.post('/auth/login', data);
export const refreshToken = (refreshToken) => axios.post('/auth/refresh', { refreshToken });
export const logout = (refreshToken) => axios.post('/auth/logout', { refreshToken });
export const getMe = () => axios.get('/auth/me');
 
export const getUserProfile = (id) => axios.get(`/users/${id}`);
export const updateUserProfile = (id, data) => axios.put(`/users/${id}`, data, data instanceof FormData ? {
  headers: { 'Content-Type': 'multipart/form-data' },
} : undefined);
 
export const getTracks = () => axios.get('/tracks');
export const getTrack = (id) => axios.get(`/tracks/${id}`);
export const createTrack = (formData) => axios.post('/tracks', formData);
export const searchTracks = (q) => axios.get(`/tracks/search?q=${q}`);

 
export const getPlaylists = () => axios.get('/playlists');
export const createPlaylist = (data) => axios.post('/playlists', data); 
export const updatePlaylist = (id, data) => axios.put(`/playlists/${id}`, data, data instanceof FormData ? {
  headers: { 'Content-Type': 'multipart/form-data' },
} : undefined);

 
export const getReviews = (trackId) => axios.get(`/tracks/${trackId}/reviews`);
export const createReview = (trackId, data) => axios.post(`/tracks/${trackId}/reviews`, data);
export const updateReview = (reviewId, data) => axios.put(`/reviews/${reviewId}`, data);
export const deleteReview = (reviewId) => axios.delete(`/reviews/${reviewId}`);