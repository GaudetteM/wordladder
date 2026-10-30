import dailyData from "./data/collections/daily.json";
import type { Puzzle } from "./types";

const dailyPuzzles = dailyData as Puzzle[];

const DAILY_START_DATE = "2025-10-18";

export type DailyEntry = {
  date: string;
  puzzle: Puzzle;
  isToday: boolean;
};

function parseDate(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDayIndex(dateKey: string): number {
  const start = parseDate(DAILY_START_DATE).getTime();
  const current = parseDate(dateKey).getTime();

  return Math.floor((current - start) / 86_400_000);
}

export function getDailyPuzzle(dateKey: string): Puzzle | undefined {
  const dayIndex = getDayIndex(dateKey);

  if (dayIndex < 0 || dailyPuzzles.length === 0) {
    return undefined;
  }

  return dailyPuzzles[dayIndex % dailyPuzzles.length];
}

export function getRecentDailyPuzzles(today = new Date()): DailyEntry[] {
  const todayKey = toDateKey(today);
  const entries: DailyEntry[] = [];

  for (let offset = 6; offset >= 0; offset--) {
    const date = new Date(today);
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - offset);

    const dateKey = toDateKey(date);
    const puzzle = getDailyPuzzle(dateKey);

    if (!puzzle) continue;

    entries.push({
      date: dateKey,
      puzzle,
      isToday: dateKey === todayKey,
    });
  }

  return entries;
}
