import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ClientEntity } from '../../client/entities/client.entity';

export enum NotificationType {
  SMS = 'sms',
  EMAIL = 'email',
}

export enum NotificationStatus {
  SCHEDULED = 'scheduled',
  SENT = 'sent',
  FAILED = 'failed',
}

@Entity('notifications')
export class NotificationEntity extends BaseEntity {
  @ManyToOne(() => ClientEntity, (client) => client.notifications)
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;

  @Column({ name: 'client_id' })
  clientId: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column({ name: 'message', type: 'text' })
  message: string;

  @Index()
  @Column({ name: 'scheduled_at', type: 'timestamp with time zone' })
  scheduledAt: Date;

  @Column({ name: 'sent_at', type: 'timestamp with time zone', nullable: true })
  sentAt?: Date;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.SCHEDULED,
  })
  status: NotificationStatus;

  @Column({ name: 'provider_response', type: 'jsonb', nullable: true })
  providerResponse: any;
}