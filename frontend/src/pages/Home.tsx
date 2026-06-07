import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <h1>Find Your Perfect Stay</h1>
        <p>Discover the best hotels and book your room with ease.</p>
        <Link to="/hotels" className="btn btn-primary btn-lg">Browse Hotels</Link>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>Best Hotels</h3>
          <p>Explore a wide selection of hotels in cities across Albania.</p>
        </div>
        <div className="feature-card">
          <h3>Easy Booking</h3>
          <p>Book your room in just a few clicks with instant confirmation.</p>
        </div>
        <div className="feature-card">
          <h3>Manage Reservations</h3>
          <p>View and manage all your bookings from your profile.</p>
        </div>
      </section>

      {!user && (
        <section className="cta">
          <h2>Get Started Today</h2>
          <p>Create an account to start booking your favorite hotels.</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary">Register</Link>
            <Link to="/login" className="btn btn-outline">Login</Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
