export default function HabitsPage() {
  return (
    <section className="page">
      <span className="pill">Your routines</span>
      <h1>Habits</h1>
      <p className="page-subtitle">
        Habit list, filters, and completion actions will be added here.
      </p>
      <div className="page-grid">
        <div className="page-card">
          <strong>Morning jog</strong>
          <span>Daily goal: 20 minutes</span>
        </div>
        <div className="page-card">
          <strong>Read fiction</strong>
          <span>Daily goal: 15 pages</span>
        </div>
        <div className="page-card">
          <strong>Water tracking</strong>
          <span>Daily goal: 2 liters</span>
        </div>
      </div>
    </section>
  );
}
