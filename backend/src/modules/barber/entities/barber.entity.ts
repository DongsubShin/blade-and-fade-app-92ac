import { Entity, Column, OneToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { ServiceEntity } from '../../service/entities/service.entity';
import { BookingEntity } from '../../booking/entities/booking.entity';
import { QueueEntryEntity } from '../../queue/entities/queue-entry.entity';

@Entity('barbers')
export class BarberEntity extends BaseEntity {
  @OneToOne(() => UserEntity, (user) => user.barber)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'working_hours', type: 'jsonb', nullable: true })
  workingHours: any; // Format: { monday: { start: "09:00", end: "18:00" }, ... }

  @ManyToMany(() => ServiceEntity, (service) => service.barbers)
  @JoinTable({
    name: 'barber_specialties',
    joinColumn: { name: 'barber_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'service_id', referencedColumnName: 'id' },
  })
  specialties: ServiceEntity[];

  @OneToMany(() => BookingEntity, (booking) => booking.barber)
  bookings: BookingEntity[];

  @OneToMany(() => QueueEntryEntity, (queue) => queue.barber)
  queueEntries: QueueEntryEntity[];
}