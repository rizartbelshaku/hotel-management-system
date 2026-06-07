import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Hotel, Room } from '../types';
import { hotelAPI, roomAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface HotelWithRooms extends Hotel {
  rooms: Room[];
  minPrice: number | null;
}

const Home = () => {
  const { user } = useAuth();
  const [hotels, setHotels] = useState<HotelWithRooms[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hotelAPI.getAll()
      .then(async (data: Hotel[]) => {
        const withRooms = await Promise.all(
          data.map(async (hotel) => {
            try {
              const rooms: Room[] = await roomAPI.getByHotel(hotel.id, true);
              const prices = rooms.map((r) => Number(r.price));
              return {
                ...hotel,
                rooms,
                minPrice: prices.length ? Math.min(...prices) : null,
              };
            } catch {
              return { ...hotel, rooms: [], minPrice: null };
            }
          })
        );
        setHotels(withRooms);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);


  return (
    <div className="home">
      <section className="landing-hero">
        <div
          className="landing-hero-bg"
          style={{
            backgroundImage: hotels[0]?.image
              ? `url(${hotels[0].image})`
              : 'url(https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=80)',
          }}
        />
        <div className="landing-hero-overlay" />
        <div className="landing-hero-content">
          <span className="landing-badge">✦ Your next stay awaits</span>
          <h1>Discover Luxury Hotels & Book Your Perfect Room</h1>
          <p>
            Browse handpicked hotels across Albania and reserve your dream stay
            in just a few clicks.
          </p>
          <div className="landing-hero-actions">
            <a href="#hotels" className="btn btn-hero-primary">Explore Hotels</a>
            {!user && (
              <Link to="/register" className="btn btn-hero-secondary">Get Started</Link>
            )}
          </div>
          <div className="landing-stats">
            <div className="landing-stat">
              <strong>{hotels.length}</strong>
              <span>Hotels</span>
            </div>
            <div className="landing-stat">
              <strong>{new Set(hotels.map((h) => h.city)).size}</strong>
              <span>Cities</span>
            </div>
            <div className="landing-stat">
              <strong>24/7</strong>
              <span>Online Booking</span>
            </div>
          </div>
        </div>
      </section>

      <section id="hotels" className="landing-section">
        <div className="landing-container">
          <div className="landing-section-header">
            <span className="landing-label">Our Hotels</span>
            <h2>Find Your Ideal Destination</h2>
            <p>Browse our hotels and book the perfect stay for you.</p>
          </div>

          {loading ? (
            <div className="landing-loading">Loading hotels...</div>
          ) : hotels.length === 0 ? (
            <p className="empty-state">No hotels available at the moment.</p>
          ) : (
            <div className="landing-hotels-grid">
              {hotels.map((hotel) => (
                <article key={hotel.id} className="landing-hotel-card">
                  <div className="landing-hotel-image">
                    {hotel.image ? (
                      <img src={hotel.image} alt={hotel.name} loading="lazy" />
                    ) : (
                      <div className="landing-hotel-placeholder">{hotel.name}</div>
                    )}
                    {hotel.minPrice !== null && (
                      <span className="landing-price-tag">From ${hotel.minPrice}/night</span>
                    )}
                  </div>
                  <div className="landing-hotel-body">
                    <div className="landing-hotel-meta">
                      <h3>{hotel.name}</h3>
                      <div className="landing-hotel-sub">
                        <span className="landing-city">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" />
                            <circle cx="12" cy="10" r="2.5" />
                          </svg>
                          {hotel.city}
                        </span>
                      </div>
                    </div>
                    <p>
                      {hotel.description?.slice(0, 100)}
                      {(hotel.description?.length ?? 0) > 100 ? '...' : ''}
                    </p>
                    <div className="landing-hotel-footer">
                      <span className="landing-room-count">
                        {hotel.rooms.length} room{hotel.rooms.length !== 1 ? 's' : ''} available
                      </span>
                      <Link to={`/hotels/${hotel.id}`} className="btn btn-landing">
                        View & Book
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="landing-section landing-gallery">
        <div className="landing-container">
          <div className="landing-section-header">
            <span className="landing-label">Experience</span>
            <h2>Luxury at Every Corner</h2>
          </div>
          <div className="landing-gallery-grid">
            <div className="landing-gallery-item landing-gallery-tall">
              <img src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80" alt="Luxury pool" loading="lazy" />
              <span>Infinity Pools</span>
            </div>
            <div className="landing-gallery-item">
              <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80" alt="Fine dining" loading="lazy" />
              <span>Fine Dining</span>
            </div>
            <div className="landing-gallery-item">
              <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80" alt="Spa wellness" loading="lazy" />
              <span>Spa & Wellness</span>
            </div>
            <div className="landing-gallery-item landing-gallery-wide">
              <img src="https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=900&q=80" alt="Scenic view" loading="lazy" />
              <span>Scenic Views</span>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-container">
          <div className="landing-section-header">
            <span className="landing-label">How It Works</span>
            <h2>Book in 3 Simple Steps</h2>
          </div>
          <div className="landing-steps">
            <div className="landing-step">
              <div className="landing-step-num">1</div>
              <h3>Browse Hotels</h3>
              <p>Explore hotels and compare locations, amenities, and prices.</p>
            </div>
            <div className="landing-step">
              <div className="landing-step-num">2</div>
              <h3>Choose a Room</h3>
              <p>Select from available rooms that fit your dates and budget.</p>
            </div>
            <div className="landing-step">
              <div className="landing-step-num">3</div>
              <h3>Confirm Booking</h3>
              <p>Complete your reservation and track status from your account.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section landing-features-section">
        <div className="landing-container">
          <div className="landing-features">
            <div className="landing-feature">
              <div className="landing-feature-icon">🏨</div>
              <h3>Premium Hotels</h3>
              <p>Carefully selected properties across Albania's top cities.</p>
            </div>
            <div className="landing-feature">
              <div className="landing-feature-icon">⚡</div>
              <h3>Instant Booking</h3>
              <p>Reserve your room online quickly with real-time availability.</p>
            </div>
            <div className="landing-feature">
              <div className="landing-feature-icon">📋</div>
              <h3>Manage Reservations</h3>
              <p>View, track, and cancel bookings easily from your profile.</p>
            </div>
          </div>
        </div>
      </section>

      {!user && (
        <section className="landing-cta">
          <div
            className="landing-cta-bg"
            style={{
              backgroundImage: hotels[0]?.image
                ? `url(${hotels[0].image})`
                : 'url(https://images.unsplash.com/photo-1520250497591-112f2f40a3b4?w=1920&q=80)',
            }}
          />
          <div className="landing-cta-overlay" />
          <div className="landing-container landing-cta-content">
            <h2>Ready for Your Next Getaway?</h2>
            <p>Create a free account and start booking your dream hotel today.</p>
            <div className="landing-cta-buttons">
              <Link to="/register" className="btn btn-hero-primary">Get Started Free</Link>
              <Link to="/login" className="btn btn-hero-secondary">Sign In</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
