import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  const userLinks: { to: string; label: string; end?: boolean }[] = [
    { to: '/my-reservations', label: 'My Reservations' },
    { to: '/profile', label: 'Profile' },
  ];

  const adminLinks: { to: string; label: string; end?: boolean }[] = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/hotels', label: 'Hotels' },
    { to: '/admin/rooms', label: 'Rooms' },
    { to: '/admin/reservations', label: 'Reservations' },
    { to: '/admin/users', label: 'Users' },
  ];

  const links = isAdmin ? adminLinks : user ? userLinks : [];

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <span className="nav-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
              <path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01" />
            </svg>
          </span>
          <span className="nav-logo-text">
            Hotel<span>Book</span>
          </span>
        </Link>

        {links.length > 0 && (
          <>
            <button
              className={`nav-toggle ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>

            <div className={`nav-links-wrapper ${isAdmin ? 'nav-links-admin' : ''} ${menuOpen ? 'open' : ''}`}>
              <div className="nav-links">
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="nav-auth">
          {user ? (
            <div className="nav-user-info">
              <div className="nav-avatar">{user.name.charAt(0).toUpperCase()}</div>
              <div className="nav-user-details">
                <span className="nav-user-name">{user.name}</span>
                <span className={`nav-user-role ${isAdmin ? 'role-admin' : 'role-user'}`}>
                  {isAdmin ? 'Administrator' : 'Guest'}
                </span>
              </div>
            </div>
          ) : (
            <div className="nav-auth-buttons">
              <Link to="/login" className="btn btn-nav-login" onClick={closeMenu}>
                Login
              </Link>
              <Link to="/register" className="btn btn-nav-register" onClick={closeMenu}>
                Register
              </Link>
            </div>
          )}
        </div>

      </div>

      {user && (
        <button
          onClick={handleLogout}
          className="btn-nav-logout"
          aria-label="Logout"
          title="Logout"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      )}
    </nav>
  );
};

export default Navbar;
