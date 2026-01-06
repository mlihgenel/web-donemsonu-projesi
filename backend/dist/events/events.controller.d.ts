import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    create(createEventDto: CreateEventDto, user: any): Promise<import("../entities").Event>;
    findAll(): Promise<import("../entities").Event[]>;
    getMyEvents(user: any): Promise<import("../entities").Event[]>;
    getJoinedEvents(user: any): Promise<import("../entities").Event[]>;
    findOne(id: string): Promise<import("../entities").Event>;
    update(id: string, updateEventDto: UpdateEventDto, user: any): Promise<import("../entities").Event>;
    remove(id: string, user: any): Promise<{
        message: string;
    }>;
    joinEvent(id: string, user: any): Promise<{
        message: string;
    }>;
    leaveEvent(id: string, user: any): Promise<{
        message: string;
    }>;
}
