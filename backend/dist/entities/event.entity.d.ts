import { User } from './user.entity';
import { Category } from './category.entity';
import { EventParticipant } from './event-participant.entity';
export declare class Event {
    id: string;
    title: string;
    description: string;
    date: Date;
    location: string;
    createdBy: string;
    categoryId: string;
    createdByUser: User;
    category: Category;
    participants: EventParticipant[];
}
