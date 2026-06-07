import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Hotel, Room } from '../types';
import { hotelAPI, roomAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const HotelDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    Promise.all([
      hotelAPI.getById(Number(id)),
      roomAPI.getByHotel(Number(id), true),
    ])
      .then(([hotelData, roomsData]) => {
        setHotel(hotelData);
        setRooms(roomsData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = (roomId: number) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/hotels/${id}/book/${roomId}`);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!hotel) return <div className="alert alert-error">Hotel not found</div>;

  return (
    <div className="page">
      <Link to="/hotels" className="back-link">&larr; Back to Hotels</Link>

      <div className="hotel-detail">
        {hotel.image && (
          <img src={hotel.image} alt={hotel.name} className="hotel-detail-image" />
        )}
        <div className="hotel-detail-info">
          <h1>{hotel.name}</h1>
          <p className="hotel-city">{hotel.city} - {hotel.address}</p>
          <p>{hotel.description}</p>
        </div>
      </div>

      <h2>Available Rooms</h2>
      {rooms.length === 0 ? (
        <p className="empty-state">No available rooms at this hotel.</p>
      ) : (
        <div className="rooms-grid">
          {rooms.map((room) => (
            <div key={room.id} className="room-card">
              <h3>Room {room.room_number}</h3>
              <p>Type: {room.type}</p>
              <p className="room-price">${room.price}/night</p>
              <button onClick={() => handleBook(room.id)} className="btn btn-primary">
                Book Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HotelDetails;
