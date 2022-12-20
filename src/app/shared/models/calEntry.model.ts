import { Time } from '@angular/common';

export class CalEntry {
  _id!: string;
  startDate!: Date;
  startTime!: Time;
  endDate!: Date;
  endTime!: Time;
  title!: string;
  description!: string;
  location!: string;
  numOfRegistrations!: number;
  requestsEnglish!: number;
  requestsGerman!: number;
}
