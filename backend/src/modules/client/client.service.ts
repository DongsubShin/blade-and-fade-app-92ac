import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEntity } from './entities/client.entity';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientEntity)
    private clientRepository: Repository<ClientEntity>,
  ) {}

  async findAll() {
    return this.clientRepository.find({ relations: ['user'] });
  }

  async findOne(id: string) {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ['user', 'bookings', 'bookings.service'],
    });
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    const client = await this.findOne(id);
    Object.assign(client, updateClientDto);
    return this.clientRepository.save(client);
  }

  async incrementVisitCount(id: string) {
    await this.clientRepository.increment({ id }, 'visitCount', 1);
  }
}