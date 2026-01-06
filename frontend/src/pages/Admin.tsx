import React, { useState, useEffect } from 'react';
import { eventService } from '../services/eventService';
import { categoryService } from '../services/categoryService';
import { Event, Category, CreateEventDto } from '../types';
import './Admin.css';

const Admin: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const [formData, setFormData] = useState<CreateEventDto>({
    title: '',
    description: '',
    date: '',
    location: '',
    categoryId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [eventsData, categoriesData] = await Promise.all([
        eventService.getMyEvents(),
        categoryService.getAll(),
      ]);
      setEvents(eventsData);
      setCategories(categoriesData);
    } catch (err) {
      alert('Veri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingEvent) {
        await eventService.update(editingEvent.id, formData);
      } else {
        await eventService.create(formData);
      }
      
      setShowForm(false);
      setEditingEvent(null);
      resetForm();
      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'İşlem başarısız');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await eventService.delete(id);
      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Silme başarısız');
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.split('.')[0], // ISO format için
      location: event.location,
      categoryId: event.categoryId,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      categoryId: '',
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEvent(null);
    resetForm();
  };

  if (loading) {
    return <div className="admin-container"><div className="loading">Yükleniyor...</div></div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <button onClick={() => setShowForm(!showForm)} className="admin-button">
          {showForm ? 'İptal' : '+ Yeni Etkinlik'}
        </button>
      </div>

      {showForm && (
        <div className="admin-form-card">
          <h2>{editingEvent ? 'Etkinliği Düzenle' : 'Yeni Etkinlik Oluştur'}</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label>Başlık</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Açıklama</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tarih ve Saat</label>
                <input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Lokasyon</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Kategori</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                required
              >
                <option value="">Kategori seçin</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button type="button" onClick={handleCancel} className="admin-button-secondary">
                İptal
              </button>
              <button type="submit" className="admin-button">
                {editingEvent ? 'Güncelle' : 'Oluştur'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-events">
        <h2>Oluşturduğum Etkinlikler ({events.length})</h2>
        
        {events.length === 0 ? (
          <p className="no-events">Henüz etkinlik oluşturmadınız.</p>
        ) : (
          <div className="admin-events-list">
            {events.map((event) => (
              <div key={event.id} className="admin-event-card">
                <div className="admin-event-info">
                  <h3>{event.title}</h3>
                  <p className="admin-event-meta">
                    {event.category?.name} • {event.location} • 
                    {new Date(event.date).toLocaleDateString('tr-TR')}
                  </p>
                  <p className="admin-event-participants">
                    {event.participants?.length || 0} katılımcı
                  </p>
                </div>
                <div className="admin-event-actions">
                  <button onClick={() => handleEdit(event)} className="admin-edit-button">
                    Düzenle
                  </button>
                  <button onClick={() => handleDelete(event.id)} className="admin-delete-button">
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

