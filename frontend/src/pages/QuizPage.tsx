import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useI18n } from "../i18n";
import SpeechButton from "../components/SpeechButton";
import {
  QUIZ_BANK,
  getBestScores,
  saveBestScore,
  getQuestionsForAnimation,
  getQuestionsForHazard,
  getPassingScorePercent,
  getAnimationById,
  getHazardById,
} from "../services/quizService";
import type { QuizQuestion, QuizHazard, QuizAnimation } from "../services/quizService";

const HAZARD_META: Record<string, { icon: string; color: string; badge: string }> = {
  earthquake: { icon: "🏚️", color: "#ef4444", badge: "Seismic" },
  building: { icon: "🏛️", color: "#f59e0b", badge: "Structural" },
  landslide: { icon: "⛰️", color: "#d97706", badge: "Geological" },
  flood: { icon: "🌊", color: "#3b82f6", badge: "Hydrological" },
  heat_wave: { icon: "☀️", color: "#f97316", badge: "Thermal" },
  cold_wave: { icon: "❄️", color: "#38bdf8", badge: "Cold Wave" },
  fire: { icon: "🔥", color: "#dc2626", badge: "Fire Safety" },
  emergency_kit: { icon: "🎒", color: "#8b5cf6", badge: "Go-Bag" },
  snake_bite: { icon: "🐍", color: "#10b981", badge: "Wildlife" },
  storm: { icon: "⛈️", color: "#6366f1", badge: "Atmospheric" },
};

type ViewMode = "hazard" | "animation";
type Phase = "browse" | "quiz" | "result";

export default function QuizPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { lang } = useI18n();

  const passingPercent = getPassingScorePercent();

  // Navigation & Filtering
  const [viewMode, setViewMode] = useState<ViewMode>("hazard");
  const [searchQuery, setSearchQuery] = useState("");
  const [scores, setScores] = useState<Record<string, number>>({});

  // Active Quiz State
  const [phase, setPhase] = useState<Phase>("browse");
  const [quizTitle, setQuizTitle] = useState("");
  const [quizSubtitle, setQuizSubtitle] = useState("");
  const [currentQuizKey, setCurrentQuizKey] = useState("");
  const [activeAnimationId, setActiveAnimationId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<Record<number, { selectedIndex: number; isCorrect: boolean }>>({});
  const [startTime, setStartTime] = useState<number>(0);
  const [totalTimeSeconds, setTotalTimeSeconds] = useState<number>(0);

  const questionHeadingRef = useRef<HTMLHeadingElement | null>(null);

  // Load scores
  const reloadScores = () => {
    setScores(getBestScores());
  };

  useEffect(() => {
    reloadScores();
  }, []);

  // Handle URL query parameters (?animationId=... or ?hazardId=...)
  useEffect(() => {
    const animParam = searchParams.get("animationId");
    const hazardParam = searchParams.get("hazardId");

    if (animParam) {
      const anim = getAnimationById(animParam);
      if (anim) {
        startAnimationQuiz(anim);
      }
    } else if (hazardParam) {
      const h = getHazardById(hazardParam);
      if (h) {
        startHazardQuiz(h);
      }
    }
  }, [searchParams]);

  // Focus question heading on question change for screen readers
  useEffect(() => {
    if (phase === "quiz" && questionHeadingRef.current) {
      questionHeadingRef.current.focus();
    }
  }, [phase, currentIndex]);

  // Start Animation Quiz
  const startAnimationQuiz = (anim: QuizAnimation) => {
    const qList = getQuestionsForAnimation(anim.animationId);
    if (qList.length === 0) return;

    setQuizTitle(anim.title);
    setQuizSubtitle(`Curriculum quiz • ${qList.length} questions from animation`);
    setCurrentQuizKey(anim.animationId);
    setActiveAnimationId(anim.animationId);
    setQuestions(qList);
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswered(false);
    setAnswers({});
    setStartTime(Date.now());
    setPhase("quiz");
  };

  // Start Hazard Quiz (10 questions)
  const startHazardQuiz = (hazard: QuizHazard) => {
    const qList = getQuestionsForHazard(hazard.id, 10);
    if (qList.length === 0) return;

    setQuizTitle(`${hazard.name} Challenge`);
    setQuizSubtitle(hazard.description);
    setCurrentQuizKey(`hazard-${hazard.id}`);
    setActiveAnimationId(null);
    setQuestions(qList);
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswered(false);
    setAnswers({});
    setStartTime(Date.now());
    setPhase("quiz");
  };

  // Start All-Round Challenge
  const startAllRoundQuiz = () => {
    // Pick 1 question from each of the 10 hazards
    const allPicked: QuizQuestion[] = [];
    QUIZ_BANK.hazards.forEach((h) => {
      const q = getQuestionsForHazard(h.id, 1);
      if (q.length > 0) allPicked.push(q[0]);
    });

    setQuizTitle("Suraksha All-Hazards Grand Challenge");
    setQuizSubtitle("10 questions testing comprehensive disaster preparedness");
    setCurrentQuizKey("all-hazards-challenge");
    setActiveAnimationId(null);
    setQuestions(allPicked);
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswered(false);
    setAnswers({});
    setStartTime(Date.now());
    setPhase("quiz");
  };

  // Handle Option Select
  const handleSelectOption = (idx: number) => {
    if (answered) return;
    const currentQ = questions[currentIndex];
    const isCorrect = idx === currentQ.correctIndex;
    setSelectedOption(idx);
    setAnswered(true);
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: { selectedIndex: idx, isCorrect },
    }));
  };

  // Handle Next
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setAnswered(false);
    } else {
      // Finished
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      setTotalTimeSeconds(elapsed);
      const correctCount = Object.values(answers).filter((a) => a.isCorrect).length;
      const pct = Math.round((correctCount / questions.length) * 100);
      saveBestScore(currentQuizKey, pct);
      reloadScores();
      setPhase("result");
    }
  };

  // Handle Retake
  const handleRetake = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswered(false);
    setAnswers({});
    setStartTime(Date.now());
    setPhase("quiz");
  };

  // Filter Animations for browse mode
  const filteredAnimations = QUIZ_BANK.animations.filter((a) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      a.title.toLowerCase().includes(q) ||
      a.hazard.toLowerCase().includes(q) ||
      a.phase.toLowerCase().includes(q)
    );
  });

  // Calculate results
  const correctCount = Object.values(answers).filter((a) => a.isCorrect).length;
  const scorePercent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const isPassed = scorePercent >= passingPercent;
  const missedQuestions = questions.filter((_, idx) => answers[idx] && !answers[idx].isCorrect);
  const bestScoreForCurrent = scores[currentQuizKey] ?? scorePercent;

  // ─────────────────────────────────────────────
  // 1. ACTIVE QUIZ RUNNER SCREEN
  // ─────────────────────────────────────────────
  if (phase === "quiz" && questions.length > 0) {
    const currentQ = questions[currentIndex];
    const progressPct = ((currentIndex + 1) / questions.length) * 100;
    const currentAnswer = answers[currentIndex];

    return (
      <div className="quiz-page" style={{ maxWidth: "780px", margin: "0 auto", padding: "20px 16px 50px" }}>
        {/* Top return */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <button
            onClick={() => setPhase("browse")}
            className="btn btn-outline btn-sm"
            style={{ borderColor: "#334155", color: "#cbd5e1" }}
          >
            ← {lang === "hi" ? "क्विज़ सूची पर वापस" : "Back to Quizzes"}
          </button>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "0.85rem", color: "#38bdf8", fontWeight: 700, display: "block" }}>
              {quizTitle}
            </span>
            {quizSubtitle && (
              <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                {quizSubtitle}
              </span>
            )}
          </div>
        </div>

        <div
          className="card"
          style={{
            background: "#101a2b",
            border: "1px solid #1e314b",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}
        >
          {/* Progress Header */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "#94a3b8", marginBottom: "8px", fontWeight: 600 }}>
              <span>
                {lang === "hi"
                  ? `प्रश्न ${currentIndex + 1} / ${questions.length}`
                  : `Question ${currentIndex + 1} of ${questions.length}`}
              </span>
              <span>{Math.round(progressPct)}%</span>
            </div>
            <div style={{ width: "100%", height: "8px", background: "#09111c", borderRadius: "4px", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${progressPct}%`,
                  background: "linear-gradient(90deg, #38bdf8, #2563eb)",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>

          {/* Question Prompt */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "24px" }}>
            <h2
              ref={questionHeadingRef}
              tabIndex={-1}
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#f8fafc",
                lineHeight: 1.45,
                margin: 0,
                flex: 1,
                outline: "none",
              }}
            >
              {currentQ.question}
            </h2>
            <SpeechButton text={currentQ.question} lang="en-US" />
          </div>

          {/* Option Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
            {currentQ.options.map((opt, idx) => {
              let border = "1px solid #1e314b";
              let bg = "#0d1624";
              let color = "#e2e8f0";
              let marker = String.fromCharCode(65 + idx);

              if (answered) {
                if (idx === currentQ.correctIndex) {
                  border = "2px solid #22c55e";
                  bg = "rgba(34, 197, 94, 0.15)";
                  color = "#4ade80";
                  marker = "✓";
                } else if (idx === currentAnswer?.selectedIndex) {
                  border = "2px solid #ef4444";
                  bg = "rgba(239, 68, 68, 0.15)";
                  color = "#f87171";
                  marker = "✗";
                } else {
                  color = "#64748b";
                }
              } else if (selectedOption === idx) {
                border = "2px solid #38bdf8";
                bg = "rgba(56, 189, 248, 0.15)";
              }

              return (
                <button
                  key={idx}
                  disabled={answered}
                  onClick={() => handleSelectOption(idx)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "16px 20px",
                    minHeight: "56px",
                    background: bg,
                    border: border,
                    borderRadius: "12px",
                    color: color,
                    fontSize: "1rem",
                    textAlign: "left",
                    cursor: answered ? "default" : "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.08)",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      flexShrink: 0,
                    }}
                  >
                    {marker}
                  </span>
                  <span style={{ flex: 1, lineHeight: 1.4 }}>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Instant Feedback */}
          {answered && (
            <div
              aria-live="polite"
              style={{
                background: currentAnswer?.isCorrect ? "rgba(34, 197, 94, 0.12)" : "rgba(239, 68, 68, 0.12)",
                borderLeft: `4px solid ${currentAnswer?.isCorrect ? "#22c55e" : "#ef4444"}`,
                padding: "16px",
                borderRadius: "10px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  color: currentAnswer?.isCorrect ? "#4ade80" : "#f87171",
                  marginBottom: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>{currentAnswer?.isCorrect ? "✓" : "✗"}</span>
                <span>{currentAnswer?.isCorrect ? (lang === "hi" ? "सही उत्तर!" : "Correct.") : (lang === "hi" ? "गलत उत्तर!" : "Not quite.")}</span>
              </div>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#cbd5e1", lineHeight: 1.5 }}>
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Footer Action */}
          {answered && (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                className="btn btn-primary"
                onClick={handleNext}
                style={{ padding: "12px 28px", fontWeight: 700, fontSize: "1.05rem" }}
              >
                {currentIndex < questions.length - 1
                  ? (lang === "hi" ? "अगला प्रश्न →" : "Next Question →")
                  : (lang === "hi" ? "परिणाम देखें 📊" : "See Result 📊")}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // 2. QUIZ RESULTS SCREEN
  // ─────────────────────────────────────────────
  if (phase === "result") {
    const minutes = Math.floor(totalTimeSeconds / 60);
    const seconds = totalTimeSeconds % 60;

    return (
      <div className="quiz-page" style={{ maxWidth: "780px", margin: "0 auto", padding: "20px 16px 50px" }}>
        <div
          className="card"
          style={{
            background: "#101a2b",
            border: "1px solid #1e314b",
            borderRadius: "18px",
            padding: "32px 24px",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}
        >
          <span style={{ fontSize: "3.8rem" }}>{isPassed ? "🎉" : "📚"}</span>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#fff", margin: "12px 0 6px" }}>
            {isPassed
              ? (lang === "hi" ? "शानदार! क्विज़ पास किया!" : "Knowledge Check Passed!")
              : (lang === "hi" ? "पुनः प्रयास करें और सीखें" : "Keep Learning & Try Again")}
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "1rem", margin: "0 0 24px" }}>
            {quizTitle}
          </p>

          {/* Big Score Box */}
          <div
            style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              background: isPassed ? "rgba(34, 197, 94, 0.12)" : "rgba(239, 68, 68, 0.12)",
              border: `2px solid ${isPassed ? "#22c55e" : "#ef4444"}`,
              borderRadius: "20px",
              padding: "20px 48px",
              marginBottom: "24px",
            }}
          >
            <span style={{ fontSize: "3rem", fontWeight: 800, color: isPassed ? "#4ade80" : "#f87171" }}>
              {scorePercent}%
            </span>
            <span style={{ fontSize: "1.05rem", color: "#cbd5e1", fontWeight: 600 }}>
              {correctCount} / {questions.length} {lang === "hi" ? "सही उत्तर" : "Correct"}
            </span>
            <span style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "4px" }}>
              ({lang === "hi" ? "पासिंग आवश्यकता:" : "Passing requirement:"} {passingPercent}%)
            </span>
          </div>

          {/* Stats Summary */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "14px",
              marginBottom: "30px",
            }}
          >
            <div style={{ background: "#0d1624", padding: "14px", borderRadius: "10px", border: "1px solid #1e314b" }}>
              <span style={{ fontSize: "1.2rem" }}>🏆</span>
              <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#38bdf8" }}>{bestScoreForCurrent}%</div>
              <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{lang === "hi" ? "व्यक्तिगत सर्वश्रेष्ठ" : "Personal Best"}</div>
            </div>
            <div style={{ background: "#0d1624", padding: "14px", borderRadius: "10px", border: "1px solid #1e314b" }}>
              <span style={{ fontSize: "1.2rem" }}>⏱️</span>
              <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#cbd5e1" }}>{minutes}m {seconds}s</div>
              <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{lang === "hi" ? "समय लिया" : "Duration"}</div>
            </div>
            <div style={{ background: "#0d1624", padding: "14px", borderRadius: "10px", border: "1px solid #1e314b" }}>
              <span style={{ fontSize: "1.2rem" }}>✅</span>
              <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#4ade80" }}>{correctCount}</div>
              <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{lang === "hi" ? "सही" : "Correct"}</div>
            </div>
            <div style={{ background: "#0d1624", padding: "14px", borderRadius: "10px", border: "1px solid #1e314b" }}>
              <span style={{ fontSize: "1.2rem" }}>❌</span>
              <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#f87171" }}>{questions.length - correctCount}</div>
              <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{lang === "hi" ? "गलत" : "Missed"}</div>
            </div>
          </div>

          {/* Missed Questions Review */}
          {missedQuestions.length > 0 && (
            <div style={{ textAlign: "left", marginBottom: "32px" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f87171", marginBottom: "14px" }}>
                ⚠️ {lang === "hi" ? "समीक्षा के लिए प्रश्न:" : "Review Missed Questions:"}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {missedQuestions.map((q) => (
                  <div
                    key={q.id}
                    style={{
                      background: "#0d1624",
                      border: "1px solid #2d3f56",
                      borderRadius: "12px",
                      padding: "16px",
                    }}
                  >
                    <p style={{ fontWeight: 600, color: "#f1f5f9", margin: "0 0 8px", fontSize: "1rem" }}>
                      {q.question}
                    </p>
                    <p style={{ color: "#4ade80", fontSize: "0.92rem", margin: "0 0 6px", fontWeight: 600 }}>
                      ✓ {lang === "hi" ? "सही उत्तर:" : "Correct answer:"} {q.options[q.correctIndex]}
                    </p>
                    <p style={{ color: "#94a3b8", fontSize: "0.88rem", margin: 0, lineHeight: 1.45 }}>
                      {q.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "14px" }}>
            <button
              onClick={handleRetake}
              className="btn btn-primary"
              style={{ padding: "12px 24px", fontWeight: 700 }}
            >
              🔄 {lang === "hi" ? "पुनः प्रयास करें" : "Try Again"}
            </button>

            {activeAnimationId && (
              <button
                onClick={() => navigate("/preparedness")}
                className="btn btn-outline"
                style={{ borderColor: "#38bdf8", color: "#38bdf8", padding: "12px 24px", fontWeight: 700 }}
              >
                🎬 {lang === "hi" ? "एनीमेशन कैटलॉग पर जाएं" : "Watch Animation in Catalog"}
              </button>
            )}

            <button
              onClick={() => setPhase("browse")}
              className="btn btn-outline"
              style={{ padding: "12px 24px", fontWeight: 600 }}
            >
              📋 {lang === "hi" ? "सभी क्विज़ देखें" : "All Quizzes"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // 3. MAIN BROWSE / SELECT SCREEN
  // ─────────────────────────────────────────────
  return (
    <div className="quiz-page" style={{ padding: "10px 0 50px" }}>
      {/* Hero Header */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #101a2b 0%, #0d1522 100%)",
          border: "1px solid #1e314b",
          borderRadius: "16px",
          padding: "30px 24px",
          marginBottom: "26px",
          textAlign: "center",
          boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
        }}
      >
        <span style={{ fontSize: "2.8rem" }}>📝</span>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, margin: "10px 0 8px", color: "#fff" }}>
          {lang === "hi" ? "सुरक्षा • आपदा ज्ञान परीक्षण क्विज़" : "Suraksha • Disaster Readiness Quiz Bank"}
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "1.05rem", maxWidth: "700px", margin: "0 auto 20px" }}>
          {lang === "hi"
            ? "10 आपदा श्रेणियों और 49 सुरक्षा सिमुलेशन पर आधारित 173 प्रमाणित प्रश्न। अपनी सजगता परखें और व्यक्तिगत सर्वश्रेष्ठ अंक दर्ज करें!"
            : "173 curriculum-backed questions across 10 disaster hazards and 49 safety animations. Test your instincts and unlock verified mastery badges!"}
        </p>

        {/* Global Grand Challenge Button */}
        <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
          <button
            onClick={startAllRoundQuiz}
            className="btn btn-primary"
            style={{ padding: "12px 28px", fontSize: "1.05rem", fontWeight: 700 }}
          >
            🚀 {lang === "hi" ? "ऑल-राउंडर ग्रैंड चैलेंज (10 प्रश्न)" : "All-Hazards Grand Challenge (10 Qs)"}
          </button>
          <a
            href="/quiz-player.html"
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline"
            style={{ borderColor: "#38bdf8", color: "#38bdf8", padding: "12px 20px", fontWeight: 600 }}
          >
            Standalone Player ↗
          </a>
        </div>
      </div>

      {/* Tabs & Search */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
          marginBottom: "22px",
        }}
      >
        <div className="tabs" style={{ margin: 0 }}>
          <button
            className={`tab ${viewMode === "hazard" ? "active" : ""}`}
            onClick={() => setViewMode("hazard")}
          >
            🌋 {lang === "hi" ? "आपदा विषय (10 विषय)" : "Hazard Challenges (10 Topics)"}
          </button>
          <button
            className={`tab ${viewMode === "animation" ? "active" : ""}`}
            onClick={() => setViewMode("animation")}
          >
            🎬 {lang === "hi" ? "एनीमेशन अनुसार (49 क्विज़)" : "By Animation (49 Quizzes)"}
          </button>
        </div>

        {viewMode === "animation" && (
          <input
            type="text"
            placeholder="🔍 Search animations by topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              background: "#101a2b",
              border: "1px solid #1e314b",
              color: "#fff",
              fontSize: "0.95rem",
              width: "280px",
              outline: "none",
            }}
          />
        )}
      </div>

      {/* ─────────────────────────────────────────────
          MODE A: HAZARD TOPICS (10 HAZARDS)
          ───────────────────────────────────────────── */}
      {viewMode === "hazard" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))",
            gap: "20px",
          }}
        >
          {QUIZ_BANK.hazards.map((h) => {
            const meta = HAZARD_META[h.id] || { icon: "⚠️", color: "#38bdf8", badge: "Hazard" };
            const anims = QUIZ_BANK.animations.filter((a) => a.hazard === h.id);
            const totalQuestions = anims.reduce((sum, a) => sum + a.questions.length, 0);
            const score = scores[`hazard-${h.id}`];

            return (
              <div
                key={h.id}
                className="card"
                style={{
                  background: "#101a2b",
                  border: "1px solid #1e314b",
                  borderRadius: "16px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.2s ease, border-color 0.2s ease",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <span style={{ fontSize: "2.4rem" }}>{meta.icon}</span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        background: `${meta.color}22`,
                        color: meta.color,
                        border: `1px solid ${meta.color}44`,
                      }}
                    >
                      {meta.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0 0 8px", color: "#fff" }}>
                    {h.name}
                  </h3>
                  <p style={{ color: "#94a3b8", fontSize: "0.92rem", lineHeight: 1.45, margin: "0 0 16px" }}>
                    {h.description}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      background: "#09111c",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      color: "#cbd5e1",
                      marginBottom: "18px",
                    }}
                  >
                    <span>🎬 {anims.length} Animations</span>
                    <span>📝 {totalQuestions} Questions</span>
                  </div>
                </div>

                <div>
                  {typeof score === "number" && (
                    <div style={{ marginBottom: "10px", fontSize: "0.85rem", color: score >= 60 ? "#4ade80" : "#f87171" }}>
                      🏆 {lang === "hi" ? "व्यक्तिगत सर्वश्रेष्ठ:" : "Personal Best:"} <b>{score}%</b>
                    </div>
                  )}
                  <button
                    onClick={() => startHazardQuiz(h)}
                    className="btn btn-primary"
                    style={{ width: "100%", padding: "10px 16px", fontWeight: 700 }}
                  >
                    ▶ {lang === "hi" ? "चुनौती शुरू करें" : "Start Hazard Quiz"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─────────────────────────────────────────────
          MODE B: PER-ANIMATION SPECIFIC QUIZZES (49)
          ───────────────────────────────────────────── */}
      {viewMode === "animation" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "18px",
          }}
        >
          {filteredAnimations.map((anim) => {
            const meta = HAZARD_META[anim.hazard] || { icon: "🎬", color: "#38bdf8" };
            const score = scores[anim.animationId];
            const isPassed = typeof score === "number" && score >= 60;

            return (
              <div
                key={anim.animationId}
                className="card"
                style={{
                  background: "#101a2b",
                  border: "1px solid #1e314b",
                  borderRadius: "14px",
                  padding: "18px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "0.8rem", color: meta.color, fontWeight: 700, textTransform: "uppercase" }}>
                      {meta.icon} {anim.hazard.replace("_", " ")}
                    </span>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "4px",
                        background: "#18283d",
                        color: "#94a3b8",
                      }}
                    >
                      {anim.phase}
                    </span>
                  </div>

                  <h4 style={{ color: "#fff", fontSize: "1.05rem", fontWeight: 600, margin: "0 0 6px", lineHeight: 1.4 }}>
                    {anim.title}
                  </h4>
                  <span style={{ fontSize: "0.82rem", color: "#64748b" }}>
                    📝 {anim.questions.length} questions
                  </span>
                </div>

                <div>
                  {typeof score === "number" && (
                    <div style={{ marginBottom: "8px", fontSize: "0.8rem", color: isPassed ? "#4ade80" : "#f87171", fontWeight: 600 }}>
                      {isPassed ? `✓ Passed: ${score}%` : `Attempted: ${score}%`}
                    </div>
                  )}
                  <button
                    onClick={() => startAnimationQuiz(anim)}
                    className="btn btn-primary btn-sm"
                    style={{ width: "100%", padding: "8px 12px", fontWeight: 600 }}
                  >
                    📝 {lang === "hi" ? "परीक्षण दें" : "Take Quiz"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
