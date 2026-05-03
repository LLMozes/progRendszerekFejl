import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

type Category = {
  id: number;
  name: string;
};

type Habit = {
  id: number;
  title: string;
  description: string | null;
  goal: string;
  frequency: "DAILY" | "WEEKLY";
  category: Category;
};

type HabitFormState = {
  title: string;
  description: string;
  goal: string;
  frequency: "DAILY" | "WEEKLY";
  categoryId: string;
};

const initialFormState: HabitFormState = {
  title: "",
  description: "",
  goal: "",
  frequency: "DAILY",
  categoryId: "",
};

export default function HabitsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<HabitFormState>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formKey, setFormKey] = useState(0);

  const isReady = useMemo(() => !loading && !!user, [loading, user]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [habitsResponse, categoriesResponse] = await Promise.all([
        client.get<{ habits: Habit[] }>("/habits"),
        client.get<{ categories: Category[] }>("/categories"),
      ]);
      setHabits(habitsResponse.data.habits);
      setCategories(categoriesResponse.data.categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load habits.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isReady) {
      void fetchData();
    }
  }, [isReady]);

  const resetForm = () => {
    setForm(initialFormState);
    setEditingId(null);
    setNotice(null);
    setFormKey((current) => current + 1);
  };

  const handleChange = (field: keyof HabitFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setSuccess(null);

    if (!form.title.trim() || !form.goal.trim() || !form.categoryId) {
      setError("Title, goal, frequency, and category are required.");
      return;
    }


    setIsSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        goal: form.goal.trim(),
        frequency: form.frequency,
        categoryId: Number(form.categoryId),
      };

      if (editingId) {
        await client.put(`/habits/${editingId}`, payload);
        setSuccess("Habit updated.");
      } else {
        await client.post("/habits", payload);
        setSuccess("Habit created.");
      }

      resetForm();
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (habit: Habit) => {
    const match = habit.goal.match(/\d+(?:\.\d+)?/);
    const nextGoal = match ? match[0] : "";

    setEditingId(habit.id);
    setForm({
      title: habit.title,
      description: habit.description ?? "",
      goal: nextGoal,
      frequency: habit.frequency,
      categoryId: String(habit.category.id),
    });
    setFormKey((current) => current + 1);
    setSuccess(`Editing: ${habit.title}`);
    setError(null);
    setNotice(
      match
        ? null
        : "This habit has a non-numeric goal. Enter a number to update it."
    );
  };

  const handleDelete = async (habitId: number) => {
    setError(null);
    setNotice(null);
    setSuccess(null);
    setIsSubmitting(true);
    try {
      await client.delete(`/habits/${habitId}`);
      setSuccess("Habit deleted.");
      await fetchData();
      if (editingId === habitId) {
        resetForm();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="page">
        <span className="pill">Your routines</span>
        <h1>Habits</h1>
        <p className="page-subtitle">Loading your session...</p>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="page">
        <span className="pill">Your routines</span>
        <h1>Habits</h1>
        <p className="page-subtitle">Please log in to manage your habits.</p>
      </section>
    );
  }

  return (
    <section className="page">
      <span className="pill">Your routines</span>
      <h1>Habits</h1>
      <p className="page-subtitle">Create, update, and track your habits.</p>

      {editingId ? (
        <div className="page-card edit-banner">
          <strong>Editing habit</strong>
          <span>Update the fields below and click “Update habit”.</span>
        </div>
      ) : null}

      <div className="page-section">
        <form key={formKey} className="form" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>Title</span>
          <input
            type="text"
            value={form.title}
            autoFocus={Boolean(editingId)}
            onChange={(event) => handleChange("title", event.target.value)}
            onInput={(event) =>
              handleChange("title", (event.target as HTMLInputElement).value)
            }
            required
          />
        </label>
        <label className="form-field">
          <span>Description</span>
          <input
            type="text"
            value={form.description}
            onChange={(event) => handleChange("description", event.target.value)}
            onInput={(event) =>
              handleChange("description", (event.target as HTMLInputElement).value)
            }
          />
        </label>
        <label className="form-field">
          <span>Goal</span>
          <input
            type="text"
            value={form.goal}
            onChange={(event) => handleChange("goal", event.target.value)}
            onInput={(event) =>
              handleChange("goal", (event.target as HTMLInputElement).value)
            }
            required
          />
        </label>
        <label className="form-field">
          <span>Frequency</span>
          <select
            value={form.frequency}
            onChange={(event) =>
              handleChange("frequency", event.target.value as HabitFormState["frequency"])
            }
          >
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
          </select>
        </label>
        <label className="form-field">
          <span>Category</span>
          <select
            value={form.categoryId}
            onChange={(event) => handleChange("categoryId", event.target.value)}
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={String(category.id)}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        {notice ? <p className="form-notice">{notice}</p> : null}
        {success ? <p className="form-success">{success}</p> : null}
        <div className="form-actions">
          <button className="form-button" type="submit" disabled={isSubmitting}>
            {editingId ? "Update habit" : "Create habit"}
          </button>
          {editingId ? (
            <button
              type="button"
              className="form-secondary"
              onClick={resetForm}
              disabled={isSubmitting}
            >
              Cancel edit
            </button>
          ) : null}
        </div>
        </form>
      </div>

      <div className="page-section">
        {isLoading ? <p className="page-subtitle">Loading habits...</p> : null}

        <div className="page-grid">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className={`page-card${editingId === habit.id ? " is-editing" : ""}`}
            >
              <strong>{habit.title}</strong>
              <span>{habit.description || "No description"}</span>
              <span>Goal: {habit.goal}</span>
              <span>Frequency: {habit.frequency}</span>
              <span>Category: {habit.category.name}</span>
              <div className="card-actions">
                <button type="button" onClick={() => handleEdit(habit)}>
                  Edit
                </button>
                <button type="button" onClick={() => navigate(`/habits/${habit.id}`)}>
                  Details
                </button>
                <button type="button" className="danger" onClick={() => handleDelete(habit.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
