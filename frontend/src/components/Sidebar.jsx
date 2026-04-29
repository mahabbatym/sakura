import { Link, useLocation } from 'react-router-dom';
import { useMusic } from '../context/MusicContext';
import logo from '../assets/Sakura.png';
import { Home, Search, Library, Plus, Heart, UserCircle, CreditCard, Activity } from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const { user, logout } = useMusic();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <aside className="sidebar">
      <div className="logo">
        <img src={logo} alt="Sakura" />
        {isOpen && <h2>SAKURA</h2>}
      </div>
      
      <nav className="menu-items">
        <Link to="/" className={isActive('/')}>
          <Home className="nav-icon" />
          {isOpen && <span>Басты бет</span>}
        </Link>
        <Link to="/search" className={isActive('/search')}>
          <Search className="nav-icon" />
          {isOpen && <span>Іздеу</span>}
        </Link>
        <Link to="/library" className={isActive('/library')}>
          <Library className="nav-icon" />
          {isOpen && <span>Кітапхана</span>}
        </Link>
      </nav>
      
      <hr className="divider" />
      
      <nav className="menu-items">
        <Link to="/library?create=1" className={isActive('/library')}>
          <Plus className="nav-icon" />
          {isOpen && <span>Жаңа плейлист</span>}
        </Link>
        <Link to="/liked" className={isActive('/liked')}>
          <Heart className="nav-icon" />
          {isOpen && <span>Сүйіктілерім</span>}
        </Link>
        <Link to="/pricing" className={isActive('/pricing')}>
          <CreditCard className="nav-icon" />
          {isOpen && <span>Тарифтер</span>}
        </Link>
        <Link to="/social/feed" className={isActive('/social/feed')}>
          <Activity className="nav-icon" />
          {isOpen && <span>Feed</span>}
        </Link>
        {user ? (
          <Link to="/profile" className={isActive('/profile')}>
            <UserCircle className="nav-icon" />
            {isOpen && <span>Жеке бет</span>}
          </Link>
        ) : null}
      </nav>

      <div className="sidebar-footer">
        {user ? (
          isOpen ? (
            <button className="auth-btn logout" onClick={logout}>
              Шығу
            </button>
          ) : null
        ) : (
          isOpen ? (
            <Link to="/login" className="auth-btn login">
              Кіру
            </Link>
          ) : null
        )}
      </div>
    </aside>
  );
};

export default Sidebar;