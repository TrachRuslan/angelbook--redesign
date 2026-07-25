export type MissingPersonStatus = "SEARCHING" | "FOUND";

export interface MissingPerson {
  id: string;
  fullName: string;
  age: number;
  lastLocation: string;
  disappearanceDate: string;
  status: MissingPersonStatus;
}

export const MISSING_PERSONS: MissingPerson[] = [];
