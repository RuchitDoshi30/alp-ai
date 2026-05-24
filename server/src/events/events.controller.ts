import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get()
  async findAll(@Query('sport') sport?: string, @Query('status') status?: string) {
    const events = await this.eventsService.findAll(sport, status);
    return { success: true, data: events };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const event = await this.eventsService.findOne(id);
    if (!event) throw new NotFoundException('Event not found');
    return { success: true, data: event };
  }
}
