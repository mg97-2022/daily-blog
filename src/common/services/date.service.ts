import { Injectable } from '@nestjs/common';

@Injectable()
export class DateService {
  addMinutes(minutes: number, date: Date = new Date()): Date {
    return new Date(date.getTime() + minutes * 60 * 1000);
  }
}
