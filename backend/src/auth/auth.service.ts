import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Email kontrolü
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // USER rolünü bul (varsayılan rol)
    let userRole = await this.roleRepository.findOne({
      where: { name: 'USER' },
    });

    // Eğer USER rolü yoksa oluştur
    if (!userRole) {
      userRole = this.roleRepository.create({ name: 'USER' });
      await this.roleRepository.save(userRole);
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Yeni kullanıcı oluştur
    const user = this.userRepository.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      roleId: userRole.id,
    });

    const savedUser = await this.userRepository.save(user);

    // JWT token oluştur
    const payload = { sub: savedUser.id, email: savedUser.email };
    const token = this.jwtService.sign(payload);

    // Role bilgisini al
    const userWithRole = await this.userRepository.findOne({
      where: { id: savedUser.id },
      relations: ['role'],
    });

    if (!userWithRole) {
      throw new Error('User not found after creation');
    }

    return {
      access_token: token,
      user: {
        id: userWithRole.id,
        name: userWithRole.name,
        email: userWithRole.email,
        role: userWithRole.role.name,
      },
    };
  }

  async login(loginDto: LoginDto) {
    // Kullanıcıyı bul
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      relations: ['role'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Şifre kontrolü
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // JWT token oluştur
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
    };
  }

  async validateUser(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role'],
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}

