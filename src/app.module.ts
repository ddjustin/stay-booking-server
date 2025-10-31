import { Module } from '@nestjs/common';
import { BookingModule } from './modules/booking/booking.module';

@Module({
  imports: [BookingModule],
})
export class AppModule {}
