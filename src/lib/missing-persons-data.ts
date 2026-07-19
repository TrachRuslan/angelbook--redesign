export type MissingPersonStatus = "SEARCHING" | "FOUND";

export interface MissingPerson {
  id: string;
  fullName: string;
  age: number;
  lastLocation: string;
  disappearanceDate: string;
  status: MissingPersonStatus;
}

export const MISSING_PERSONS: MissingPerson[] = [
  {
    id: "1",
    fullName: "Алексей Воронов",
    age: 34,
    lastLocation: "Москва, район Хамовники",
    disappearanceDate: "2025-11-12",
    status: "SEARCHING",
  },
  {
    id: "2",
    fullName: "Мария Козлова",
    age: 28,
    lastLocation: "Санкт-Петербург, Невский проспект",
    disappearanceDate: "2025-10-03",
    status: "SEARCHING",
  },
  {
    id: "3",
    fullName: "Дмитрий Соколов",
    age: 41,
    lastLocation: "Казань, ул. Баумана",
    disappearanceDate: "2025-09-18",
    status: "FOUND",
  },
  {
    id: "4",
    fullName: "Елена Петрова",
    age: 52,
    lastLocation: "Екатеринбург, Центральный район",
    disappearanceDate: "2025-12-01",
    status: "SEARCHING",
  },
  {
    id: "5",
    fullName: "Игорь Мельников",
    age: 19,
    lastLocation: "Новосибирск, Академгородок",
    disappearanceDate: "2025-11-28",
    status: "SEARCHING",
  },
  {
    id: "6",
    fullName: "Ольга Романова",
    age: 37,
    lastLocation: "Краснодар, ул. Красная",
    disappearanceDate: "2025-08-22",
    status: "FOUND",
  },
];
