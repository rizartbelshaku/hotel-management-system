import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Hotel, Room } from '../types';
import { hotelAPI, roomAPI, bookingAPI } from '../services/api';

const BookingForm = () => {
  const { hotelId, roomId } = useParams<{ hotelId: string; roomId: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!hotelId || !roomId) return;

    Promise.all([
      hotelAPI.getById(Number(hotelId)),
      roomAPI.getByHotel(Number(hotelId)).then((rooms: Room[]) =>
        rooms.find((r) => r.id === Number(roomId))
      ),
    ])
      .then(([hotelData, roomData]) => {
        setHotel(hotelData);
        setRoom(roomData || null);
      })
      .catch((err) => setError(err.message));
  }, [hotelId, roomId]);

  const calculateTotal = () => {
    if (!room || !checkInDate || !checkOutDate) return 0;
    const nights = Math.ceil(
      (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    return nights > 0 ? nights * Number(room.price) : 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await bookingAPI.create({
        hotelId: Number(hotelId),
        roomId: Number(roomId),
        checkInDate,
        checkOutDate,
      });
      setSuccess('Booking created successfully! Status: Pending');
      setTimeout(() => navigate('/my-reservations'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  if (!hotel || !room) {
    return error ? <div className="alert alert-error">{error}</div> : <div className="loading">Loading...</div>;
  }

  return (
    <div className="page">
      <Link to={`/hotels/${hotelId}`} className="back-link">&larr; Back to Hotel</Link>
      <h1>Book a Room</h1>

      <div className="booking-summary">
        <h3>{hotel.name}</h3>
        <p>Room {room.room_number} - {room.type}</p>
        <p>Price: ${room.price}/night</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label htmlFor="checkIn">Check-in Date</label>
          <input
            id="checkIn"
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="checkOut">Check-out Date</label>
          <input
            id="checkOut"
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            min={checkInDate || new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        {calculateTotal() > 0 && (
          <div className="total-price">
            <strong>Total Price: ${calculateTotal()}</strong>
          </div>
        )}

        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
