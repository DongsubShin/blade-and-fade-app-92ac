import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity, NotificationStatus, NotificationType } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>,
  ) {}

  async scheduleSms(clientId: string, message: string, scheduledAt: Date) {
    const notification = this.notificationRepository.create({
      clientId,
      message,
      scheduledAt,
      type: NotificationType.SMS,
      status: NotificationStatus.SCHEDULED,
    });
    return this.notificationRepository.save(notification);
  }

  // This would be called by a CRON job
  async processPendingNotifications() {
    const pending = await this.notificationRepository.find({
      where: { status: NotificationStatus.SCHEDULED },
    });

    for (const note of pending) {
      try {
        // Mock SMS Provider Logic
        this.logger.log(`Sending SMS to client ${note.clientId}: ${note.message}`);
        
        note.status = NotificationStatus.SENT;
        note.sentAt = new Date();
        await this.notificationRepository.save(note);
      } catch (error) {
        note.status = NotificationStatus.FAILED;
        note.providerResponse = { error: error.message };
        await this.notificationRepository.save(note);
      }
    }
  }
}