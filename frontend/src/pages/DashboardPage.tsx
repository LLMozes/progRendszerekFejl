import { useEffect, useState } from "react";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

type SummaryStats = {
  totalHabits: number;
  totalCompletions: number;
  dailyHabits: number;
  weeklyHabits: number;
};

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<SummaryStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await client.get<SummaryStats>("/statistics/summary");
        setStats(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load statistics.");
      } finally {
        setIsLoading(false);
      }
    };

    if (!loading && user) {
      void loadStats();
    }
  }, [loading, user]);

  if (loading) {
    return (
      <section className="page">
        <span className="pill">Overview</span>
        <h1>Dashboard</h1>
        <p className="page-subtitle">Loading your session...</p>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="page">
        <span className="pill">Overview</span>
        <h1>Dashboard</h1>
        <p className="page-subtitle">Please log in to see your stats.</p>
      </section>
    );
  }

  return (
    <section className="page">
      <span className="pill">Overview</span>
      <h1>Dashboard</h1>
      <p className="page-subtitle">
        Quick summary tiles and progress charts will appear here.
      </p>
      {isLoading ? <p className="page-subtitle">Loading statistics...</p> : null}
      {error ? <p className="form-error">{error}</p> : null}
      <div className="page-grid">
        <div className="page-card">
          <strong>Total habits</strong>
          <span>{stats ? stats.totalHabits : "--"}</span>
        </div>
        <div className="page-card">
          <strong>Completions</strong>
          <span>{stats ? stats.totalCompletions : "--"}</span>
        </div>
        <div className="page-card">
          <strong>Daily habits</strong>
          <span>{stats ? stats.dailyHabits : "--"}</span>
        </div>
        <div className="page-card">
          <strong>Weekly habits</strong>
          <span>{stats ? stats.weeklyHabits : "--"}</span>
        </div>
      </div>
    </section>
  );
}
