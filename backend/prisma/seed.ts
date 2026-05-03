import "dotenv/config";
import { PrismaClient, Frequency, Role } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcrypt";

const databaseUrl = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const dbPath = databaseUrl.startsWith("file:")
  ? databaseUrl.replace("file:", "")
  : databaseUrl;
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

const SEED_DATE = new Date("2026-05-03T00:00:00.000Z");

async function ensureHabitCompletion(
  habitId: number,
  completedAt: Date,
  value: number | null,
  note: string | null,
) {
  const existing = await prisma.habitCompletion.findFirst({
    where: { habitId, completedAt },
    select: { id: true },
  });

  if (!existing) {
    await prisma.habitCompletion.create({
      data: {
        habitId,
        completedAt,
        value,
        note,
      },
    });
  }
}

async function ensureSystemLog(
  userId: number | null,
  action: string,
  createdAt: Date,
) {
  const existing = await prisma.systemLog.findFirst({
    where: { userId, action, createdAt },
    select: { id: true },
  });

  if (!existing) {
    await prisma.systemLog.create({
      data: {
        userId,
        action,
        createdAt,
      },
    });
  }
}

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@habits.local" },
    update: { name: "Admin User", passwordHash, role: Role.ADMIN },
    create: {
      name: "Admin User",
      email: "admin@habits.local",
      passwordHash,
      role: Role.ADMIN,
      createdAt: SEED_DATE,
    },
  });

  const userAnna = await prisma.user.upsert({
    where: { email: "anna@habits.local" },
    update: { name: "Anna Kovacs", passwordHash, role: Role.USER },
    create: {
      name: "Anna Kovacs",
      email: "anna@habits.local",
      passwordHash,
      role: Role.USER,
      createdAt: SEED_DATE,
    },
  });

  const userBela = await prisma.user.upsert({
    where: { email: "bela@habits.local" },
    update: { name: "Bela Szabo", passwordHash, role: Role.USER },
    create: {
      name: "Bela Szabo",
      email: "bela@habits.local",
      passwordHash,
      role: Role.USER,
      createdAt: SEED_DATE,
    },
  });

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: "Sport" },
      update: { description: "Move your body", isDefault: true },
      create: {
        name: "Sport",
        description: "Move your body",
        isDefault: true,
        createdAt: SEED_DATE,
      },
    }),
    prisma.category.upsert({
      where: { name: "Reading" },
      update: { description: "Read regularly", isDefault: true },
      create: {
        name: "Reading",
        description: "Read regularly",
        isDefault: true,
        createdAt: SEED_DATE,
      },
    }),
    prisma.category.upsert({
      where: { name: "Water Intake" },
      update: { description: "Drink enough water", isDefault: true },
      create: {
        name: "Water Intake",
        description: "Drink enough water",
        isDefault: true,
        createdAt: SEED_DATE,
      },
    }),
    prisma.category.upsert({
      where: { name: "Learning" },
      update: { description: "Practice learning", isDefault: true },
      create: {
        name: "Learning",
        description: "Practice learning",
        isDefault: true,
        createdAt: SEED_DATE,
      },
    }),
  ]);

  const categoryMap = new Map(categories.map((category) => [category.name, category]));

  const habitsToEnsure = [
    {
      userId: userAnna.id,
      title: "Morning jog",
      description: "20 minutes easy run",
      goal: "20 minutes",
      frequency: Frequency.DAILY,
      category: "Sport",
    },
    {
      userId: userAnna.id,
      title: "Read fiction",
      description: "Read 15 pages",
      goal: "15 pages",
      frequency: Frequency.DAILY,
      category: "Reading",
    },
    {
      userId: userBela.id,
      title: "Water tracking",
      description: "Drink 2 liters",
      goal: "2 liters",
      frequency: Frequency.DAILY,
      category: "Water Intake",
    },
    {
      userId: userBela.id,
      title: "TypeScript practice",
      description: "Work on exercises",
      goal: "30 minutes",
      frequency: Frequency.WEEKLY,
      category: "Learning",
    },
  ];

  const ensuredHabits = [] as Array<{ id: number; title: string; userId: number }>;

  for (const habitData of habitsToEnsure) {
    const category = categoryMap.get(habitData.category);
    if (!category) {
      continue;
    }

    const existing = await prisma.habit.findFirst({
      where: {
        userId: habitData.userId,
        title: habitData.title,
      },
    });

    if (existing) {
      ensuredHabits.push(existing);
      continue;
    }

    const created = await prisma.habit.create({
      data: {
        title: habitData.title,
        description: habitData.description,
        goal: habitData.goal,
        frequency: habitData.frequency,
        userId: habitData.userId,
        categoryId: category.id,
        createdAt: SEED_DATE,
        updatedAt: SEED_DATE,
      },
    });

    ensuredHabits.push(created);
  }

  for (const habit of ensuredHabits) {
    await ensureHabitCompletion(
      habit.id,
      new Date("2026-05-01T08:00:00.000Z"),
      1,
      "Good start",
    );
    await ensureHabitCompletion(
      habit.id,
      new Date("2026-05-02T08:00:00.000Z"),
      1,
      "Keep going",
    );
  }

  await ensureSystemLog(
    adminUser.id,
    "Seeded demo users and categories",
    SEED_DATE,
  );
  await ensureSystemLog(
    userAnna.id,
    "Seeded demo habits",
    new Date("2026-05-03T09:00:00.000Z"),
  );
  await ensureSystemLog(
    userBela.id,
    "Seeded demo habits",
    new Date("2026-05-03T09:05:00.000Z"),
  );
  await ensureSystemLog(null, "Database seeded", new Date("2026-05-03T10:00:00.000Z"));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
