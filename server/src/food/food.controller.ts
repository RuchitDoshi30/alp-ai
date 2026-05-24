import { Controller, Get, Param, Query } from '@nestjs/common';
import { FoodService } from './food.service';

@Controller('food')
export class FoodController {
  constructor(private foodService: FoodService) {}

  @Get('vendors')
  async findVendors(@Query('venueId') venueId?: string) {
    const vendors = await this.foodService.findVendors(venueId);
    return { success: true, data: vendors };
  }

  @Get('vendors/:id/menu')
  async findMenu(@Param('id') id: string) {
    const menu = await this.foodService.findMenu(id);
    return { success: true, data: menu };
  }

  @Get('queue-status')
  async getQueueStatus(@Query('eventId') eventId?: string) {
    const queues = await this.foodService.getQueueStatus(eventId);
    return { success: true, data: queues };
  }
}
