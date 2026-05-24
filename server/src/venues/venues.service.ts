import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VenuesService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const venue = await this.prisma.venue.findUnique({
      where: { id },
      include: { crowdZones: true, gates: true, foodVendors: { where: { isActive: true } } },
    });
    if (!venue) throw new NotFoundException('Venue not found');
    return venue;
  }

  async getCrowdData(id: string) {
    const venue = await this.prisma.venue.findUnique({ where: { id } });
    if (!venue) throw new NotFoundException('Venue not found');

    const zones = await this.prisma.crowdZone.findMany({ where: { venueId: id } });
    const gates = await this.prisma.gate.findMany({ where: { venueId: id } });
    return { zones, gates, updatedAt: new Date().toISOString() };
  }
}
