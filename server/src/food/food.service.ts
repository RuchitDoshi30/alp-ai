import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FoodService {
  constructor(private prisma: PrismaService) {}

  async findVendors(venueId?: string) {
    return this.prisma.foodVendor.findMany({
      where: { isActive: true, ...(venueId && { venueId }) },
      include: { _count: { select: { menuItems: true } } },
    });
  }

  async findMenu(vendorId: string) {
    return this.prisma.menuItem.findMany({
      where: { vendorId, isAvailable: true },
      orderBy: { category: 'asc' },
    });
  }

  async getQueueStatus(eventId?: string) {
    return this.prisma.queueStatus.findMany({
      where: { ...(eventId && { eventId }) },
      include: { vendor: { select: { id: true, name: true, location: true } } },
      orderBy: { waitMinutes: 'asc' },
    });
  }
}
