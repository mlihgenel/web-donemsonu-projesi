import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { Event } from '../types';
import EventCard from '../components/EventCard';
import './Events.css';

const MyEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await eventService.getJoinedEvents();
      setEvents(data);
    } catch (err: any) {
      setError('Etkinlikler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="events-container">
        <div className="loading">Yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="events-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="events-container">
      <div className="events-header">
        <h1>Katıldığım Etkinlikler</h1>
        <p>Kayıt olduğunuz tüm etkinlikler burada</p>
      </div>

      {events.length === 0 ? (
        <div className="no-events">
          <p>Henüz hiçbir etkinliğe katılmadınız.</p>
          <button
            onClick={() => navigate('/events')}
            style={{
              marginTop: '1rem',
              padding: '0.8rem 2rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Etkinliklere Göz At
          </button>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => navigate(`/events/${event.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEvents;

