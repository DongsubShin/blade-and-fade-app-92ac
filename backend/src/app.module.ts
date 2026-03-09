import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ClientModule } from './modules/client/client.module';
import { BarberModule } from './modules/barber/barber.module';
import { BookingModule } from './modules/booking/booking.module';
import { QueueModule } from './modules/queue/queue.module';
import { ServiceModule } from './modules/service/service.module';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false, // Use migrations for production
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule,
    UserModule,
    ClientModule,
    BarberModule,
    BookingModule,
    QueueModule,
    ServiceModule,
    NotificationModule,
  ],
})
export class AppModule {}