import apiClient from './api-client';
import { Booking, Service } from '../../types';

export const bookingService = {
  getAll: async () => {
    const { data } = await apiClient.get<Booking[]>('/bookings');
    return data;
  },
  getServices: async () => {
    const { data } = await apiClient.get<Service[]>('/services');
    return data;
  },
  create: async (payload: Partial<Booking>) => {
    const { data } = await apiClient.post<Booking>('/bookings', payload);
    return data;
  },
};