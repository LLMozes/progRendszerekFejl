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

function parseDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

function parseNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

async function logAction(userId: number, action: string) {
  await prisma.systemLog.create({
    data: {
      userId,
      action,
    },
  });
}

export async function listCompletions(req: Request, res: Response) {
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
    select: { id: true },
  });

  if (!habit) {
    return res.status(404).json({ message: "Habit not found." });
  }

  const completions = await prisma.habitCompletion.findMany({
    where: { habitId },
    orderBy: { completedAt: "desc" },
  });

  return res.status(200).json({ completions });
}

export async function createCompletion(req: Request, res: Response) {
  const userId = req.session.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  const habitId = parseId(req.params.habitId);
  if (!habitId) {
    return res.status(400).json({ message: "Invalid habit id." });
  }

  const { completedAt, value, note } = req.body as {
    completedAt?: string | Date;
    value?: number | string | null;
    note?: string | null;
  };

  const parsedCompletedAt = parseDate(completedAt);
  if (!parsedCompletedAt) {
    return res.status(400).json({ message: "Invalid completedAt." });
  }

  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId },
    select: { id: true },
  });

  if (!habit) {
    return res.status(404).json({ message: "Habit not found." });
  }

  let parsedValue: number | null = null;
  if (value !== undefined && value !== null) {
    parsedValue = parseNumber(value);
    if (parsedValue === null) {
      return res.status(400).json({ message: "Invalid value." });
    }
  }

  if (note !== undefined && note !== null && typeof note !== "string") {
    return res.status(400).json({ message: "Invalid note." });
  }

  const completion = await prisma.habitCompletion.create({
    data: {
      habitId,
      completedAt: parsedCompletedAt,
      value: parsedValue,
      note: note ?? null,
    },
  });

  await logAction(userId, `Created completion ${completion.id} for habit ${habitId}`);

  return res.status(201).json({ completion });
}

export async function updateCompletion(req: Request, res: Response) {
  const userId = req.session.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  const completionId = parseId(req.params.id);
  if (!completionId) {
    return res.status(400).json({ message: "Invalid completion id." });
  }

  const existing = await prisma.habitCompletion.findFirst({
    where: { id: completionId, habit: { userId } },
    select: { id: true, habitId: true },
  });

  if (!existing) {
    return res.status(404).json({ message: "Completion not found." });
  }

  const { completedAt, value, note } = req.body as {
    completedAt?: string | Date;
    value?: number | string | null;
    note?: string | null;
  };

  const data: {
    completedAt?: Date;
    value?: number | null;
    note?: string | null;
  } = {};

  if (completedAt !== undefined) {
    const parsedCompletedAt = parseDate(completedAt);
    if (!parsedCompletedAt) {
      return res.status(400).json({ message: "Invalid completedAt." });
    }
    data.completedAt = parsedCompletedAt;
  }

  if (value !== undefined) {
    if (value === null) {
      data.value = null;
    } else {
      const parsedValue = parseNumber(value);
      if (parsedValue === null) {
        return res.status(400).json({ message: "Invalid value." });
      }
      data.value = parsedValue;
    }
  }

  if (note !== undefined) {
    if (note !== null && typeof note !== "string") {
      return res.status(400).json({ message: "Invalid note." });
    }
    data.note = note ?? null;
  }

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ message: "No valid fields provided." });
  }

  const completion = await prisma.habitCompletion.update({
    where: { id: completionId },
    data,
  });

  await logAction(userId, `Updated completion ${completion.id} for habit ${existing.habitId}`);

  return res.status(200).json({ completion });
}

export async function deleteCompletion(req: Request, res: Response) {
  const userId = req.session.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  const completionId = parseId(req.params.id);
  if (!completionId) {
    return res.status(400).json({ message: "Invalid completion id." });
  }

  const existing = await prisma.habitCompletion.findFirst({
    where: { id: completionId, habit: { userId } },
    select: { id: true, habitId: true },
  });

  if (!existing) {
    return res.status(404).json({ message: "Completion not found." });
  }

  await prisma.habitCompletion.delete({ where: { id: completionId } });

  await logAction(userId, `Deleted completion ${completionId} for habit ${existing.habitId}`);

  return res.status(200).json({ message: "Completion deleted." });
}
