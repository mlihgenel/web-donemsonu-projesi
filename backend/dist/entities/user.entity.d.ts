import { Role } from './role.entity';
import { Event } from './event.entity';
import { EventParticipant } from './event-participant.entity';
export declare class User {
    id: string;
    name: string;
    email: string;
    password: string;
    roleId: string;
    role: Role;
    createdEvents: Event[];
    eventParticipants: EventParticipant[];
}
