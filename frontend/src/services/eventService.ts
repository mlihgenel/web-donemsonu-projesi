import api from './api';
import { Event, CreateEventDto, UpdateEventDto } from '../types';

export const eventService = {
  async getAll(): Promise<Event[]> {
    const response = await api.get<Event[]>('/events');
    return response.data;
  },

  async getById(id: string): Promise<Event> {
    const response = await api.get<Event>(`/events/${id}`);
    return response.data;
  },

  async create(data: CreateEventDto): Promise<Event> {
    const response = await api.post<Event>('/events', data);
    return response.data;
  },

  async update(id: string, data: UpdateEventDto): Promise<Event> {
    const response = await api.patch<Event>(`/events/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/events/${id}`);
  },

  async join(id: string): Promise<{ message: string }> {
    const response = await api.post(`/events/${id}/join`);
    return response.data;
  },

  async leave(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/events/${id}/leave`);
    return response.data;
  },

  async getMyEvents(): Promise<Event[]> {
    const response = await api.get<Event[]>('/events/my-events');
    return response.data;
  },

  async getJoinedEvents(): Promise<Event[]> {
    const response = await api.get<Event[]>('/events/joined');
    return response.data;
  },
};

