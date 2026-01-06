import { User } from './user.entity';
import { Event } from './event.entity';
export declare class EventParticipant {
    userId: string;
    eventId: string;
    joinedAt: Date;
    user: User;
    event: Event;
}
