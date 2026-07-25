export type Memorial = {
  id: string;
  name: string;
  dates: string;
  candles: number;
};

export const MEMORIALS: Memorial[] = [
  { id: "1", name: "Александр Иванов", dates: "1954 — 2023", candles: 128 },
  { id: "2", name: "Елена Петрова", dates: "1962 — 2024", candles: 94 },
  { id: "3", name: "Михаил Соколов", dates: "1948 — 2022", candles: 211 },
  { id: "4", name: "Наталья Козлова", dates: "1971 — 2025", candles: 67 },
  { id: "5", name: "Дмитрий Волков", dates: "1939 — 2021", candles: 183 },
  { id: "6", name: "Ольга Морозова", dates: "1968 — 2024", candles: 52 },
  { id: "7", name: "Сергей Лебедев", dates: "1957 — 2023", candles: 146 },
  { id: "8", name: "Татьяна Новикова", dates: "1945 — 2020", candles: 302 },
  { id: "9", name: "Игорь Фёдоров", dates: "1975 — 2025", candles: 41 },
  { id: "10", name: "Мария Белова", dates: "1952 — 2022", candles: 178 },
  { id: "11", name: "Андрей Кузнецов", dates: "1960 — 2024", candles: 89 },
  { id: "12", name: "Вера Смирнова", dates: "1940 — 2019", candles: 256 },
];
