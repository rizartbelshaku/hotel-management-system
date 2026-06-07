import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setDropdownOpen(false);
    navigate('/');
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  const adminLinks: { to: string; label: string; end?: boolean }[] = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/hotels', label: 'Hotels' },
    { to: '/admin/rooms', label: 'Rooms' },
    { to: '/admin/reservations', label: 'Reservations' },
    { to: '/admin/users', label: 'Users' },
  ];

  const links = isAdmin ? adminLinks : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const displayName = isAdmin ? 'Admin' : user?.name ?? '';

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

            <div className={`nav-links-wrapper nav-links-admin ${menuOpen ? 'open' : ''}`}>
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
            <div className="nav-user-dropdown" ref={dropdownRef}>
              <button
                type="button"
                className={`nav-user-trigger ${dropdownOpen ? 'open' : ''} ${isAdmin ? 'nav-user-trigger-admin' : ''}`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <span className={`nav-user-trigger-icon ${isAdmin ? 'nav-user-trigger-icon-admin' : ''}`}>
                  <UserIcon />
                </span>
                <span className="nav-user-trigger-name">{displayName}</span>
                <svg className="nav-user-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="nav-user-menu">
                  {!isAdmin && (
                    <>
                      <Link to="/my-reservations" className="nav-user-menu-item" onClick={closeMenu}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        My Reservations
                      </Link>
                      <Link to="/profile" className="nav-user-menu-item" onClick={closeMenu}>
                        <UserIcon />
                        Profile
                      </Link>
                      <div className="nav-user-menu-divider" />
                    </>
                  )}
                  <button type="button" className="nav-user-menu-item nav-user-menu-logout" onClick={handleLogout}>
                    <LogoutIcon />
                    Logout
                  </button>
                </div>
              )}
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
    </nav>
  );
};

export default Navbar;
