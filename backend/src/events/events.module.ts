import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { CategorySeedService } from './category-seed.service';
import { Event } from '../entities/event.entity';
import { EventParticipant } from '../entities/event-participant.entity';
import { Category } from '../entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, EventParticipant, Category])],
  controllers: [EventsController],
  providers: [EventsService, CategorySeedService],
  exports: [EventsService],
})
export class EventsModule {}

