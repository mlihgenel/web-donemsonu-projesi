import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategorySeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async onModuleInit() {
    await this.seedCategories();
  }

  async seedCategories() {
    const categories = [
      'Teknoloji',
      'Eğitim',
      'Müzik',
      'Spor',
      'Sanat',
      'İş & Kariyer',
      'Sosyal',
      'Sağlık',
    ];

    for (const categoryName of categories) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: categoryName },
      });

      if (!existingCategory) {
        const category = this.categoryRepository.create({ name: categoryName });
        await this.categoryRepository.save(category);
        console.log(`✅ Category created: ${categoryName}`);
      }
    }
  }
}

