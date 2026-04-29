import { Navigate, useLocation } from 'react-router-dom';
import { useMusic } from '../context/MusicContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useMusic();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
};

export default ProtectedRoute;
