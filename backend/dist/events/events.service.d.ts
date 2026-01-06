import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { EventParticipant } from '../entities/event-participant.entity';
import { Category } from '../entities/category.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
export declare class EventsService {
    private eventRepository;
    private participantRepository;
    private categoryRepository;
    constructor(eventRepository: Repository<Event>, participantRepository: Repository<EventParticipant>, categoryRepository: Repository<Category>);
    create(createEventDto: CreateEventDto, userId: string): Promise<Event>;
    findAll(): Promise<Event[]>;
    findOne(id: string): Promise<Event>;
    update(id: string, updateEventDto: UpdateEventDto, userId: string, userRole: string): Promise<Event>;
    remove(id: string, userId: string, userRole: string): Promise<{
        message: string;
    }>;
    joinEvent(eventId: string, userId: string, userRole: string): Promise<{
        message: string;
    }>;
    leaveEvent(eventId: string, userId: string, userRole: string): Promise<{
        message: string;
    }>;
    getMyEvents(userId: string): Promise<Event[]>;
    getJoinedEvents(userId: string): Promise<Event[]>;
}
