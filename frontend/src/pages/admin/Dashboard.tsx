import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { DashboardStats, Booking } from '../../types';
import { dashboardAPI } from '../../services/api';

const StatIcon = ({ type }: { type: 'hotels' | 'rooms' | 'users' | 'reservations' }) => {
  const icons = {
    hotels: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
      </svg>
    ),
    rooms: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4v16h20V4H2z" />
        <path d="M2 10h20M10 4v16" />
      </svg>
    ),
    users: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    reservations: (
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

  const bookingInsights = useMemo(() => {
    if (!stats) return { revenue: 0, approved: 0, pending: 0 };

    return stats.recentBookings.reduce(
      (acc, booking) => {
        acc.revenue += Number(booking.total_price) || 0;
        if (booking.status === 'Approved') acc.approved += 1;
        if (booking.status === 'Pending') acc.pending += 1;
        return acc;
      },
      { revenue: 0, approved: 0, pending: 0 }
    );
  }, [stats]);

  const statusClass = (status: string) => {
    const map: Record<string, string> = {
      Pending: 'status-pending',
      Approved: 'status-approved',
      Rejected: 'status-rejected',
      Completed: 'status-completed',
    };
    return map[status] || '';
  };

  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard-loading">
          <span className="admin-dashboard-spinner" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) return <div className="alert alert-error">{error}</div>;
  if (!stats) return null;

  const statItems: Array<{
    key: 'hotels' | 'rooms' | 'users' | 'reservations';
    label: string;
    value: number;
    tone: 'blue' | 'violet' | 'emerald' | 'amber';
  }> = [
    { key: 'hotels', label: 'Hotels', value: stats.hotels, tone: 'blue' },
    { key: 'rooms', label: 'Rooms', value: stats.rooms, tone: 'violet' },
    { key: 'users', label: 'Users', value: stats.users, tone: 'emerald' },
    { key: 'reservations', label: 'Reservations', value: stats.reservations, tone: 'amber' },
  ];

  return (
    <div className="admin-dashboard">
      <section className="admin-dashboard-hero">
        <div className="admin-dashboard-hero-text">
          <span className="admin-dashboard-badge">Admin Panel</span>
          <h1>Dashboard</h1>
          <p>Monitor hotels, rooms, users, and reservations in one place.</p>
        </div>
        <div className="admin-dashboard-hero-meta">
          <span className="admin-dashboard-date">{today}</span>
          <Link to="/admin/reservations" className="btn btn-primary admin-dashboard-cta">
            Manage Reservations
          </Link>
        </div>
      </section>

      <section className="admin-stats-grid">
        {statItems.map((item) => (
          <article key={item.key} className={`admin-stat-card admin-stat-${item.tone}`}>
            <div className={`admin-stat-icon admin-stat-icon-${item.tone}`}>
              <StatIcon type={item.key} />
            </div>
            <div className="admin-stat-content">
              <span className="admin-stat-label">{item.label}</span>
              <strong className="admin-stat-value">{item.value}</strong>
            </div>
          </article>
        ))}
      </section>

      <section className="admin-insights-row">
        <article className="admin-insight-card">
          <span className="admin-insight-label">Recent Revenue</span>
          <strong className="admin-insight-value">${bookingInsights.revenue.toFixed(2)}</strong>
          <span className="admin-insight-hint">From latest bookings</span>
        </article>
        <article className="admin-insight-card">
          <span className="admin-insight-label">Approved</span>
          <strong className="admin-insight-value">{bookingInsights.approved}</strong>
          <span className="admin-insight-hint">Recent bookings</span>
        </article>
        <article className="admin-insight-card">
          <span className="admin-insight-label">Pending</span>
          <strong className="admin-insight-value">{bookingInsights.pending}</strong>
          <span className="admin-insight-hint">Awaiting review</span>
        </article>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h2>Recent Bookings</h2>
            <p>Latest reservation activity across all hotels</p>
          </div>
          <Link to="/admin/reservations" className="btn btn-outline btn-sm">
            View all
          </Link>
        </div>

        {stats.recentBookings.length === 0 ? (
          <div className="admin-panel-empty">
            <p>No recent bookings yet.</p>
          </div>
        ) : (
          <div className="table-container admin-dashboard-table">
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
                    <td>
                      <span className="admin-table-user">{b.user_name}</span>
                    </td>
                    <td>{b.hotel_name}</td>
                    <td>
                      <span className="admin-table-room">{b.room_number}</span>
                    </td>
                    <td>{b.check_in_date?.slice(0, 10)}</td>
                    <td className="table-cell-price">${Number(b.total_price).toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${statusClass(b.status)}`}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
