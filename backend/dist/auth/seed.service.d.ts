import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
export declare class SeedService implements OnModuleInit {
    private roleRepository;
    constructor(roleRepository: Repository<Role>);
    onModuleInit(): Promise<void>;
    seedRoles(): Promise<void>;
}
