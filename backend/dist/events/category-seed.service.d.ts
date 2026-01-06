import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
export declare class CategorySeedService implements OnModuleInit {
    private categoryRepository;
    constructor(categoryRepository: Repository<Category>);
    onModuleInit(): Promise<void>;
    seedCategories(): Promise<void>;
}
