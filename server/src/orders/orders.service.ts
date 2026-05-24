import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
    if (!dto.items.length) throw new BadRequestException('Order must have at least one item');

    // Fetch menu items to calculate total
    const menuItemIds = dto.items.map(i => i.menuItemId);
    const menuItems = await this.prisma.menuItem.findMany({
      where: { id: { in: menuItemIds }, isAvailable: true },
    });

    if (menuItems.length !== menuItemIds.length) {
      throw new BadRequestException('Some menu items are unavailable');
    }

    const menuMap = new Map(menuItems.map(m => [m.id, m]));
    let total = new Decimal(0);

    const orderItems = dto.items.map(item => {
      const menu = menuMap.get(item.menuItemId)!;
      const lineTotal = menu.price.mul(item.quantity);
      total = total.add(lineTotal);
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menu.price,
      };
    });

    return this.prisma.order.create({
      data: {
        userId,
        eventId: dto.eventId,
        vendorId: dto.vendorId,
        total,
        deliverySeat: dto.deliverySeat,
        items: { create: orderItems },
      },
      include: { items: { include: { menuItem: true } }, vendor: true },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { menuItem: true } }, vendor: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    return this.prisma.order.update({
      where: { id },
      data: { status: status as any },
      include: { items: { include: { menuItem: true } }, vendor: true },
    });
  }
}
