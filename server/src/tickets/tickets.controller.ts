import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { VerifyTicketDto } from './dto/verify-ticket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  async findMine(@CurrentUser() user: any) {
    const tickets = await this.ticketsService.findByUser(user.id);
    return { success: true, data: tickets };
  }

  @Post('verify')
  async verify(@Body() dto: VerifyTicketDto) {
    const ticket = await this.ticketsService.verify(dto.bookingRef);
    return { success: true, data: ticket };
  }
}
