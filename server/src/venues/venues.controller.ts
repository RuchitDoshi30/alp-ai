import { Controller, Get, Param } from '@nestjs/common';
import { VenuesService } from './venues.service';

@Controller('venues')
export class VenuesController {
  constructor(private venuesService: VenuesService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const venue = await this.venuesService.findOne(id);
    return { success: true, data: venue };
  }

  @Get(':id/crowd')
  async getCrowdData(@Param('id') id: string) {
    const data = await this.venuesService.getCrowdData(id);
    return { success: true, data };
  }
}
