import { useEffect, useMemo, useState } from "react";
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

  const chartItems = useMemo(
    () => [
      { label: "Total habits", value: stats?.totalHabits ?? 0 },
      { label: "Completions", value: stats?.totalCompletions ?? 0 },
      { label: "Daily habits", value: stats?.dailyHabits ?? 0 },
      { label: "Weekly habits", value: stats?.weeklyHabits ?? 0 },
    ],
    [stats]
  );

  const maxValue = useMemo(
    () => Math.max(1, ...chartItems.map((item) => item.value)),
    [chartItems]
  );

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
      <div className="page-section">
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
      </div>
      <div className="page-section">
        <div className="page-card">
          <strong>Habit overview</strong>
          <span>Quick visual snapshot of your tracking data.</span>
          <div className="mini-chart">
            {chartItems.map((item) => (
              <div key={item.label} className="mini-row">
                <span>{item.label}</span>
                <div className="mini-bar">
                  <div
                    className="mini-bar-fill"
                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                  />
                </div>
                <span className="mini-value">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="page-card">
          <strong>Today focus</strong>
          <span>Review your daily habits and add a completion if needed.</span>
        </div>
      </div>
    </section>
  );
}
