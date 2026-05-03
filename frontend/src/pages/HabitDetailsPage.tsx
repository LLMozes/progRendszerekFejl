import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

type Completion = {
  id: number;
  completedAt: string;
  value: number | null;
  note: string | null;
};

type CompletionFormState = {
  completedAt: string;
  value: string;
  note: string;
};

const initialFormState: CompletionFormState = {
  completedAt: "",
  value: "",
  note: "",
};

export default function HabitDetailsPage() {
  const { user, loading } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [form, setForm] = useState<CompletionFormState>(initialFormState);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const habitId = useMemo(() => Number(id), [id]);

  const fetchCompletions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await client.get<{ completions: Completion[] }>(
        `/habits/${habitId}/completions`
      );
      setCompletions(response.data.completions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load completions.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && user && Number.isFinite(habitId)) {
      void fetchCompletions();
    }
  }, [loading, user, habitId]);

  const resetForm = () => {
    setForm(initialFormState);
    setEditingId(null);
  };

  const handleChange = (field: keyof CompletionFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toIsoString = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.completedAt) {
      setError("Completion date is required.");
      return;
    }

    const isoDate = toIsoString(form.completedAt);
    if (!isoDate) {
      setError("Invalid completion date.");
      return;
    }

    const valueNumber = form.value.trim()
      ? Number(form.value)
      : null;

    if (form.value.trim() && !Number.isFinite(valueNumber)) {
      setError("Value must be a number.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        completedAt: isoDate,
        value: valueNumber,
        note: form.note.trim() || null,
      };

      if (editingId) {
        await client.put(`/completions/${editingId}`, payload);
        setSuccess("Completion updated.");
      } else {
        await client.post(`/habits/${habitId}/completions`, payload);
        setSuccess("Completion added.");
      }

      resetForm();
      await fetchCompletions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (completion: Completion) => {
    setEditingId(completion.id);
    setForm({
      completedAt: completion.completedAt.slice(0, 16),
      value: completion.value === null ? "" : String(completion.value),
      note: completion.note ?? "",
    });
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (completionId: number) => {
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    try {
      await client.delete(`/completions/${completionId}`);
      setSuccess("Completion deleted.");
      await fetchCompletions();
      if (editingId === completionId) {
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
        <span className="pill">Completions</span>
        <h1>Habit details</h1>
        <p className="page-subtitle">Loading your session...</p>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="page">
        <span className="pill">Completions</span>
        <h1>Habit details</h1>
        <p className="page-subtitle">Please log in to view completions.</p>
      </section>
    );
  }

  if (!Number.isFinite(habitId)) {
    return (
      <section className="page">
        <span className="pill">Completions</span>
        <h1>Habit details</h1>
        <p className="page-subtitle">Invalid habit id.</p>
      </section>
    );
  }

  return (
    <section className="page">
      <span className="pill">Completions</span>
      <h1>Habit {habitId}</h1>
      <p className="page-subtitle">
        Log progress and track completion history for this habit.
      </p>

      <div className="page-section">
        <button className="form-secondary" type="button" onClick={() => navigate("/habits")}>
          Back to habits
        </button>
      </div>

      <div className="page-section">
        <form className="form" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>Completed at</span>
          <input
            type="datetime-local"
            value={form.completedAt}
            onChange={(event) => handleChange("completedAt", event.target.value)}
            required
          />
        </label>
        <label className="form-field">
          <span>Value (optional)</span>
          <input
            type="text"
            value={form.value}
            onChange={(event) => handleChange("value", event.target.value)}
          />
        </label>
        <label className="form-field">
          <span>Note</span>
          <input
            type="text"
            value={form.note}
            onChange={(event) => handleChange("note", event.target.value)}
          />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        {success ? <p className="form-success">{success}</p> : null}
        <div className="form-actions">
          <button className="form-button" type="submit" disabled={isSubmitting}>
            {editingId ? "Update completion" : "Add completion"}
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
        {isLoading ? <p className="page-subtitle">Loading completions...</p> : null}

        <div className="page-grid">
          {completions.map((completion) => (
            <div key={completion.id} className="page-card">
              <strong>{new Date(completion.completedAt).toLocaleString()}</strong>
              <span>Value: {completion.value ?? "-"}</span>
              <span>Note: {completion.note ?? "-"}</span>
              <div className="card-actions">
                <button type="button" onClick={() => handleEdit(completion)}>
                  Edit
                </button>
                <button type="button" className="danger" onClick={() => handleDelete(completion.id)}>
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
