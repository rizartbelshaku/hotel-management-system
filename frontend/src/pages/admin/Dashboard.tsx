import { useEffect, useState } from 'react';
import type { DashboardStats, Booking } from '../../types';
import { dashboardAPI } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardAPI.getStats()
      .then(setStats)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!stats) return null;

  const statusClass = (status: string) => {
    const map: Record<string, string> = {
      Pending: 'status-pending',
      Approved: 'status-approved',
      Rejected: 'status-rejected',
      Completed: 'status-completed',
    };
    return map[status] || '';
  };

  return (
    <div className="page">
      <h1>Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Hotels</h3>
          <p className="stat-number">{stats.hotels}</p>
        </div>
        <div className="stat-card">
          <h3>Rooms</h3>
          <p className="stat-number">{stats.rooms}</p>
        </div>
        <div className="stat-card">
          <h3>Users</h3>
          <p className="stat-number">{stats.users}</p>
        </div>
        <div className="stat-card">
          <h3>Reservations</h3>
          <p className="stat-number">{stats.reservations}</p>
        </div>
      </div>

      <h2>Recent Bookings</h2>
      {stats.recentBookings.length === 0 ? (
        <p className="empty-state">No recent bookings.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Hotel</th>
                <th>Room</th>
                <th>Check-in</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentBookings.map((b: Booking) => (
                <tr key={b.id}>
                  <td>{b.user_name}</td>
                  <td>{b.hotel_name}</td>
                  <td>{b.room_number}</td>
                  <td>{b.check_in_date?.slice(0, 10)}</td>
                  <td className="table-cell-price">${b.total_price}</td>
                  <td><span className={`status-badge ${statusClass(b.status)}`}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
