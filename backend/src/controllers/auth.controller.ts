import "dotenv/config";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient, Role } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const databaseUrl = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const dbPath = databaseUrl.startsWith("file:")
  ? databaseUrl.replace("file:", "")
  : databaseUrl;
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 10;

function toPublicUser(user: {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body as {
    name?: string;
    email?: string;
    password?: string;
  };

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existing) {
    return res.status(409).json({ message: "Email already in use." });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: Role.USER,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  req.session.user = { id: user.id, role: user.role };

  return res.status(201).json({ user: toPublicUser(user) });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      passwordHash: true,
    },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  req.session.user = { id: user.id, role: user.role };

  return res.status(200).json({
    user: toPublicUser(user),
  });
}

export async function logout(req: Request, res: Response) {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({ message: "Failed to logout." });
    }

    res.clearCookie("connect.sid");
    return res.status(200).json({ message: "Logged out." });
  });
}

export async function me(req: Request, res: Response) {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  return res.status(200).json({ user: toPublicUser(user) });
}
