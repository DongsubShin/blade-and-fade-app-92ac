import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto, response: Response) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      select: ['id', 'email', 'passwordHash', 'role', 'fullName'],
    });

    if (!user || !(await bcrypt.compare(loginDto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });

    response.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600000, // 1 hour
    });

    const { passwordHash, ...result } = user;
    return result;
  }

  async logout(response: Response) {
    response.clearCookie('access_token');
    return { message: 'Logged out successfully' };
  }
}