import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Event Manager
        </Link>

        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <Link to="/events" className="navbar-link">
                Etkinlikler
              </Link>
              {!isAdmin && (
                <Link to="/my-events" className="navbar-link">
                  Katıldıklarım
                </Link>
              )}
              {isAdmin && (
                <>
                  <Link to="/admin" className="navbar-link admin-link">
                    Etkinlik Yönetimi
                  </Link>
                  <Link to="/admin/users" className="navbar-link admin-link">
                    Üye Yönetimi
                  </Link>
                </>
              )}
              <div className="navbar-user">
                <span className="navbar-username">
                  {user?.name} {isAdmin && '(Admin)'}
                </span>
                <button onClick={handleLogout} className="navbar-button">
                  Çıkış
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Giriş
              </Link>
              <Link to="/register" className="navbar-button-link">
                <button className="navbar-button">Kayıt Ol</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

