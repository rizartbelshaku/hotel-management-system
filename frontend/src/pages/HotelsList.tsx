import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Hotel } from '../types';
import { hotelAPI } from '../services/api';

const HotelsList = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    hotelAPI.getAll()
      .then(setHotels)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading hotels...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="page">
      <h1>Hotels</h1>
      {hotels.length === 0 ? (
        <p className="empty-state">No hotels available at the moment.</p>
      ) : (
        <div className="hotels-grid">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="hotel-card">
              <div className="hotel-image">
                {hotel.image ? (
                  <img src={hotel.image} alt={hotel.name} />
                ) : (
                  <div className="hotel-image-placeholder">No Image</div>
                )}
              </div>
              <div className="hotel-info">
                <h3>{hotel.name}</h3>
                <p className="hotel-city">{hotel.city}</p>
                <p className="hotel-desc">{hotel.description?.slice(0, 100)}...</p>
                <Link to={`/hotels/${hotel.id}`} className="btn btn-primary">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HotelsList;
