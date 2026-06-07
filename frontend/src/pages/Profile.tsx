import {Link} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

const Profile = () => {
    const {user, isAdmin} = useAuth();

    if (!user) return null;

    const initial = user.name.charAt(0).toUpperCase();

    return (
        <div className="profile-page">
            <section className="profile-hero">
                <div className="profile-hero-shapes" aria-hidden="true">
                    <span className="profile-hero-shape profile-hero-shape-1"/>
                    <span className="profile-hero-shape profile-hero-shape-2"/>
                </div>

                <div className="profile-hero-content">
                    <div className="profile-avatar-wrap">
                        <div className="profile-avatar">{initial}</div>
                        <span className="profile-avatar-status" title="Active account"/>
                    </div>
                    <h1>{user.name}</h1>
                    <p className="profile-hero-email">{user.email}</p>
                    <span className={`profile-role-badge ${isAdmin ? 'profile-role-admin' : 'profile-role-user'}`}>
            {isAdmin ? 'Administrator' : 'Member'}
          </span>
                </div>
            </section>

            <div className="profile-container">
                <div className="profile-section-header mb-4">
                </div>

                <div className="profile-details-grid">
                    <article className="profile-detail-card">
                        <div className="profile-detail-icon profile-detail-icon-blue">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                 strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                        </div>
                        <div>
                            <span className="profile-detail-label">Full Name</span>
                            <strong className="profile-detail-value">{user.name}</strong>
                        </div>
                    </article>

                    <article className="profile-detail-card">
                        <div className="profile-detail-icon profile-detail-icon-violet">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                 strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                <polyline points="22,6 12,13 2,6"/>
                            </svg>
                        </div>
                        <div>
                            <span className="profile-detail-label">Email Address</span>
                            <strong className="profile-detail-value">{user.email}</strong>
                        </div>
                    </article>

                    <article className="profile-detail-card">
                        <div className="profile-detail-icon profile-detail-icon-emerald">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                 strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            </svg>
                        </div>
                        <div>
                            <span className="profile-detail-label">Account Role</span>
                            <strong className="profile-detail-value capitalize">{user.role}</strong>
                        </div>
                    </article>
                </div>

                <div className="profile-links">
                    {isAdmin ? (
                        <Link to="/admin/dashboard" className="profile-link-card">
                            <div className="profile-link-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="7" height="7"/>
                                    <rect x="14" y="3" width="7" height="7"/>
                                    <rect x="14" y="14" width="7" height="7"/>
                                    <rect x="3" y="14" width="7" height="7"/>
                                </svg>
                            </div>
                            <div>
                                <strong>Admin Dashboard</strong>
                                <span>Manage hotels, rooms &amp; reservations</span>
                            </div>
                            <svg className="profile-link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </Link>
                    ) : (
                        <>
                            <Link to="/my-reservations" className="profile-link-card">
                                <div className="profile-link-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                        <line x1="16" y1="2" x2="16" y2="6"/>
                                        <line x1="8" y1="2" x2="8" y2="6"/>
                                        <line x1="3" y1="10" x2="21" y2="10"/>
                                    </svg>
                                </div>
                                <div>
                                    <strong>My Reservations</strong>
                                    <span>View and track your bookings</span>
                                </div>
                                <svg className="profile-link-arrow" viewBox="0 0 24 24" fill="none"
                                     stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                            </Link>
                            <Link to="/#hotels" className="profile-link-card">
                                <div className="profile-link-icon profile-link-icon-violet">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"/>
                                    </svg>
                                </div>
                                <div>
                                    <strong>Explore Hotels</strong>
                                    <span>Find your next stay</span>
                                </div>
                                <svg className="profile-link-arrow" viewBox="0 0 24 24" fill="none"
                                     stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
