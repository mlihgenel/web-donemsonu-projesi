import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="home-container">
      <div className="home-hero">
        <h1 className="home-title">Etkinlik Yönetim Sistemi</h1>
        <p className="home-subtitle">
          Etkinlikleri keşfedin, katılın ve unutulmaz deneyimler yaşayın
        </p>
        
        <div className="home-buttons">
          {isAuthenticated ? (
            <button onClick={() => navigate('/events')} className="home-button">
              Etkinliklere Göz At
            </button>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="home-button">
                Giriş Yap
              </button>
              <button onClick={() => navigate('/register')} className="home-button-outline">
                Kayıt Ol
              </button>
            </>
          )}
        </div>
      </div>

      <div className="home-features">
        <div className="feature-card" onClick={() => navigate('/events')}>
          <div className="feature-icon">⚡</div>
          <h3>Etkinlikleri Keşfedin</h3>
          <p>Çeşitli kategorilerde düzenlenen etkinlikleri keşfedin ve ilgi alanınıza uygun olanları bulun</p>
        </div>

        <div className="feature-card" onClick={() => navigate(isAuthenticated ? '/my-events' : '/login')}>
          <div className="feature-icon">✓</div>
          <h3>Kolayca Katılın</h3>
          <p>Tek tıkla etkinliklere katılın ve katılımcı listenizi yönetin</p>
        </div>

        {(!isAuthenticated || isAdmin) && (
          <div className="feature-card" onClick={() => navigate(isAuthenticated ? '/admin' : '/login')}>
            <div className="feature-icon">+</div>
            <h3>Etkinlik Oluşturun</h3>
            <p>Admin yetkisiyle kendi etkinliklerinizi oluşturun ve yönetin</p>
          </div>
        )}
      </div>

      <div className="home-stats">
        <div className="stat-item">
          <div className="stat-number">∞</div>
          <p>Kolay Kullanım</p>
        </div>
        <div className="stat-item">
          <div className="stat-number">✓</div>
          <p>Güvenli Sistem</p>
        </div>
        <div className="stat-item">
          <div className="stat-number">⚡</div>
          <p>Hızlı İşlemler</p>
        </div>
      </div>
    </div>
  );
};

export default Home;

