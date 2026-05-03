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

const FREQUENCY_VALUES = new Set(["DAILY", "WEEKLY"]);

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

function parseFrequency(value: unknown): "DAILY" | "WEEKLY" | null {
  if (typeof value !== "string") {
    return null;
  }
  const normalized = value.toUpperCase();
  return FREQUENCY_VALUES.has(normalized) ? (normalized as "DAILY" | "WEEKLY") : null;
}

async function logAction(userId: number, action: string) {
  await prisma.systemLog.create({
    data: {
      userId,
      action,
    },
  });
}

export async function listHabits(req: Request, res: Response) {
  const userId = req.session.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  const habits = await prisma.habit.findMany({
    where: { userId },
    include: { category: true, completions: true },
    orderBy: { createdAt: "desc" },
  });

  return res.status(200).json({ habits });
}

export async function getHabit(req: Request, res: Response) {
  const userId = req.session.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  const habitId = parseId(req.params.id);
  if (!habitId) {
    return res.status(400).json({ message: "Invalid habit id." });
  }

  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId },
    include: { category: true, completions: true },
  });

  if (!habit) {
    return res.status(404).json({ message: "Habit not found." });
  }

  return res.status(200).json({ habit });
}

export async function createHabit(req: Request, res: Response) {
  const userId = req.session.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  const { title, description, goal, frequency, categoryId } = req.body as {
    title?: string;
    description?: string;
    goal?: string;
    frequency?: string;
    categoryId?: number | string;
  };

  if (!title || !goal || !frequency || categoryId === undefined) {
    return res.status(400).json({
      message: "Title, goal, frequency, and categoryId are required.",
    });
  }

  const parsedCategoryId = parseId(categoryId);
  if (!parsedCategoryId) {
    return res.status(400).json({ message: "Invalid categoryId." });
  }

  const parsedFrequency = parseFrequency(frequency);
  if (!parsedFrequency) {
    return res.status(400).json({ message: "Invalid frequency." });
  }

  const categoryExists = await prisma.category.findUnique({
    where: { id: parsedCategoryId },
    select: { id: true },
  });

  if (!categoryExists) {
    return res.status(400).json({ message: "Category not found." });
  }

  const habit = await prisma.habit.create({
    data: {
      title,
      description,
      goal,
      frequency: parsedFrequency,
      categoryId: parsedCategoryId,
      userId,
    },
    include: { category: true, completions: true },
  });

  await logAction(userId, `Created habit ${habit.id}`);

  return res.status(201).json({ habit });
}

export async function updateHabit(req: Request, res: Response) {
  const userId = req.session.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  const habitId = parseId(req.params.id);
  if (!habitId) {
    return res.status(400).json({ message: "Invalid habit id." });
  }

  const existing = await prisma.habit.findFirst({
    where: { id: habitId, userId },
    select: { id: true },
  });

  if (!existing) {
    return res.status(404).json({ message: "Habit not found." });
  }

  const { title, description, goal, frequency, categoryId } = req.body as {
    title?: string;
    description?: string | null;
    goal?: string;
    frequency?: string;
    categoryId?: number | string;
  };

  const data: {
    title?: string;
    description?: string | null;
    goal?: string;
    frequency?: "DAILY" | "WEEKLY";
    categoryId?: number;
  } = {};

  if (title !== undefined) {
    if (!title) {
      return res.status(400).json({ message: "Title cannot be empty." });
    }
    data.title = title;
  }

  if (description !== undefined) {
    data.description = description ?? null;
  }

  if (goal !== undefined) {
    if (!goal) {
      return res.status(400).json({ message: "Goal cannot be empty." });
    }
    data.goal = goal;
  }

  if (frequency !== undefined) {
    const parsedFrequency = parseFrequency(frequency);
    if (!parsedFrequency) {
      return res.status(400).json({ message: "Invalid frequency." });
    }
    data.frequency = parsedFrequency;
  }

  if (categoryId !== undefined) {
    const parsedCategoryId = parseId(categoryId);
    if (!parsedCategoryId) {
      return res.status(400).json({ message: "Invalid categoryId." });
    }

    const categoryExists = await prisma.category.findUnique({
      where: { id: parsedCategoryId },
      select: { id: true },
    });

    if (!categoryExists) {
      return res.status(400).json({ message: "Category not found." });
    }

    data.categoryId = parsedCategoryId;
  }

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ message: "No valid fields provided." });
  }

  const habit = await prisma.habit.update({
    where: { id: habitId },
    data,
    include: { category: true, completions: true },
  });

  await logAction(userId, `Updated habit ${habit.id}`);

  return res.status(200).json({ habit });
}

export async function deleteHabit(req: Request, res: Response) {
  const userId = req.session.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  const habitId = parseId(req.params.id);
  if (!habitId) {
    return res.status(400).json({ message: "Invalid habit id." });
  }

  const existing = await prisma.habit.findFirst({
    where: { id: habitId, userId },
    select: { id: true },
  });

  if (!existing) {
    return res.status(404).json({ message: "Habit not found." });
  }

  await prisma.habit.delete({ where: { id: habitId } });

  await logAction(userId, `Deleted habit ${habitId}`);

  return res.status(200).json({ message: "Habit deleted." });
}
