"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_entity_1 = require("../entities/event.entity");
const event_participant_entity_1 = require("../entities/event-participant.entity");
const category_entity_1 = require("../entities/category.entity");
let EventsService = class EventsService {
    eventRepository;
    participantRepository;
    categoryRepository;
    constructor(eventRepository, participantRepository, categoryRepository) {
        this.eventRepository = eventRepository;
        this.participantRepository = participantRepository;
        this.categoryRepository = categoryRepository;
    }
    async create(createEventDto, userId) {
        const category = await this.categoryRepository.findOne({
            where: { id: createEventDto.categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        const event = this.eventRepository.create({
            ...createEventDto,
            date: new Date(createEventDto.date),
            createdBy: userId,
        });
        return this.eventRepository.save(event);
    }
    async findAll() {
        return this.eventRepository.find({
            relations: ['createdByUser', 'category', 'participants'],
            order: { date: 'ASC' },
        });
    }
    async findOne(id) {
        const event = await this.eventRepository.findOne({
            where: { id },
            relations: ['createdByUser', 'category', 'participants', 'participants.user'],
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
        }
        return event;
    }
    async update(id, updateEventDto, userId, userRole) {
        const event = await this.findOne(id);
        if (userRole !== 'ADMIN' && event.createdBy !== userId) {
            throw new common_1.ForbiddenException('You can only update your own events');
        }
        if (updateEventDto.categoryId) {
            const category = await this.categoryRepository.findOne({
                where: { id: updateEventDto.categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException('Category not found');
            }
        }
        Object.assign(event, updateEventDto);
        if (updateEventDto.date) {
            event.date = new Date(updateEventDto.date);
        }
        return this.eventRepository.save(event);
    }
    async remove(id, userId, userRole) {
        const event = await this.findOne(id);
        if (userRole !== 'ADMIN' && event.createdBy !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own events');
        }
        await this.eventRepository.remove(event);
        return { message: 'Event deleted successfully' };
    }
    async joinEvent(eventId, userId, userRole) {
        if (userRole === 'ADMIN') {
            throw new common_1.ForbiddenException('Admins cannot join events. Only regular users can participate.');
        }
        const event = await this.findOne(eventId);
        const existingParticipant = await this.participantRepository.findOne({
            where: { eventId, userId },
        });
        if (existingParticipant) {
            throw new common_1.ConflictException('Already joined this event');
        }
        const participant = this.participantRepository.create({
            eventId,
            userId,
        });
        await this.participantRepository.save(participant);
        return { message: 'Successfully joined the event' };
    }
    async leaveEvent(eventId, userId, userRole) {
        if (userRole === 'ADMIN') {
            throw new common_1.ForbiddenException('Admins cannot leave events as they cannot join.');
        }
        const event = await this.findOne(eventId);
        const participant = await this.participantRepository.findOne({
            where: { eventId, userId },
        });
        if (!participant) {
            throw new common_1.NotFoundException('You are not a participant of this event');
        }
        await this.participantRepository.remove(participant);
        return { message: 'Successfully left the event' };
    }
    async getMyEvents(userId) {
        return this.eventRepository.find({
            where: { createdBy: userId },
            relations: ['category', 'participants'],
            order: { date: 'ASC' },
        });
    }
    async getJoinedEvents(userId) {
        const participants = await this.participantRepository.find({
            where: { userId },
            relations: ['event', 'event.category', 'event.createdByUser', 'event.participants'],
        });
        return participants.map((p) => p.event);
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(event_entity_1.Event)),
    __param(1, (0, typeorm_1.InjectRepository)(event_participant_entity_1.EventParticipant)),
    __param(2, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EventsService);
//# sourceMappingURL=events.service.js.map