import api from './api';
import { User } from '../types';

interface UserWithStats extends User {
  roleId: string;
  createdEvents?: number;
  joinedEvents?: number;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  birthDate?: string;
  bio?: string;
  profilePhoto?: string;
  school?: string;
  department?: string;
  studentNumber?: string;
  grade?: string;
}

export const userService = {
  getAll: async (): Promise<UserWithStats[]> => {
    const response = await api.get<UserWithStats[]>('/users');
    return response.data;
  },

  getById: async (id: string): Promise<UserWithStats> => {
    const response = await api.get<UserWithStats>(`/users/${id}`);
    return response.data;
  },


  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

