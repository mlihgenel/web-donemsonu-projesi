import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createEventDto: CreateEventDto, @GetUser() user: any) {
    return this.eventsService.create(createEventDto, user.userId);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get('my-events')
  @UseGuards(JwtAuthGuard)
  getMyEvents(@GetUser() user: any) {
    return this.eventsService.getMyEvents(user.userId);
  }

  @Get('joined')
  @UseGuards(JwtAuthGuard)
  getJoinedEvents(@GetUser() user: any) {
    return this.eventsService.getJoinedEvents(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @GetUser() user: any,
  ) {
    return this.eventsService.update(id, updateEventDto, user.userId, user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string, @GetUser() user: any) {
    return this.eventsService.remove(id, user.userId, user.role);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  joinEvent(@Param('id') id: string, @GetUser() user: any) {
    return this.eventsService.joinEvent(id, user.userId, user.role);
  }

  @Delete(':id/leave')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  leaveEvent(@Param('id') id: string, @GetUser() user: any) {
    return this.eventsService.leaveEvent(id, user.userId, user.role);
  }
}

