import { useNavigate } from 'react-router-dom';

function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export default function ProfileMenu({ user }) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('leaftech_token');
    localStorage.removeItem('leaftech_user');
    navigate('/login');
  }

  return (
    <div className="profile-menu">
      <button type="button" className="profile-avatar" aria-label="Account">
        {initials(user.name)}
      </button>
      <div className="profile-card">
        <p className="profile-name">{user.name}</p>
        <p className="profile-detail">{user.email}</p>
        <p className="profile-detail">+977 {user.phone}</p>
        <button type="button" className="profile-logout" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  );
}
