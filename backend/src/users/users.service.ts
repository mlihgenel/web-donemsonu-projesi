import { Injectable, NotFoundException, ForbiddenException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { EventParticipant } from '../entities/event-participant.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(EventParticipant)
    private participantRepository: Repository<EventParticipant>,
  ) {}

  async findAll() {
    const users = await this.userRepository.find({
      relations: ['role'],
      select: ['id', 'name', 'email', 'roleId'],
      order: { name: 'ASC' },
    });

    // Role objesini string'e çevir
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      role: user.role?.name || 'USER',
    }));
  }

  async findOne(id: string) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['role', 'createdEvents', 'participatedEvents'],
    });
  }


  async remove(id: string, currentUserId: string) {
    // Kendi kendini silmeyi engelle
    if (id === currentUserId) {
      throw new ForbiddenException('Kendi hesabınızı silemezsiniz');
    }

    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    // Admin kullanıcıları silmeyi engelle (opsiyonel - güvenlik için)
    if (user.role?.name === 'ADMIN') {
      throw new ForbiddenException('Admin kullanıcıları silinemez');
    }

    // Kullanıcının katıldığı etkinliklerden çıkar
    await this.participantRepository.delete({ userId: id });

    // Kullanıcıyı sil
    await this.userRepository.remove(user);

    return { message: 'Kullanıcı başarıyla silindi' };
  }
}
