import { Link, useLocation } from 'react-router-dom';
import { useMusic } from '../context/MusicContext';
import logo from '../assets/Sakura.png';
import { Home, Search, Library, Plus, Heart, UserCircle, CreditCard } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useMusic();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <aside className="sidebar">
      <div className="logo">
        <img src={logo} alt="Sakura" />
        <h2>SAKURA</h2>
      </div>
      
      <nav className="menu-items">
        <Link to="/" className={isActive('/')}>
          <Home className="nav-icon" />
          <span>Басты бет</span>
        </Link>
        <Link to="/search" className={isActive('/search')}>
          <Search className="nav-icon" />
          <span>Іздеу</span>
        </Link>
        <Link to="/library" className={isActive('/library')}>
          <Library className="nav-icon" />
          <span>Кітапхана</span>
        </Link>
      </nav>
      
      <hr className="divider" />
      
      <nav className="menu-items">
        <Link to="/library?create=1" className={isActive('/library')}>
          <Plus className="nav-icon" />
          <span>Жаңа плейлист</span>
        </Link>
        <Link to="/liked" className={isActive('/liked')}>
          <Heart className="nav-icon" />
          <span>Сүйіктілерім</span>
        </Link>
        <Link to="/pricing" className={isActive('/pricing')}>
          <CreditCard className="nav-icon" />
          <span>Тарифтер</span>
        </Link>
        {user ? (
          <Link to="/profile" className={isActive('/profile')}>
            <UserCircle className="nav-icon" />
            <span>Жеке бет</span>
          </Link>
        ) : null}
      </nav>

      <div className="sidebar-footer">
        {user ? (
          <button className="auth-btn logout" onClick={logout}>
            Шығу
          </button>
        ) : (
          <Link to="/login" className="auth-btn login">
            Кіру
          </Link>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
