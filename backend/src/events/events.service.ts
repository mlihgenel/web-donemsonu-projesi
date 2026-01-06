import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { EventParticipant } from '../entities/event-participant.entity';
import { Category } from '../entities/category.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(EventParticipant)
    private participantRepository: Repository<EventParticipant>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createEventDto: CreateEventDto, userId: string) {
    // Kategori kontrolü
    const category = await this.categoryRepository.findOne({
      where: { id: createEventDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const event = this.eventRepository.create({
      ...createEventDto,
      date: new Date(createEventDto.date),
      createdBy: userId,
    });

    return this.eventRepository.save(event);
  }

  async findAll() {
    return this.eventRepository.find({
      relations: ['createdByUser', 'category', 'participants'],
      order: { date: 'ASC' },
    });
  }

  async findOne(id: string) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['createdByUser', 'category', 'participants', 'participants.user'],
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto, userId: string, userRole: string) {
    const event = await this.findOne(id);

    // Sadece ADMIN veya etkinliği oluşturan kullanıcı güncelleyebilir
    if (userRole !== 'ADMIN' && event.createdBy !== userId) {
      throw new ForbiddenException('You can only update your own events');
    }

    // Kategori kontrolü
    if (updateEventDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateEventDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    Object.assign(event, updateEventDto);

    if (updateEventDto.date) {
      event.date = new Date(updateEventDto.date);
    }

    return this.eventRepository.save(event);
  }

  async remove(id: string, userId: string, userRole: string) {
    const event = await this.findOne(id);

    // Sadece ADMIN veya etkinliği oluşturan kullanıcı silebilir
    if (userRole !== 'ADMIN' && event.createdBy !== userId) {
      throw new ForbiddenException('You can only delete your own events');
    }

    await this.eventRepository.remove(event);
    return { message: 'Event deleted successfully' };
  }

  async joinEvent(eventId: string, userId: string, userRole: string) {
    // Admin kontrolü - Admin'ler etkinliklere katılamaz
    if (userRole === 'ADMIN') {
      throw new ForbiddenException('Admins cannot join events. Only regular users can participate.');
    }

    const event = await this.findOne(eventId);

    // Zaten katılmış mı kontrol et
    const existingParticipant = await this.participantRepository.findOne({
      where: { eventId, userId },
    });

    if (existingParticipant) {
      throw new ConflictException('Already joined this event');
    }

    const participant = this.participantRepository.create({
      eventId,
      userId,
    });

    await this.participantRepository.save(participant);
    return { message: 'Successfully joined the event' };
  }

  async leaveEvent(eventId: string, userId: string, userRole: string) {
    // Admin kontrolü
    if (userRole === 'ADMIN') {
      throw new ForbiddenException('Admins cannot leave events as they cannot join.');
    }

    const event = await this.findOne(eventId);

    const participant = await this.participantRepository.findOne({
      where: { eventId, userId },
    });

    if (!participant) {
      throw new NotFoundException('You are not a participant of this event');
    }

    await this.participantRepository.remove(participant);
    return { message: 'Successfully left the event' };
  }

  async getMyEvents(userId: string) {
    return this.eventRepository.find({
      where: { createdBy: userId },
      relations: ['category', 'participants'],
      order: { date: 'ASC' },
    });
  }

  async getJoinedEvents(userId: string) {
    const participants = await this.participantRepository.find({
      where: { userId },
      relations: ['event', 'event.category', 'event.createdByUser', 'event.participants'],
    });

    return participants.map((p) => p.event);
  }
}

