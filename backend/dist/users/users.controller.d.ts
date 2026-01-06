import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        id: string;
        name: string;
        email: string;
        roleId: string;
        role: string;
    }[]>;
    findOne(id: string): Promise<import("../entities").User | null>;
    remove(id: string, user: any): Promise<{
        message: string;
    }>;
}
