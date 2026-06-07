import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Hotel, Room } from '../types';
import { hotelAPI, roomAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface HotelWithRooms extends Hotel {
  rooms: Room[];
  minPrice: number | null;
}

const FeatureIcon = ({ type }: { type: 'hotel' | 'bolt' | 'calendar' }) => {
  const icons = {
    hotel: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
      </svg>
    ),
    bolt: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    calendar: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  };

  return icons[type];
};

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

  const totalRooms = useMemo(
    () => hotels.reduce((sum, hotel) => sum + hotel.rooms.length, 0),
    [hotels]
  );

  const heroImage = hotels[0]?.image
    || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=80';

  return (
    <div className="home">
      <section className="landing-hero">
        <div className="landing-hero-bg" style={{ backgroundImage: `url(${heroImage})` }} />
        <div className="landing-hero-overlay" />
        <div className="landing-hero-shapes" aria-hidden="true">
          <span className="landing-hero-shape landing-hero-shape-1" />
          <span className="landing-hero-shape landing-hero-shape-2" />
        </div>

        <div className="landing-hero-content">
          <span className="landing-badge">Your next stay awaits</span>
          <h1>
            Discover Luxury Hotels &amp;
            <span> Book Your Perfect Room</span>
          </h1>
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
              <strong>{totalRooms}</strong>
              <span>Rooms</span>
            </div>
            <div className="landing-stat">
              <strong>24/7</strong>
              <span>Booking</span>
            </div>
          </div>
        </div>

        <a href="#hotels" className="landing-hero-scroll" aria-label="Scroll to hotels">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </a>
      </section>

      <section id="hotels" className="landing-section landing-hotels-section">
        <div className="landing-container">
          <div className="landing-section-header">
            <span className="landing-label">Our Hotels</span>
            <h2>Find Your Ideal Destination</h2>
            <p>Browse our hotels and book the perfect stay for you.</p>
          </div>

          {loading ? (
            <div className="landing-loading">
              <span className="landing-loading-spinner" />
              <p>Loading hotels...</p>
            </div>
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
                    <span className="landing-hotel-city-tag">{hotel.city}</span>
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
                    <p className="landing-hotel-desc">
                      {hotel.description?.slice(0, 100)}
                      {(hotel.description?.length ?? 0) > 100 ? '...' : ''}
                    </p>
                    <div className="landing-hotel-footer">
                      <span className="landing-room-count">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M2 4v16h20V4H2z" />
                          <path d="M2 10h20M10 4v16" />
                        </svg>
                        {hotel.rooms.length} room{hotel.rooms.length !== 1 ? 's' : ''} available
                      </span>
                      <Link to={`/hotels/${hotel.id}`} className="btn btn-landing">
                        View &amp; Book
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
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
            <p>Everything you need for an unforgettable stay.</p>
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
              <span>Spa &amp; Wellness</span>
            </div>
            <div className="landing-gallery-item landing-gallery-wide">
              <img src="https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=900&q=80" alt="Scenic view" loading="lazy" />
              <span>Scenic Views</span>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section landing-steps-section">
        <div className="landing-container">
          <div className="landing-section-header">
            <span className="landing-label">How It Works</span>
            <h2>Book in 3 Simple Steps</h2>
            <p>From browsing to confirmation — fast and effortless.</p>
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
          <div className="landing-section-header">
            <span className="landing-label">Why HotelBook</span>
            <h2>Everything You Need</h2>
          </div>
          <div className="landing-features">
            <div className="landing-feature">
              <div className="landing-feature-icon">
                <FeatureIcon type="hotel" />
              </div>
              <h3>Premium Hotels</h3>
              <p>Carefully selected properties across Albania&apos;s top cities.</p>
            </div>
            <div className="landing-feature">
              <div className="landing-feature-icon landing-feature-icon-violet">
                <FeatureIcon type="bolt" />
              </div>
              <h3>Instant Booking</h3>
              <p>Reserve your room online quickly with real-time availability.</p>
            </div>
            <div className="landing-feature">
              <div className="landing-feature-icon landing-feature-icon-emerald">
                <FeatureIcon type="calendar" />
              </div>
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
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="landing-cta-overlay" />
          <div className="landing-container landing-cta-content">
            <span className="landing-cta-badge">Start today</span>
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
