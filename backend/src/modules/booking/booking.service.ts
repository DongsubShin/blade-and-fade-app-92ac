import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingEntity, BookingStatus } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ServiceEntity } from '../service/entities/service.entity';
import { ClientEntity } from '../client/entities/client.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(BookingEntity)
    private bookingRepository: Repository<BookingEntity>,
    @InjectRepository(ServiceEntity)
    private serviceRepository: Repository<ServiceEntity>,
    @InjectRepository(ClientEntity)
    private clientRepository: Repository<ClientEntity>,
  ) {}

  async create(clientId: string, dto: CreateBookingDto) {
    const service = await this.serviceRepository.findOneBy({ id: dto.serviceId });
    if (!service) throw new NotFoundException('Service not found');

    const startTime = new Date(dto.startTime);
    const endTime = new Date(startTime.getTime() + service.durationMinutes * 60000);

    // Basic overlap check
    const overlap = await this.bookingRepository.findOne({
      where: {
        barberId: dto.barberId,
        status: BookingStatus.CONFIRMED,
        startTime: startTime, // Simplified check
      },
    });

    if (overlap) throw new BadRequestException('Barber is busy at this time');

    const booking = this.bookingRepository.create({
      ...dto,
      clientId,
      endTime,
      totalPrice: service.price,
      status: BookingStatus.CONFIRMED,
    });

    return this.bookingRepository.save(booking);
  }

  async updateStatus(id: string, status: BookingStatus) {
    const booking = await this.bookingRepository.findOneBy({ id });
    if (!booking) throw new NotFoundException('Booking not found');
    
    booking.status = status;
    if (status === BookingStatus.COMPLETED) {
      await this.clientRepository.increment({ id: booking.clientId }, 'visitCount', 1);
    }
    
    return this.bookingRepository.save(booking);
  }
}