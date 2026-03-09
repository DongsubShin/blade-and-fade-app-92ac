import { Entity, Column, OneToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { BookingEntity } from '../../booking/entities/booking.entity';
import { QueueEntryEntity } from '../../queue/entities/queue-entry.entity';
import { NotificationEntity } from '../../notification/entities/notification.entity';

@Entity('clients')
export class ClientEntity extends BaseEntity {
  @OneToOne(() => UserEntity, (user) => user.client)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'user_id' })
  userId: string;

  @Index()
  @Column({ name: 'phone', nullable: true })
  phone: string;

  @Column({ name: 'visit_count', type: 'int', default: 0 })
  visitCount: number;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => BookingEntity, (booking) => booking.client)
  bookings: BookingEntity[];

  @OneToMany(() => QueueEntryEntity, (queue) => queue.client)
  queueEntries: QueueEntryEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.client)
  notifications: NotificationEntity[];
}