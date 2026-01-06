import React from 'react';
import { Event } from '../types';
import './EventCard.css';

interface EventCardProps {
  event: Event;
  onClick?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const participantCount = event.participants?.length || 0;

  return (
    <div className="event-card" onClick={onClick}>
      <div className="event-card-header">
        <span className="event-category">{event.category?.name}</span>
        <span className="event-participants">{participantCount} katılımcı</span>
      </div>

      <h3 className="event-title">{event.title}</h3>
      
      <p className="event-description">
        {event.description.length > 100
          ? `${event.description.substring(0, 100)}...`
          : event.description}
      </p>

      <div className="event-footer">
        <div className="event-info">
          <span className="event-date">
            {formatDate(event.date)}
          </span>
          <span className="event-location">
            {event.location}
          </span>
        </div>
        
        {event.createdByUser && (
          <span className="event-author">
            Oluşturan: {event.createdByUser.name}
          </span>
        )}
      </div>
    </div>
  );
};

export default EventCard;

