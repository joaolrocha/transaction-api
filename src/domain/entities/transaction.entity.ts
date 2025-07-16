export class Transaction {
  constructor(
    public readonly amount: number,
    public readonly timestamp: Date,
    public readonly id?: string,
  ) {}

  static create(amount: number, timestamp: Date): Transaction {
    return new Transaction(amount, timestamp, this.generateId());
  }

  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  isWithinLastSeconds(seconds: number): boolean {
    const now = new Date();
    const diffInSeconds = (now.getTime() - this.timestamp.getTime()) / 1000;
    return diffInSeconds <= seconds;
  }
}
