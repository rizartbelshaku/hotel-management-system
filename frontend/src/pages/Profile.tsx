import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="page">
      <h1>Profile</h1>
      <div className="profile-card">
        <div className="profile-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <div className="profile-field">
            <label>Name</label>
            <p>{user.name}</p>
          </div>
          <div className="profile-field">
            <label>Email</label>
            <p>{user.email}</p>
          </div>
          <div className="profile-field">
            <label>Role</label>
            <p className="capitalize">{user.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
