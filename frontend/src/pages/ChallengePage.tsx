import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../api";
import type { Challenge, VerifyResult } from "../types";
import ScenarioSVG from "../components/ScenarioSVG";
import Spinner from "../components/Spinner";
import ErrorBox from "../components/ErrorBox";

// Maps option symbols to user-friendly labels, icons, and descriptions
const optionMeta: Record<string, { icon: string; label: string; desc: string }> = {
  stand_near_window:   { icon: "🪟", label: "Stand Near Window",        desc: "Move close to the window and look outside" },
  drop_cover_hold_table: { icon: "🛡️", label: "Drop, Cover & Hold",    desc: "Get under a sturdy table and hold on" },
  enter_elevator:      { icon: "🛗", label: "Enter the Elevator",       desc: "Take the elevator to escape the building" },
  walk_into_water:     { icon: "🚶", label: "Walk Into the Water",      desc: "Wade through the floodwater on foot" },
  climb_high_ground:   { icon: "⛰️", label: "Climb to High Ground",    desc: "Move to the roof or a higher elevation" },
  run_to_basement:     { icon: "⬇️", label: "Run to the Basement",      desc: "Go underground to the basement level" },
  run_upright:         { icon: "🏃", label: "Run Upright Through Smoke", desc: "Stand up and run through the smoky hallway" },
  crawl_under_smoke:   { icon: "🐛", label: "Crawl Low Under Smoke",    desc: "Get down low and crawl where air is cleaner" },
  lock_inside_closet:  { icon: "🚪", label: "Lock Yourself in a Closet", desc: "Hide inside a closet and lock the door" },
  drive_fast_away:     { icon: "🚗", label: "Drive Away Quickly",        desc: "Get in a car and try to outrun the tornado" },
  go_to_basement:      { icon: "🏠", label: "Go to the Basement",       desc: "Take shelter in the lowest floor of the building" },
  stand_outside_watch: { icon: "👀", label: "Stand Outside and Watch",   desc: "Stay outside to observe the tornado" },
  walk_to_beach:       { icon: "🏖️", label: "Walk Towards the Beach",  desc: "Head to the shore to see what's happening" },
  run_inland_uphill:   { icon: "🏔️", label: "Run Inland & Uphill",     desc: "Immediately move to higher ground away from coast" },
  stay_in_house:       { icon: "🏡", label: "Stay Inside Your House",   desc: "Remain indoors and wait it out" },
};

const getOptionDisplay = (symbol: string) => {
  if (optionMeta[symbol]) return optionMeta[symbol];
  const label = symbol.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  return { icon: "❓", label, desc: "Choose this action" };
};

const ChallengePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchChallenge = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const challenges: Challenge[] = await apiGet("/preparedness/challenges");
      const found = challenges.find((c) => c.id === Number(id));
      if (!found) {
        setError("Challenge not found");
      } else {
        setChallenge(found);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load challenge");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchChallenge();
  }, [fetchChallenge]);

  const handleOptionClick = async (optionId: string) => {
    if (result || submitting) return;
    setSelectedOption(optionId);
    setSubmitting(true);
    setError("");
    try {
      const username = localStorage.getItem("username") || "";
      const verifyResult: VerifyResult = await apiPost(
        `/preparedness/users/${username}/challenges/${id}/verify`,
        { selected_option_id: optionId }
      );
      setResult(verifyResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;
  if (error && !challenge) return <ErrorBox message={error} onRetry={fetchChallenge} />;
  if (!challenge) return <ErrorBox message="Challenge not found" />;

  const hazardLabel = challenge.hazard_type.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="challenge-page">
      <button className="btn btn-outline back-btn" onClick={() => navigate("/")}>
        ← Back to Challenges
      </button>

      <div className="challenge-content">
        <div className="challenge-svg-large">
          <ScenarioSVG svgKey={challenge.scenario_svg_key} size="large" />
        </div>

        <div className="challenge-details">
          <span className="hazard-badge">{hazardLabel}</span>
          <h2>What should you do?</h2>
          <p className="challenge-prompt">Choose the safest action for this {hazardLabel.toLowerCase()} scenario</p>
          <p className="challenge-points">🏆 {challenge.points} points available</p>
        </div>

        {error && <ErrorBox message={error} />}

        {!result && (
          <div className="options-grid">
            {challenge.options.map((option) => {
              const display = getOptionDisplay(option.symbol);
              return (
                <button
                  key={option.id}
                  className={`option-btn ${selectedOption === option.id ? "selected" : ""}`}
                  onClick={() => handleOptionClick(option.id)}
                  disabled={submitting}
                >
                  <span className="option-icon">{display.icon}</span>
                  <div className="option-text">
                    <span className="option-label">{display.label}</span>
                    <span className="option-desc">{display.desc}</span>
                  </div>
                  <span className="option-arrow">→</span>
                </button>
              );
            })}
          </div>
        )}

        {result && (
          <div className={`result-card ${result.is_correct ? "success" : "failure"}`}>
            <div className="result-icon-large">
              {result.is_correct ? "🎉" : "😔"}
            </div>
            <h3>{result.is_correct ? "Excellent Work!" : "Not Quite Right"}</h3>
            <p className="result-subtitle">
              {result.is_correct
                ? "You chose the correct survival action!"
                : "Don't worry — learning from mistakes saves lives!"
              }
            </p>
            {!result.is_correct && (
              <div className="correct-answer-box">
                <span className="correct-label">Correct action:</span>
                <span className="correct-value">
                  {getOptionDisplay(
                    challenge.options.find(o => o.id === result.correct_option_id)?.symbol || result.correct_option_id
                  ).label}
                </span>
              </div>
            )}
            <div className="result-stats">
              <div className="result-stat">
                <span className="result-stat-icon">⭐</span>
                <span className="result-stat-num">{result.points_awarded}</span>
                <span className="result-stat-label">Points Earned</span>
              </div>
              <div className="result-stat">
                <span className="result-stat-icon">🏅</span>
                <span className="result-stat-num">{result.current_readiness_score}</span>
                <span className="result-stat-label">Total Score</span>
              </div>
            </div>
            {result.unlocked_badge && (
              <div className="badge-notification">
                <span className="badge-star">⭐</span>
                <span>New Badge Unlocked: <strong>{result.unlocked_badge.replace(/_/g, " ")}</strong></span>
              </div>
            )}
            <div className="result-actions">
              <button className="btn btn-primary" onClick={() => navigate("/")}>
                ← Back to All Challenges
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengePage;
