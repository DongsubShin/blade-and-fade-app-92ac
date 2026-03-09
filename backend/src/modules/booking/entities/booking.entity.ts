import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ClientEntity } from '../../client/entities/client.entity';
import { BarberEntity } from '../../barber/entities/barber.entity';
import { ServiceEntity } from '../../service/entities/service.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NOSHOW = 'no_show',
}

@Entity('bookings')
export class BookingEntity extends BaseEntity {
  @ManyToOne(() => ClientEntity, (client) => client.bookings)
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;

  @Column({ name: 'client_id' })
  clientId: string;

  @ManyToOne(() => BarberEntity, (barber) => barber.bookings)
  @JoinColumn({ name: 'barber_id' })
  barber: BarberEntity;

  @Column({ name: 'barber_id' })
  barberId: string;

  @ManyToOne(() => ServiceEntity)
  @JoinColumn({ name: 'service_id' })
  service: ServiceEntity;

  @Column({ name: 'service_id' })
  serviceId: string;

  @Index()
  @Column({ name: 'start_time', type: 'timestamp with time zone' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamp with time zone' })
  endTime: Date;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({ name: 'total_price', type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;
}