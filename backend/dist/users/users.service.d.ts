import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { EventParticipant } from '../entities/event-participant.entity';
export declare class UsersService {
    private userRepository;
    private participantRepository;
    constructor(userRepository: Repository<User>, participantRepository: Repository<EventParticipant>);
    findAll(): Promise<{
        id: string;
        name: string;
        email: string;
        roleId: string;
        role: string;
    }[]>;
    findOne(id: string): Promise<User | null>;
    remove(id: string, currentUserId: string): Promise<{
        message: string;
    }>;
}
