import { useEffect, useState } from 'react';
import type { Booking } from '../types';
import { bookingAPI } from '../services/api';

const MyReservations = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchBookings = () => {
    bookingAPI.getMy()
      .then(setBookings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await bookingAPI.cancel(id);
      setMessage('Booking cancelled successfully');
      fetchBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cancel failed');
    }
  };

  const statusClass = (status: string) => {
    const map: Record<string, string> = {
      Pending: 'status-pending',
      Approved: 'status-approved',
      Rejected: 'status-rejected',
      Completed: 'status-completed',
    };
    return map[status] || '';
  };

  if (loading) return <div className="loading">Loading reservations...</div>;

  return (
    <div className="page">
      <h1>My Reservations</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      {bookings.length === 0 ? (
        <p className="empty-state">You have no reservations yet.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Hotel</th>
                <th>Room</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.hotel_name}</td>
                  <td>{b.room_number} ({b.room_type})</td>
                  <td>{b.check_in_date?.slice(0, 10)}</td>
                  <td>{b.check_out_date?.slice(0, 10)}</td>
                  <td className="table-cell-price">${b.total_price}</td>
                  <td><span className={`status-badge ${statusClass(b.status)}`}>{b.status}</span></td>
                  <td>
                    {b.status === 'Pending' && (
                      <button onClick={() => handleCancel(b.id)} className="btn btn-danger btn-sm">
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyReservations;
