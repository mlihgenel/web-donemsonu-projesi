import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { Event } from '../types';
import { useAuth } from '../contexts/AuthContext';
import './EventDetail.css';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadEvent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadEvent = async () => {
    try {
      const data = await eventService.getById(id!);
      setEvent(data);
    } catch (err: any) {
      setError('Etkinlik bulunamadı');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setActionLoading(true);
    try {
      await eventService.join(id!);
      await loadEvent();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Katılım başarısız');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    setActionLoading(true);
    try {
      await eventService.leave(id!);
      await loadEvent();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Ayrılma başarısız');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isParticipant = () => {
    return event?.participants?.some((p) => p.userId === user?.id);
  };

  if (loading) {
    return <div className="event-detail-container"><div className="loading">Yükleniyor...</div></div>;
  }

  if (error || !event) {
    return <div className="event-detail-container"><div className="error">{error}</div></div>;
  }

  return (
    <div className="event-detail-container">
      <div className="event-detail-card">
        <div className="event-detail-header">
          <span className="event-detail-category">{event.category?.name}</span>
          <span className="event-detail-participants">
            {event.participants?.length || 0} Katılımcı
          </span>
        </div>

        <h1 className="event-detail-title">{event.title}</h1>

        <div className="event-detail-info">
          <div className="info-item">
            <span className="info-icon">●</span>
            <div>
              <strong>Tarih ve Saat</strong>
              <p>{formatDate(event.date)}</p>
            </div>
          </div>

          <div className="info-item">
            <span className="info-icon">●</span>
            <div>
              <strong>Lokasyon</strong>
              <p>{event.location}</p>
            </div>
          </div>

          <div className="info-item">
            <span className="info-icon">●</span>
            <div>
              <strong>Oluşturan</strong>
              <p>{event.createdByUser?.name}</p>
            </div>
          </div>
        </div>

        <div className="event-detail-description">
          <h3>Açıklama</h3>
          <p>{event.description}</p>
        </div>

        {isAuthenticated && !isAdmin && (
          <div className="event-detail-actions">
            {isParticipant() ? (
              <button
                onClick={handleLeave}
                className="event-button event-button-leave"
                disabled={actionLoading}
              >
                {actionLoading ? 'İşleniyor...' : 'Etkinlikten Ayrıl'}
              </button>
            ) : (
              <button
                onClick={handleJoin}
                className="event-button event-button-join"
                disabled={actionLoading}
              >
                {actionLoading ? 'İşleniyor...' : 'Etkinliğe Katıl'}
              </button>
            )}
          </div>
        )}

        {isAuthenticated && isAdmin && (
          <div className="event-detail-auth-notice" style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}>
            <p style={{ color: '#1e40af' }}>Admin olarak etkinliklere katılamazsınız. Sadece kullanıcılar katılabilir.</p>
          </div>
        )}

        {!isAuthenticated && (
          <div className="event-detail-auth-notice">
            <p>Etkinliğe katılmak için <a href="/login">giriş yapın</a></p>
          </div>
        )}

        {event.participants && event.participants.length > 0 && (
          <div className="event-participants-list">
            <h3>Katılımcılar</h3>
            <div className="participants-grid">
              {event.participants.map((participant) => (
                <div key={participant.userId} className="participant-item">
                  <span className="participant-avatar">•</span>
                  <span className="participant-name">{participant.user?.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetail;

