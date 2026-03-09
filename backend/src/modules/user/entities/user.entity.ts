import { Entity, Column, OneToOne, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { BarberEntity } from '../../barber/entities/barber.entity';
import { ClientEntity } from '../../client/entities/client.entity';

export enum UserRole {
  ADMIN = 'admin',
  BARBER = 'barber',
  CLIENT = 'client',
}

@Entity('users')
export class UserEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'password_hash', select: false })
  passwordHash: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: UserRole;

  @OneToOne(() => BarberEntity, (barber) => barber.user)
  barber?: BarberEntity;

  @OneToOne(() => ClientEntity, (client) => client.user)
  client?: ClientEntity;
}