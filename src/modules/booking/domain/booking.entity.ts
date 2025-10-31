export class Booking {
  constructor(
    public readonly id: number,
    public readonly roomId: number,
    public readonly userId: number,
    public readonly status: string,
  ) {}
}
