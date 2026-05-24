import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@CurrentUser() user: any, @Body() dto: CreateOrderDto) {
    const order = await this.ordersService.create(user.id, dto);
    return { success: true, data: order };
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  async findMine(@CurrentUser() user: any) {
    const orders = await this.ordersService.findByUser(user.id);
    return { success: true, data: orders };
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('staff', 'vendor', 'admin', 'super_admin')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    const order = await this.ordersService.updateStatus(id, status);
    return { success: true, data: order };
  }
}
