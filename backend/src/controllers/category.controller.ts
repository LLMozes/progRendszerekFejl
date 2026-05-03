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

export async function listCategories(req: Request, res: Response) {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "asc" },
  });

  return res.status(200).json({ categories });
}
