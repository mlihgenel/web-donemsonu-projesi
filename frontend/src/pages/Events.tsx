import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { Event } from '../types';
import EventCard from '../components/EventCard';
import './Events.css';

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await eventService.getAll();
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
        <h1>Tüm Etkinlikler</h1>
        <p>Yaklaşan etkinliklere göz atın ve katılın</p>
      </div>

      {events.length === 0 ? (
        <div className="no-events">
          <p>Henüz etkinlik bulunmuyor.</p>
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

export default Events;

