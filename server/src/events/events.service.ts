import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll(sport?: string, status?: string) {
    return this.prisma.event.findMany({
      where: {
        ...(sport && { sport }),
        ...(status && { status: status as any }),
      },
      include: { venue: true },
      orderBy: { startTime: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.event.findUnique({
      where: { id },
      include: { venue: true },
    });
  }
}
