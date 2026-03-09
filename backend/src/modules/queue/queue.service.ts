import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueueEntryEntity, QueueStatus } from './entities/queue-entry.entity';
import { JoinQueueDto } from './dto/join-queue.dto';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(QueueEntryEntity)
    private queueRepository: Repository<QueueEntryEntity>,
  ) {}

  async join(clientId: string, dto: JoinQueueDto) {
    const currentQueueLength = await this.queueRepository.count({
      where: { status: QueueStatus.WAITING },
    });

    const entry = this.queueRepository.create({
      clientId,
      barberId: dto.barberId,
      position: currentQueueLength + 1,
      estimatedWaitMinutes: currentQueueLength * 20, // 20 min avg
      status: QueueStatus.WAITING,
    });

    return this.queueRepository.save(entry);
  }

  async getActiveQueue() {
    return this.queueRepository.find({
      where: { status: QueueStatus.WAITING },
      order: { position: 'ASC' },
      relations: ['client', 'client.user', 'barber', 'barber.user'],
    });
  }

  async updateStatus(id: string, status: QueueStatus) {
    const entry = await this.queueRepository.findOneBy({ id });
    entry.status = status;
    
    if (status === QueueStatus.COMPLETED || status === QueueStatus.CANCELLED) {
      // Logic to shift positions of others could be added here
    }
    
    return this.queueRepository.save(entry);
  }
}