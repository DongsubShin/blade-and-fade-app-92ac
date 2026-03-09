import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ClientEntity } from '../../client/entities/client.entity';
import { BarberEntity } from '../../barber/entities/barber.entity';

export enum QueueStatus {
  WAITING = 'waiting',
  SERVING = 'serving',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('queue_entries')
export class QueueEntryEntity extends BaseEntity {
  @ManyToOne(() => ClientEntity, (client) => client.queueEntries)
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;

  @Column({ name: 'client_id' })
  clientId: string;

  @ManyToOne(() => BarberEntity, (barber) => barber.queueEntries, { nullable: true })
  @JoinColumn({ name: 'barber_id' })
  barber?: BarberEntity;

  @Column({ name: 'barber_id', nullable: true })
  barberId?: string;

  @Column({ name: 'position', type: 'int' })
  position: number;

  @Column({
    type: 'enum',
    enum: QueueStatus,
    default: QueueStatus.WAITING,
  })
  status: QueueStatus;

  @Column({ name: 'estimated_wait_minutes', type: 'int', default: 0 })
  estimatedWaitMinutes: number;

  @Index()
  @Column({ name: 'joined_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  joinedAt: Date;
}