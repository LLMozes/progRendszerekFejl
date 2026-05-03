import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import healthRoutes from "./routes/health.routes";
import authRoutes from "./routes/auth.routes";
import habitRoutes from "./routes/habit.routes";
import completionRoutes from "./routes/completion.routes";
import adminRoutes from "./routes/admin.routes";
import statisticsRoutes from "./routes/statistics.routes";
import categoryRoutes from "./routes/category.routes";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    },
  })
);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Habit Tracker backend is running"
  });
});

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api", completionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/statistics", statisticsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});