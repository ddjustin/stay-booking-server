import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  async createBooking(userId: number, roomId: number) {
    return await this.prisma.$transaction(
      async (tx) => {
        // 1️방 조회 + FOR UPDATE (락 걸기)
        const [room] = await tx.$queryRawUnsafe<
          { id: number; isAvailable: boolean }[]
        >(`SELECT * FROM "Room" WHERE id = ${roomId} FOR UPDATE`);

        if (!room) {
          throw new ConflictException('존재하지 않는 방입니다.');
        }

        if (!room.isAvailable) {
          throw new ConflictException('이미 예약된 방입니다.');
        }

        // 예약 생성
        const booking = await tx.booking.create({
          data: {
            userId,
            roomId,
            status: 'CONFIRMED',
          },
        });

        // 방 상태 업데이트
        await tx.room.update({
          where: { id: roomId },
          data: { isAvailable: false },
        });

        return booking;
      },
      { isolationLevel: 'ReadCommitted' },
    );
  }
}
