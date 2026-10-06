import { useEffect, useState, useCallback, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPost, apiDelete } from "../api";
import type { Challenge, AuthUser } from "../types";
import Spinner from "../components/Spinner";
import ErrorBox from "../components/ErrorBox";

const AdminPage = () => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // New challenge form state
  const [hazardType, setHazardType] = useState("");
  const [scenarioSvgKey, setScenarioSvgKey] = useState("room_shaking");
  const [points, setPoints] = useState(10);
  const [correctOptionId, setCorrectOptionId] = useState("");
  const [options, setOptions] = useState([
    { id: "", symbol: "" },
    { id: "", symbol: "" },
    { id: "", symbol: "" },
  ]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [authUser, challengeData] = await Promise.all([
        apiGet("/auth/me"),
        apiGet("/preparedness/challenges"),
      ]);
      setUser(authUser);
      setChallenges(challengeData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (challengeId: number) => {
    if (!confirm("Are you sure you want to delete this challenge?")) return;
    try {
      await apiDelete(`/admin/challenges/${challengeId}`);
      setChallenges((prev) => prev.filter((c) => c.id !== challengeId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleOptionChange = (index: number, field: "id" | "symbol", value: string) => {
    setOptions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!hazardType || !correctOptionId || options.some((o) => !o.id || !o.symbol)) {
      setFormError("All fields are required");
      return;
    }

    try {
      const newChallenge = await apiPost("/admin/challenges", {
        hazard_type: hazardType,
        scenario_svg_key: scenarioSvgKey,
        options,
        correct_option_id: correctOptionId,
        points,
      });
      setChallenges((prev) => [...prev, newChallenge]);
      setFormSuccess("Challenge created successfully!");
      // Reset form
      setHazardType("");
      setScenarioSvgKey("room_shaking");
      setPoints(10);
      setCorrectOptionId("");
      setOptions([
        { id: "", symbol: "" },
        { id: "", symbol: "" },
        { id: "", symbol: "" },
      ]);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Create failed");
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} onRetry={fetchData} />;
  if (user && !user.is_admin) {
    return (
      <div className="admin-page">
        <div className="access-denied">
          <h2>🚫 Access Denied</h2>
          <p>You do not have admin privileges.</p>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const svgKeyOptions = [
    "room_shaking",
    "rising_water_street",
    "smoke_corridor",
    "dark_funnel_sky",
    "ocean_receding",
  ];

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>⚙️ Admin Panel</h1>
        <button className="btn btn-outline" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </header>

      <section className="admin-section">
        <h2>Existing Challenges</h2>
        {challenges.length === 0 ? (
          <p className="empty-state">No challenges yet. Create one below!</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Hazard Type</th>
                  <th>SVG Key</th>
                  <th>Points</th>
                  <th>Options</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {challenges.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.hazard_type}</td>
                    <td><code>{c.scenario_svg_key}</code></td>
                    <td>{c.points}</td>
                    <td>{c.options.map((o) => `${o.symbol} ${o.id}`).join(", ")}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(c.id)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-section">
        <h2>Create New Challenge</h2>
        <form onSubmit={handleCreate} className="admin-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="hazardType">Hazard Type</label>
              <input
                id="hazardType"
                type="text"
                value={hazardType}
                onChange={(e) => setHazardType(e.target.value)}
                placeholder="e.g. earthquake"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="scenarioSvgKey">Scenario SVG Key</label>
              <select
                id="scenarioSvgKey"
                value={scenarioSvgKey}
                onChange={(e) => setScenarioSvgKey(e.target.value)}
              >
                {svgKeyOptions.map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="points">Points</label>
              <input
                id="points"
                type="number"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                min={1}
                required
              />
            </div>
          </div>

          <h3>Options</h3>
          {options.map((option, index) => (
            <div key={index} className="form-row">
              <div className="form-group">
                <label>Option {index + 1} ID</label>
                <input
                  type="text"
                  value={option.id}
                  onChange={(e) => handleOptionChange(index, "id", e.target.value)}
                  placeholder="e.g. drop_cover_hold"
                  required
                />
              </div>
              <div className="form-group">
                <label>Option {index + 1} Symbol</label>
                <input
                  type="text"
                  value={option.symbol}
                  onChange={(e) => handleOptionChange(index, "symbol", e.target.value)}
                  placeholder="e.g. 🛡️"
                  required
                />
              </div>
            </div>
          ))}

          <div className="form-group">
            <label htmlFor="correctOptionId">Correct Option ID</label>
            <input
              id="correctOptionId"
              type="text"
              value={correctOptionId}
              onChange={(e) => setCorrectOptionId(e.target.value)}
              placeholder="Must match one of the option IDs above"
              required
            />
          </div>

          {formError && <div className="form-error">{formError}</div>}
          {formSuccess && <div className="form-success">{formSuccess}</div>}

          <button type="submit" className="btn btn-primary">
            ➕ Create Challenge
          </button>
        </form>
      </section>
    </div>
  );
};

export default AdminPage;
