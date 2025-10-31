import { Injectable } from '@nestjs/common';
import { IBookingRepository } from './booking.interface';
import { Booking } from '../domain/booking.entity';
import { CreateBookingDto } from '../interface/booking/dto/create-booking.dto';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class BookingRepository implements IBookingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateBookingDto): Promise<Booking> {
    const booking = await this.prisma.booking.create({ data });
    return new Booking(
      booking.id,
      booking.roomId,
      booking.userId,
      booking.status,
    );
  }

  async findByRoom(roomId: number): Promise<Booking | null> {
    const booking = await this.prisma.booking.findFirst({ where: { roomId } });
    return booking
      ? new Booking(booking.id, booking.roomId, booking.userId, booking.status)
      : null;
  }
}
