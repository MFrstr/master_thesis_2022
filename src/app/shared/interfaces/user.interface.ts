export interface User {
  _id: string;
  fullname: string;
  email: string;
  createdAt: string;
  roles: string[];
  registrations: Registrations[];
  safetyInstruction: Date;
  isAdmin: boolean;
}

export interface Registrations {
  eventId: string;
  language: string;
}
