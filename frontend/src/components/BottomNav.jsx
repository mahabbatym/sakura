import { NavLink } from 'react-router-dom';
import { Home, Search, Library, Heart, UserCircle } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

const BottomNav = () => {
  const { user } = useMusic();

  const navItems = [
    { to: '/', label: 'Басты', icon: Home },
    { to: '/search', label: 'Іздеу', icon: Search },
    { to: '/library', label: 'Кітапхана', icon: Library },
    { to: '/liked', label: 'Ұнаған', icon: Heart },
    { to: user ? '/profile' : '/login', label: user ? 'Профиль' : 'Кіру', icon: UserCircle },
  ];

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <Icon className="nav-icon" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
