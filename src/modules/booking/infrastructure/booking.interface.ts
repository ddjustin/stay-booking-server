import { Booking } from '../domain/booking.entity';
import { CreateBookingDto } from '../interface/booking/dto/create-booking.dto';

export interface IBookingRepository {
  create(data: CreateBookingDto): Promise<Booking>;
  findByRoom(roomId: number): Promise<Booking | null>;
}
