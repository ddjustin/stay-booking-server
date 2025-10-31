import { Module } from '@nestjs/common';
import { BookingRepository } from './infrastructure/booking.repository';
import { BookingController } from './interface/booking/booking.controller';
import { BookingService } from './application/booking/booking.service';
import { PrismaService } from 'src/common/prisma.service';

@Module({
  controllers: [BookingController],
  providers: [
    BookingService,
    PrismaService,
    {
      provide: 'IBookingRepository',
      useClass: BookingRepository,
    },
  ],
})
export class BookingModule {}
