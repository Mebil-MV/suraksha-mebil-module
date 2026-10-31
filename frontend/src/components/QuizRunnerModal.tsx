import { useState, useEffect, useRef } from "react";
import {
  getAnimationById,
  getHazardById,
  getQuestionsForAnimation,
  getQuestionsForHazard,
  getPassingScorePercent,
  saveBestScore,
  getBestScore,
} from "../services/quizService";
import type { QuizQuestion } from "../services/quizService";
import { useI18n } from "../i18n";

export interface QuizRunnerModalProps {
  animationId?: string;
  hazardId?: string;
  onClose: () => void;
  onWatchAnimation?: (sourceOrId: string) => void;
}

interface QuestionAnswerState {
  selectedIndex: number;
  isCorrect: boolean;
}

export default function QuizRunnerModal({
  animationId,
  hazardId,
  onClose,
  onWatchAnimation,
}: QuizRunnerModalProps) {
  const { lang } = useI18n();
  const passingPercent = getPassingScorePercent();

  // Metadata
  const anim = animationId ? getAnimationById(animationId) : undefined;
  const hazard = hazardId ? getHazardById(hazardId) : anim ? getHazardById(anim.hazard) : undefined;

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, QuestionAnswerState>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);

  const questionHeadingRef = useRef<HTMLHeadingElement | null>(null);

  // Initialize questions
  useEffect(() => {
    let qList: QuizQuestion[] = [];
    if (animationId) {
      qList = getQuestionsForAnimation(animationId);
      setBestScore(getBestScore(animationId));
    } else if (hazardId) {
      qList = getQuestionsForHazard(hazardId, 10);
      setBestScore(getBestScore(`hazard-${hazardId}`));
    }
    setQuestions(qList);
    setCurrentIndex(0);
    setAnswers({});
    setSelectedOption(null);
    setShowResult(false);
  }, [animationId, hazardId]);

  // Focus management for accessibility
  useEffect(() => {
    if (questionHeadingRef.current) {
      questionHeadingRef.current.focus();
    }
  }, [currentIndex, showResult]);

  if (questions.length === 0) {
    return (
      <div className="quiz-modal-backdrop" onClick={onClose}>
        <div className="card p-6 max-w-md mx-auto text-center" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-xl font-bold mb-2">No Questions Found</h3>
          <p className="text-gray-400 mb-4">No quiz questions are registered for this item.</p>
          <button className="btn btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const currentAnswer = answers[currentIndex];
  const isAnswered = currentAnswer !== undefined;

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    const isCorrect = idx === currentQ.correctIndex;
    setSelectedOption(idx);
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: { selectedIndex: idx, isCorrect },
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      // Calculate final score
      const correctCount = Object.values(answers).filter((a) => a.isCorrect).length;
      const pct = Math.round((correctCount / questions.length) * 100);
      const scoreKey = animationId || (hazardId ? `hazard-${hazardId}` : "general-quiz");
      const saved = saveBestScore(scoreKey, pct);
      setBestScore(saved);
      setShowResult(true);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setAnswers({});
    setSelectedOption(null);
    setShowResult(false);
  };

  const correctCount = Object.values(answers).filter((a) => a.isCorrect).length;
  const scorePercent = Math.round((correctCount / questions.length) * 100);
  const isPassed = scorePercent >= passingPercent;

  // Identify missed questions for review
  const missedQuestions = questions.filter((_, idx) => answers[idx] && !answers[idx].isCorrect);

  const titleText = anim ? anim.title : hazard ? `${hazard.name} Quiz` : "Safety Quiz";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(3, 7, 18, 0.88)",
        backdropFilter: "blur(6px)",
        zIndex: 100000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "680px",
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: "18px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)",
          display: "flex",
          flexDirection: "column",
          maxHeight: "92vh",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={titleText}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "16px 20px",
            background: "#1e293b",
            borderBottom: "1px solid #334155",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "1.2rem" }}>📝</span>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, color: "#fff" }}>
                {titleText}
              </h2>
            </div>
            {bestScore !== null && (
              <span style={{ fontSize: "0.78rem", color: "#38bdf8", fontWeight: 600 }}>
                🏆 {lang === "hi" ? "व्यक्तिगत सर्वश्रेष्ठ:" : "Personal Best:"} {bestScore}%
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close Quiz"
            style={{
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              fontSize: "1.7rem",
              lineHeight: 1,
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: "6px",
            }}
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
          {!showResult ? (
            /* Question Screen */
            <div>
              {/* Progress Tracker */}
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.85rem",
                    color: "#94a3b8",
                    marginBottom: "6px",
                    fontWeight: 600,
                  }}
                >
                  <span>
                    {lang === "hi"
                      ? `प्रश्न ${currentIndex + 1} / ${questions.length}`
                      : `Question ${currentIndex + 1} of ${questions.length}`}
                  </span>
                  <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}%</span>
                </div>
                <div style={{ width: "100%", height: "8px", background: "#1e293b", borderRadius: "4px", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${((currentIndex + 1) / questions.length) * 100}%`,
                      background: "linear-gradient(90deg, #38bdf8, #2563eb)",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <h3
                ref={questionHeadingRef}
                tabIndex={-1}
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  lineHeight: 1.45,
                  color: "#f8fafc",
                  marginBottom: "20px",
                  outline: "none",
                }}
              >
                {currentQ.question}
              </h3>

              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                {currentQ.options.map((opt, idx) => {
                  let border = "1px solid #334155";
                  let bg = "#1e293b";
                  let color = "#f1f5f9";
                  let marker = String.fromCharCode(65 + idx) + ".";

                  if (isAnswered) {
                    if (idx === currentQ.correctIndex) {
                      border = "2px solid #22c55e";
                      bg = "rgba(34, 197, 94, 0.15)";
                      color = "#4ade80";
                      marker = "✓";
                    } else if (idx === currentAnswer.selectedIndex) {
                      border = "2px solid #ef4444";
                      bg = "rgba(239, 68, 68, 0.15)";
                      color = "#f87171";
                      marker = "✗";
                    } else {
                      bg = "#0f172a";
                      color = "#64748b";
                    }
                  } else if (selectedOption === idx) {
                    border = "2px solid #38bdf8";
                    bg = "rgba(56, 189, 248, 0.1)";
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(idx)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "14px 18px",
                        minHeight: "52px",
                        background: bg,
                        border: border,
                        borderRadius: "10px",
                        color: color,
                        fontSize: "0.98rem",
                        textAlign: "left",
                        cursor: isAnswered ? "default" : "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.08)",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          flexShrink: 0,
                        }}
                      >
                        {marker}
                      </span>
                      <span style={{ flex: 1 }}>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback Alert */}
              {isAnswered && (
                <div
                  aria-live="polite"
                  style={{
                    background: currentAnswer.isCorrect ? "rgba(34, 197, 94, 0.12)" : "rgba(239, 68, 68, 0.12)",
                    borderLeft: `4px solid ${currentAnswer.isCorrect ? "#22c55e" : "#ef4444"}`,
                    padding: "14px 16px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      color: currentAnswer.isCorrect ? "#4ade80" : "#f87171",
                      marginBottom: "4px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span>{currentAnswer.isCorrect ? "✓" : "✗"}</span>
                    <span>{currentAnswer.isCorrect ? (lang === "hi" ? "सही उत्तर!" : "Correct!") : (lang === "hi" ? "गलत उत्तर!" : "Not quite.")}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.92rem", color: "#cbd5e1", lineHeight: 1.45 }}>
                    {currentQ.explanation}
                  </p>
                </div>
              )}

              {/* Next Button */}
              {isAnswered && (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    className="btn btn-primary"
                    onClick={handleNext}
                    style={{ padding: "10px 24px", fontWeight: 600, fontSize: "1rem" }}
                  >
                    {currentIndex < questions.length - 1
                      ? (lang === "hi" ? "अगला प्रश्न →" : "Next Question →")
                      : (lang === "hi" ? "परिणाम देखें 📊" : "See Result 📊")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Results Screen */
            <div style={{ textAlign: "center", padding: "10px 0" }}>
              <span style={{ fontSize: "3.5rem" }}>{isPassed ? "🎉" : "📚"}</span>
              <h3 style={{ fontSize: "1.7rem", fontWeight: 700, color: "#fff", margin: "10px 0" }}>
                {isPassed
                  ? (lang === "hi" ? "शानदार! आपने क्विज़ पास कर लिया!" : "Great job! You passed the quiz!")
                  : (lang === "hi" ? "पुनः प्रयास करें और सीखें" : "Keep learning and try again")}
              </h3>

              {/* Score Display */}
              <div
                style={{
                  display: "inline-flex",
                  flexDirection: "column",
                  alignItems: "center",
                  background: isPassed ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                  border: `2px solid ${isPassed ? "#22c55e" : "#ef4444"}`,
                  borderRadius: "16px",
                  padding: "16px 36px",
                  margin: "12px 0 20px",
                }}
              >
                <span style={{ fontSize: "2.4rem", fontWeight: 800, color: isPassed ? "#4ade80" : "#f87171" }}>
                  {scorePercent}%
                </span>
                <span style={{ fontSize: "0.95rem", color: "#cbd5e1" }}>
                  {correctCount} {lang === "hi" ? "सही उत्तर" : "correct"} / {questions.length} {lang === "hi" ? "कुल प्रश्न" : "questions"}
                </span>
                <span style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "4px" }}>
                  ({lang === "hi" ? "पासिंग स्कोर:" : "Passing requirement:"} {passingPercent}%)
                </span>
              </div>

              {/* Missed Questions Review */}
              {missedQuestions.length > 0 && (
                <div style={{ textAlign: "left", marginTop: "16px", marginBottom: "24px" }}>
                  <h4 style={{ color: "#f87171", fontSize: "1rem", fontWeight: 700, marginBottom: "10px" }}>
                    ⚠️ {lang === "hi" ? "इन प्रश्नों की समीक्षा करें:" : "Questions to review:"}
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {missedQuestions.map((q) => (
                      <div
                        key={q.id}
                        style={{
                          background: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: "10px",
                          padding: "12px 16px",
                        }}
                      >
                        <p style={{ fontWeight: 600, color: "#f1f5f9", margin: "0 0 6px", fontSize: "0.95rem" }}>
                          {q.question}
                        </p>
                        <p style={{ color: "#4ade80", fontSize: "0.88rem", margin: "0 0 4px", fontWeight: 600 }}>
                          ✓ {lang === "hi" ? "सही उत्तर:" : "Correct:"} {q.options[q.correctIndex]}
                        </p>
                        <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: 0 }}>
                          {q.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", marginTop: "20px" }}>
                <button
                  onClick={handleRetry}
                  className="btn btn-primary"
                  style={{ padding: "10px 20px", fontWeight: 600 }}
                >
                  🔄 {lang === "hi" ? "दोबारा प्रयास करें" : "Try Again"}
                </button>

                {anim && onWatchAnimation && (
                  <button
                    onClick={() => {
                      onClose();
                      onWatchAnimation(anim.animationId);
                    }}
                    className="btn btn-outline"
                    style={{ padding: "10px 20px", fontWeight: 600, borderColor: "#38bdf8", color: "#38bdf8" }}
                  >
                    🎬 {lang === "hi" ? "एनीमेशन दोबारा देखें" : "Watch Animation Again"}
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="btn btn-outline"
                  style={{ padding: "10px 20px", fontWeight: 600, borderColor: "#475569" }}
                >
                  ✕ {lang === "hi" ? "बंद करें" : "Back to Catalog"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
