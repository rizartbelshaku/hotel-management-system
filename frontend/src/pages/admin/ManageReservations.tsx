import { useEffect, useState } from 'react';
import type { Booking } from '../../types';
import { bookingAPI } from '../../services/api';

const ManageReservations = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchBookings = () => {
    bookingAPI.getAll()
      .then(setBookings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await bookingAPI.updateStatus(id, status);
      setMessage(`Status updated to ${status}`);
      fetchBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
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

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page">
      <h1>Manage Reservations</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      {bookings.length === 0 ? (
        <p className="empty-state">No reservations found.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Hotel</th>
                <th>Room</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.user_name}<br /><small>{b.user_email}</small></td>
                  <td>{b.hotel_name}</td>
                  <td>{b.room_number}</td>
                  <td>{b.check_in_date?.slice(0, 10)}</td>
                  <td>{b.check_out_date?.slice(0, 10)}</td>
                  <td className="table-cell-price">${b.total_price}</td>
                  <td><span className={`status-badge ${statusClass(b.status)}`}>{b.status}</span></td>
                  <td className="actions">
                    <select
                      value={b.status}
                      onChange={(e) => handleStatusChange(b.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Completed">Completed</option>
                    </select>
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

export default ManageReservations;
