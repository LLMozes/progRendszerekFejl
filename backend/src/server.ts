import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRoutes from "./routes/health.routes";

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

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Habit Tracker backend is running"
  });
});

app.use("/api/health", healthRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});