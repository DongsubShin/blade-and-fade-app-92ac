import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../services/api/booking.service';

export const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: bookingService.getAll,
  });
};

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: bookingService.getServices,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookingService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};