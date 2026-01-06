import api from './api';
import { AuthResponse, LoginDto, RegisterDto } from '../types';

export const authService = {
  async register(data: RegisterDto): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      return response.data;
    } catch (error: any) {
      console.error('Register error:', error);
      if (error.response) {
        // Backend'den gelen hata
        throw new Error(error.response.data?.message || error.response.data || 'Kayıt başarısız');
      } else if (error.request) {
        // İstek gönderildi ama yanıt alınamadı
        throw new Error('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.');
      } else {
        // İstek hazırlanırken hata oluştu
        throw new Error('Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }
  },

  async login(data: LoginDto): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', data);
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response) {
        // Backend'den gelen hata
        throw new Error(error.response.data?.message || error.response.data || 'Giriş başarısız');
      } else if (error.request) {
        // İstek gönderildi ama yanıt alınamadı
        throw new Error('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.');
      } else {
        // İstek hazırlanırken hata oluştu
        throw new Error('Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  getStoredUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getStoredToken() {
    return localStorage.getItem('access_token');
  },

  storeAuth(token: string, user: any) {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
};

