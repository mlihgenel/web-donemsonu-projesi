export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  createdBy: string;
  categoryId: string;
  createdByUser?: User;
  category?: Category;
  participants?: EventParticipant[];
}

export interface EventParticipant {
  userId: string;
  eventId: string;
  joinedAt: string;
  user?: User;
}

export interface CreateEventDto {
  title: string;
  description: string;
  date: string;
  location: string;
  categoryId: string;
}

export interface UpdateEventDto {
  title?: string;
  description?: string;
  date?: string;
  location?: string;
  categoryId?: string;
}

