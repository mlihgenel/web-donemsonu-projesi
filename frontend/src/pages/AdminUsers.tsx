import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { User } from '../types';
import { useAuth } from '../contexts/AuthContext';
import './AdminUsers.css';

interface UserWithDetails extends Omit<User, 'role'> {
  role: string | { name?: string };
  roleId: string;
  createdEvents?: number;
  joinedEvents?: number;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (err: any) {
      setError('Kullanıcılar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeClass = (role: string | { name?: string }) => {
    const roleName = typeof role === 'string' ? role : role?.name || 'USER';
    return roleName === 'ADMIN' ? 'role-badge-admin' : 'role-badge-user';
  };

  const getRoleName = (role: string | { name?: string }): string => {
    return typeof role === 'string' ? role : role?.name || 'USER';
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (!window.confirm(`${userName} kullanıcısını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) {
      return;
    }

    setDeletingId(userId);
    try {
      await userService.delete(userId);
      // Kullanıcıyı listeden kaldır
      setUsers(users.filter(u => u.id !== userId));
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Kullanıcı silinirken hata oluştu';
      alert(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  const canDelete = (user: UserWithDetails): boolean => {
    // Kendi hesabını veya admin kullanıcıları silemez
    if (user.id === currentUser?.id) return false;
    if (getRoleName(user.role) === 'ADMIN') return false;
    return true;
  };

  if (loading) {
    return (
      <div className="admin-users-container">
        <div className="loading">Yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-users-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="admin-users-container">
      <div className="admin-users-header">
        <h1>Üye Yönetimi</h1>
        <p>Sistemdeki tüm kullanıcıları görüntüleyin</p>
      </div>

      <div className="users-stats">
        <div className="stat-card">
          <div className="stat-value">{users.length}</div>
          <div className="stat-label">Toplam Üye</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{users.filter(u => getRoleName(u.role) === 'ADMIN').length}</div>
          <div className="stat-label">Admin</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{users.filter(u => getRoleName(u.role) === 'USER').length}</div>
          <div className="stat-label">Kullanıcı</div>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>İsim</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="user-name">{user.name}</td>
                <td className="user-email">{user.email}</td>
                <td>
                  <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                    {getRoleName(user.role)}
                  </span>
                </td>
                <td className="user-status">
                  <span className="status-active">Aktif</span>
                </td>
                <td className="user-actions">
                  {canDelete(user) ? (
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(user.id, user.name)}
                      disabled={deletingId === user.id}
                      title="Kullanıcıyı Sil"
                    >
                      {deletingId === user.id ? 'Siliniyor...' : 'Sil'}
                    </button>
                  ) : (
                    <span className="delete-disabled" title={user.id === currentUser?.id ? 'Kendi hesabınızı silemezsiniz' : 'Admin kullanıcıları silinemez'}>
                      -
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;

