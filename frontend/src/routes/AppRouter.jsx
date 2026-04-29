import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
const Home = lazy(() => import('../pages/Home'));
const Search = lazy(() => import('../pages/Search'));
const Library = lazy(() => import('../pages/Library'));
const Liked = lazy(() => import('../pages/Liked'));
const Profile = lazy(() => import('../pages/Profile'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Pricing = lazy(() => import('../pages/Pricing'));
const ArtistDashboard = lazy(() => import('../pages/artist/ArtistDashboard'));
const ArtistUpload = lazy(() => import('../pages/artist/ArtistUpload'));
const ArtistAnalytics = lazy(() => import('../pages/artist/ArtistAnalytics'));
const ArtistEarnings = lazy(() => import('../pages/artist/ArtistEarnings'));
const ArtistProfile = lazy(() => import('../pages/artist/ArtistProfile'));
const Leaderboard = lazy(() => import('../pages/Leaderboard'));

const AppRouter = () => {
  const location = useLocation();

  return (
    <div key={location.pathname} className="route-transition">
      <Suspense fallback={<div className="skeleton-grid"><div className="skeleton-card" /></div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
          <Route path="/playlists" element={<ProtectedRoute><Library /></ProtectedRoute>} />
          <Route path="/liked" element={<ProtectedRoute><Liked /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pricing" element={<ProtectedRoute><Pricing /></ProtectedRoute>} />
          <Route path="/artist/dashboard" element={<ProtectedRoute><ArtistDashboard /></ProtectedRoute>} />
          <Route path="/artist/upload" element={<ProtectedRoute><ArtistUpload /></ProtectedRoute>} />
          <Route path="/artist/analytics" element={<ProtectedRoute><ArtistAnalytics /></ProtectedRoute>} />
          <Route path="/artist/earnings" element={<ProtectedRoute><ArtistEarnings /></ProtectedRoute>} />
          <Route path="/artist/profile" element={<ProtectedRoute><ArtistProfile /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default AppRouter;
