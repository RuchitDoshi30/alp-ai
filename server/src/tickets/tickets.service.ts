import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async findByUser(userId: string) {
    return this.prisma.ticket.findMany({
      where: { userId },
      include: { event: { include: { venue: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async verify(bookingRef: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { bookingRef },
      include: { event: { include: { venue: true } }, user: { select: { id: true, name: true, email: true } } },
    });
    if (!ticket) throw new NotFoundException('Ticket not found for this booking reference');
    return ticket;
  }
}
