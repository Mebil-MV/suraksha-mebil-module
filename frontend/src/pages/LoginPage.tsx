import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost, apiPostForm } from "../api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiPostForm(
        "/auth/login",
        new URLSearchParams({ username, password, grant_type: "password" })
      );
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("username", username);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError("");
    setLoading(true);
    try {
      await apiPost("/auth/register", { username, password });
      // Auto-login after registration
      const data = await apiPostForm(
        "/auth/login",
        new URLSearchParams({ username, password, grant_type: "password" })
      );
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("username", username);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>🛡️ Disaster Preparedness</h1>
          <p>Train for emergencies. Be ready when it matters.</p>
        </div>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>
          {error && <div className="login-error">{error}</div>}
          <div className="login-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? "Please wait..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
