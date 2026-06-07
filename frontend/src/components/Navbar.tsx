import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">HotelBook</Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/hotels">Hotels</Link>
          {user && !isAdmin && (
            <>
              <Link to="/my-reservations">My Reservations</Link>
              <Link to="/profile">Profile</Link>
            </>
          )}
          {isAdmin && (
            <>
              <Link to="/admin/dashboard">Dashboard</Link>
              <Link to="/admin/hotels">Hotels</Link>
              <Link to="/admin/rooms">Rooms</Link>
              <Link to="/admin/reservations">Reservations</Link>
              <Link to="/admin/users">Users</Link>
            </>
          )}
        </div>
        <div className="nav-auth">
          {user ? (
            <div className="nav-user">
              <span>{user.name}</span>
              <button onClick={handleLogout} className="btn btn-outline">Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
