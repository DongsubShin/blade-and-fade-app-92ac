import { Entity, Column, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { BarberEntity } from '../../barber/entities/barber.entity';

@Entity('services')
export class ServiceEntity extends BaseEntity {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'duration_minutes', type: 'int' })
  durationMinutes: number;

  @Column({ name: 'price', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'category', nullable: true })
  category: string;

  @ManyToMany(() => BarberEntity, (barber) => barber.specialties)
  barbers: BarberEntity[];
}