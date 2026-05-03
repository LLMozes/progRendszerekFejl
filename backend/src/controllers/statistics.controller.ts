import "dotenv/config";
import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const databaseUrl = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const dbPath = databaseUrl.startsWith("file:")
  ? databaseUrl.replace("file:", "")
  : databaseUrl;
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

function parseId(value: unknown): number | null {
  if (typeof value === "number" && Number.isInteger(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
}

function toDateKey(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function getSummary(req: Request, res: Response) {
  const userId = req.session.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  const [habitCount, dailyCount, weeklyCount, completionCount] = await Promise.all([
    prisma.habit.count({ where: { userId } }),
    prisma.habit.count({ where: { userId, frequency: "DAILY" } }),
    prisma.habit.count({ where: { userId, frequency: "WEEKLY" } }),
    prisma.habitCompletion.count({ where: { habit: { userId } } }),
  ]);

  return res.status(200).json({
    totalHabits: habitCount,
    totalCompletions: completionCount,
    dailyHabits: dailyCount,
    weeklyHabits: weeklyCount,
  });
}

export async function getHabitStatistics(req: Request, res: Response) {
  const userId = req.session.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  const habitId = parseId(req.params.habitId);
  if (!habitId) {
    return res.status(400).json({ message: "Invalid habit id." });
  }

  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId },
    select: {
      id: true,
      title: true,
      frequency: true,
      goal: true,
      completions: {
        select: { completedAt: true },
        orderBy: { completedAt: "desc" },
      },
    },
  });

  if (!habit) {
    return res.status(404).json({ message: "Habit not found." });
  }

  const totalCompletions = habit.completions.length;
  const latestCompletion = habit.completions[0]?.completedAt ?? null;

  const completionsByDate: Record<string, number> = {};
  for (const completion of habit.completions) {
    const key = toDateKey(completion.completedAt);
    completionsByDate[key] = (completionsByDate[key] ?? 0) + 1;
  }

  return res.status(200).json({
    habitId: habit.id,
    title: habit.title,
    frequency: habit.frequency,
    goal: habit.goal,
    totalCompletions,
    latestCompletion,
    completionsByDate,
  });
}
