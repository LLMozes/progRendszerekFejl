export default function DashboardPage() {
  return (
    <section className="page">
      <span className="pill">Overview</span>
      <h1>Dashboard</h1>
      <p className="page-subtitle">
        Quick summary tiles and progress charts will appear here.
      </p>
      <div className="page-grid">
        <div className="page-card">
          <strong>Total habits</strong>
          <span>--</span>
        </div>
        <div className="page-card">
          <strong>Completions</strong>
          <span>--</span>
        </div>
        <div className="page-card">
          <strong>Daily vs weekly</strong>
          <span>--</span>
        </div>
      </div>
    </section>
  );
}
