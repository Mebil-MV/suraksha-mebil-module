import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../api";
import type { Challenge, UserReadiness, AuthUser } from "../types";
import ScenarioSVG from "../components/ScenarioSVG";
import Spinner from "../components/Spinner";
import ErrorBox from "../components/ErrorBox";
import { useI18n } from "../i18n";

const badgeIcons: Record<string, string> = {
  First_Responder: "🚑",
  Disaster_Ready_Hero: "🦸‍♂️",
  Survival_Expert: "🏕️",
  Emergency_Legend: "👑",
};

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [readiness, setReadiness] = useState<UserReadiness | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const authUser: AuthUser = await apiGet("/auth/me");
      setUser(authUser);
      localStorage.setItem("username", authUser.username);

      const [challengeData, readinessData] = await Promise.all([
        apiGet("/preparedness/challenges"),
        apiGet(`/preparedness/users/${authUser.username}/readiness`),
      ]);

      setChallenges(challengeData);
      setReadiness(readinessData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} onRetry={fetchData} />;

  const completedCount = readiness?.completed_challenges.length ?? 0;
  const overallProgress = challenges.length > 0 
    ? Math.round((completedCount / challenges.length) * 100) 
    : 0;

  return (
    <div className="home-page">
      {/* Top Navigation Bar */}
      <nav className="nav-bar">
        <div className="nav-brand">
          <span className="nav-logo">🛡️</span>
          <span className="nav-title">{t('home.title')}</span>
        </div>
        <div className="nav-actions">
          <span className="nav-user">👤 {user?.username}</span>
          {user?.is_admin && (
            <button className="btn btn-secondary btn-sm" onClick={() => navigate("/admin")}>
              ⚙️ {t('nav.admin')}
            </button>
          )}
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>
            {t('nav.logout')}
          </button>
        </div>
      </nav>

      {/* Hero / Stats Section */}
      <div className="dashboard-hero">
        <div className="hero-stats">
          <div className="hero-stat-card primary">
            <span className="hero-stat-icon">🎯</span>
            <div>
              <div className="hero-stat-num">{readiness?.score ?? 0}</div>
              <div className="hero-stat-label">{t('home.readiness_score')}</div>
            </div>
          </div>
          <div className="hero-stat-card success">
            <span className="hero-stat-icon">✅</span>
            <div>
              <div className="hero-stat-num">{completedCount} / {challenges.length}</div>
              <div className="hero-stat-label">{t('home.challenges_done')}</div>
            </div>
          </div>
          <div className="hero-stat-card gold">
            <span className="hero-stat-icon">🏆</span>
            <div>
              <div className="hero-stat-num">{readiness?.unlocked_badges.length ?? 0}</div>
              <div className="hero-stat-label">{t('home.badges_earned')}</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-label">
            <span>{t('home.overall_readiness')}</span>
            <span>{overallProgress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${overallProgress}%` }}></div>
          </div>
        </div>

        {/* Badges Earned */}
        {readiness && readiness.unlocked_badges.length > 0 && (
          <div className="badges-section mt-4">
            <div className="badges-list" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {readiness.unlocked_badges.map((badge, idx) => (
                <div key={idx} className="badge-chip">
                  <span className="badge-chip-icon">{badgeIcons[badge] || "🏅"}</span>
                  <span className="badge-chip-text">{badge.replace(/_/g, ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="section-header mt-5 mb-4">
        <h2>🎯 {t('home.scenarios_title')}</h2>
        <p>{t('home.scenarios_subtitle')}</p>
      </div>

      {/* Featured Quiz Section */}
      <div className="quiz-promo-card" onClick={() => navigate('/quiz')}>
        <div className="quiz-promo-icon">📝</div>
        <div className="quiz-promo-content">
          <h3>{t('home.quiz_promo_title')}</h3>
          <p>{t('home.quiz_promo_desc')}</p>
        </div>
        <button className="btn btn-primary">{t('home.start_quiz')}</button>
      </div>

      <main className="challenges-grid mt-4">
        {challenges.map((challenge) => {
          const isCompleted = readiness?.completed_challenges.includes(challenge.id);
          const rawHazard = challenge.hazard_type.toUpperCase();
          const hazardLabel = t(`hazard.${rawHazard}`) !== `hazard.${rawHazard}` ? t(`hazard.${rawHazard}`) : challenge.hazard_type.replace(/_/g, " ").toUpperCase();
          return (
            <div
              key={challenge.id}
              className={`challenge-card ${isCompleted ? "completed" : ""}`}
              onClick={() => navigate(`/challenges/${challenge.id}`)}
            >
              {isCompleted && <div className="completed-badge">✅ {t('home.done')}</div>}
              <div className="card-svg">
                <ScenarioSVG svgKey={challenge.scenario_svg_key} />
              </div>
              <div className="card-body">
                <h3 className="card-hazard">{hazardLabel}</h3>
                <div className="card-meta">
                  <span className="card-points">🏆 {challenge.points} {t('home.pts')}</span>
                  <span className={`card-status ${isCompleted ? "done" : "pending"}`}>
                    {isCompleted ? t('home.status_completed') : t('home.status_pending')}
                  </span>
                </div>
                <button className="card-action-btn">
                  {isCompleted ? t('home.btn_review') : t('home.btn_start')}
                </button>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default HomePage;
