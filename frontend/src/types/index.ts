export type UserRole = 'admin' | 'barber' | 'client';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  category: string;
}

export interface Booking {
  id: string;
  clientId: string;
  serviceId: string;
  barberId: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  service?: Service;
  client?: User;
}

export interface QueueEntry {
  id: string;
  clientId?: string;
  clientName: string;
  serviceId: string;
  status: 'waiting' | 'in-progress' | 'completed' | 'cancelled';
  estimatedStartTime: string;
  joinedAt: string;
  service?: Service;
}