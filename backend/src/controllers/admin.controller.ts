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

const ROLE_VALUES = new Set(["USER", "ADMIN"]);

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

function parseRole(value: unknown): "USER" | "ADMIN" | null {
  if (typeof value !== "string") {
    return null;
  }
  const normalized = value.toUpperCase();
  return ROLE_VALUES.has(normalized) ? (normalized as "USER" | "ADMIN") : null;
}

async function logAction(userId: number, action: string) {
  await prisma.systemLog.create({
    data: {
      userId,
      action,
    },
  });
}

export async function listUsers(req: Request, res: Response) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return res.status(200).json({ users });
}

export async function updateUserRole(req: Request, res: Response) {
  const adminId = req.session.user?.id;
  if (!adminId) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  const userId = parseId(req.params.id);
  if (!userId) {
    return res.status(400).json({ message: "Invalid user id." });
  }

  const { role } = req.body as { role?: string };
  const parsedRole = parseRole(role);
  if (!parsedRole) {
    return res.status(400).json({ message: "Invalid role." });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role: parsedRole },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  await logAction(adminId, `Updated user ${userId} role to ${parsedRole}`);

  return res.status(200).json({ user: updated });
}

export async function deleteUser(req: Request, res: Response) {
  const adminId = req.session.user?.id;
  if (!adminId) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  const userId = parseId(req.params.id);
  if (!userId) {
    return res.status(400).json({ message: "Invalid user id." });
  }

  if (userId === adminId) {
    return res.status(400).json({ message: "Cannot delete your own account." });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  await prisma.user.delete({ where: { id: userId } });

  await logAction(adminId, `Deleted user ${userId}`);

  return res.status(200).json({ message: "User deleted." });
}

export async function listCategories(req: Request, res: Response) {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });

  return res.status(200).json({ categories });
}

export async function createCategory(req: Request, res: Response) {
  const adminId = req.session.user?.id;
  if (!adminId) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  const { name, description, isDefault } = req.body as {
    name?: string;
    description?: string | null;
    isDefault?: boolean;
  };

  if (!name) {
    return res.status(400).json({ message: "Name is required." });
  }

  if (isDefault !== undefined && typeof isDefault !== "boolean") {
    return res.status(400).json({ message: "Invalid isDefault." });
  }

  const existing = await prisma.category.findUnique({
    where: { name },
    select: { id: true },
  });

  if (existing) {
    return res.status(409).json({ message: "Category already exists." });
  }

  const category = await prisma.category.create({
    data: {
      name,
      description: description ?? null,
      isDefault: isDefault ?? false,
    },
  });

  await logAction(adminId, `Created category ${category.id}`);

  return res.status(201).json({ category });
}

export async function updateCategory(req: Request, res: Response) {
  const adminId = req.session.user?.id;
  if (!adminId) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  const categoryId = parseId(req.params.id);
  if (!categoryId) {
    return res.status(400).json({ message: "Invalid category id." });
  }

  const { name, description, isDefault } = req.body as {
    name?: string;
    description?: string | null;
    isDefault?: boolean;
  };

  const data: {
    name?: string;
    description?: string | null;
    isDefault?: boolean;
  } = {};

  if (name !== undefined) {
    if (!name) {
      return res.status(400).json({ message: "Name cannot be empty." });
    }
    data.name = name;
  }

  if (description !== undefined) {
    data.description = description ?? null;
  }

  if (isDefault !== undefined) {
    if (typeof isDefault !== "boolean") {
      return res.status(400).json({ message: "Invalid isDefault." });
    }
    data.isDefault = isDefault;
  }

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ message: "No valid fields provided." });
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });

  if (!category) {
    return res.status(404).json({ message: "Category not found." });
  }

  const updated = await prisma.category.update({
    where: { id: categoryId },
    data,
  });

  await logAction(adminId, `Updated category ${categoryId}`);

  return res.status(200).json({ category: updated });
}

export async function deleteCategory(req: Request, res: Response) {
  const adminId = req.session.user?.id;
  if (!adminId) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  const categoryId = parseId(req.params.id);
  if (!categoryId) {
    return res.status(400).json({ message: "Invalid category id." });
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });

  if (!category) {
    return res.status(404).json({ message: "Category not found." });
  }

  const habitCount = await prisma.habit.count({
    where: { categoryId },
  });

  if (habitCount > 0) {
    return res.status(400).json({
      message: "Category cannot be deleted because it has related habits.",
    });
  }

  await prisma.category.delete({ where: { id: categoryId } });

  await logAction(adminId, `Deleted category ${categoryId}`);

  return res.status(200).json({ message: "Category deleted." });
}

export async function listSystemLogs(req: Request, res: Response) {
  const logs = await prisma.systemLog.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      },
    },
  });

  return res.status(200).json({ logs });
}
