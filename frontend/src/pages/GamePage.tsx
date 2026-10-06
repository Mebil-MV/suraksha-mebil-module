import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";

// Types
interface Item {
  id: string;
  name: string;
  icon: string;
  isEssential: boolean;
  reason: string;
}

const ALL_ITEMS: Item[] = [
  { id: "water", name: "Bottled Water", icon: "💧", isEssential: true, reason: "Hydration is critical. You need 1 gallon per person per day." },
  { id: "firstaid", name: "First Aid Kit", icon: "💊", isEssential: true, reason: "Crucial for treating injuries when emergency services are delayed." },
  { id: "flashlight", name: "Flashlight", icon: "🔦", isEssential: true, reason: "Power outages are common. Essential for navigating in the dark." },
  { id: "radio", name: "Radio", icon: "📻", isEssential: true, reason: "A battery/crank radio is vital for receiving official emergency broadcasts." },
  { id: "food", name: "Canned Food", icon: "🥫", isEssential: true, reason: "Non-perishable food provides necessary energy during a crisis." },
  { id: "docs", name: "Important Docs", icon: "📄", isEssential: true, reason: "IDs, insurance, and medical records are crucial for recovery." },
  { id: "whistle", name: "Whistle", icon: "🌬️", isEssential: true, reason: "The best way to signal for help if trapped; saves your voice." },
  { id: "mask", name: "Dust Mask", icon: "😷", isEssential: true, reason: "Protects your lungs from contaminated air and debris." },
  { id: "videogame", name: "Video Game Console", icon: "🎮", isEssential: false, reason: "Useless without power and takes up valuable space." },
  { id: "books", name: "Heavy Books", icon: "📚", isEssential: false, reason: "Too heavy to carry during a rapid evacuation." },
  { id: "laptop", name: "Laptop", icon: "💻", isEssential: false, reason: "Delicate, heavy, and likely won't have power or internet." },
  { id: "toaster", name: "Toaster", icon: "🍞", isEssential: false, reason: "Takes up space and requires electricity you won't have." },
  { id: "guitar", name: "Guitar", icon: "🎸", isEssential: false, reason: "Too bulky to carry when you need your hands free for safety." },
  { id: "highheels", name: "High Heels", icon: "👠", isEssential: false, reason: "Dangerous for walking over debris; you need sturdy closed-toe shoes." },
];

const MAX_SLOTS = 6;
const GAME_TIME = 20;

export default function GamePage() {
  const navigate = useNavigate();
  const { t } = useI18n();

  // State
  const [phase, setPhase] = useState<"start" | "playing" | "result">("start");
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [backpack, setBackpack] = useState<Item[]>([]);
  const [availableItems, setAvailableItems] = useState<Item[]>([]);
  const [score, setScore] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize Game
  const startGame = () => {
    // Shuffle items
    const shuffled = [...ALL_ITEMS].sort(() => Math.random() - 0.5);
    setAvailableItems(shuffled);
    setBackpack([]);
    setTimeLeft(GAME_TIME);
    setScore(0);
    setPhase("playing");
  };

  // Timer
  useEffect(() => {
    if (phase === "playing") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  // Actions
  const addToBackpack = (item: Item) => {
    if (backpack.length >= MAX_SLOTS) return;
    setBackpack([...backpack, item]);
    setAvailableItems(availableItems.filter((i) => i.id !== item.id));
  };

  const removeFromBackpack = (item: Item) => {
    setAvailableItems([...availableItems, item]);
    setBackpack(backpack.filter((i) => i.id !== item.id));
  };

  const endGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Calculate Score
    let newScore = 0;
    backpack.forEach(item => {
      if (item.isEssential) newScore += 15;
      else newScore -= 10;
    });
    setScore(newScore);
    setPhase("result");
  };

  // Render Start Phase
  if (phase === "start") {
    return (
      <div className="game-page">
        <div className="game-hero">
          <h1>🎒 {t('game.title') || "Emergency Evacuation Packer"}</h1>
          <p className="game-subtitle">{t('game.subtitle')} <strong>{GAME_TIME} {t('game.seconds')}</strong> {t('game.to_pack')}</p>
          
          <div className="game-instructions card">
            <h3>{t('game.how_to_play')}</h3>
            <ul>
              <li>{t('game.rule1')} <strong>{MAX_SLOTS} {t('game.items')}</strong> {t('game.rule1_end')}</li>
              <li>{t('game.rule2')}</li>
              <li>{t('game.rule3')}</li>
              <li>{t('game.rule4')}</li>
            </ul>
          </div>

          <button className="btn btn-primary game-start-btn" onClick={startGame}>
            {t('game.start_btn')}
          </button>
        </div>
      </div>
    );
  }

  // Render Playing Phase
  if (phase === "playing") {
    return (
      <div className="game-page">
        <div className="game-header">
          <div className="game-timer">
            <span className="timer-icon">⏱️</span>
            <span className={`timer-text ${timeLeft <= 5 ? "danger" : ""}`}>00:{timeLeft.toString().padStart(2, "0")}</span>
          </div>
          <button className="btn btn-danger" onClick={endGame}>
            {t('game.evacuate_now')}
          </button>
        </div>

        <div className="game-grid-container">
          {/* Backpack Section */}
          <div className="game-backpack-section">
            <h2>{t('game.your_backpack')} ({backpack.length}/{MAX_SLOTS})</h2>
            <div className="game-backpack">
              {Array.from({ length: MAX_SLOTS }).map((_, i) => {
                const item = backpack[i];
                return (
                  <div 
                    key={i} 
                    className={`game-slot ${item ? "filled" : "empty"}`}
                    onClick={() => item && removeFromBackpack(item)}
                  >
                    {item ? (
                      <>
                        <span className="item-icon">{item.icon}</span>
                        <span className="item-name">{item.name}</span>
                      </>
                    ) : (
                      <span className="empty-text">{t('game.empty_slot')}</span>
                    )}
                  </div>
                );
              })}
            </div>
            {backpack.length === MAX_SLOTS && <p className="backpack-full-msg">{t('game.backpack_full')}</p>}
          </div>

          {/* House/Available Items Section */}
          <div className="game-house-section">
            <h2>{t('game.house_items')}</h2>
            <p className="house-hint">{t('game.click_to_pack')}</p>
            <div className="game-items-grid">
              {availableItems.map(item => (
                <div 
                  key={item.id} 
                  className={`game-item-card ${backpack.length >= MAX_SLOTS ? "disabled" : ""}`}
                  onClick={() => addToBackpack(item)}
                >
                  <span className="item-icon">{item.icon}</span>
                  <span className="item-name">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Result Phase
  const maxPossibleScore = MAX_SLOTS * 15;
  const scorePct = Math.max(0, Math.round((score / maxPossibleScore) * 100));
  
  return (
    <div className="game-page">
      <div className="game-result">
        <div className="result-header">
          <h1>{scorePct >= 80 ? t('game.expert') : scorePct >= 50 ? t('game.survived') : t('game.needs_planning')}</h1>
          <div className="score-circle">
            <span className="score-num">{score}</span>
            <span className="score-label">{t('game.points')}</span>
          </div>
        </div>

        <div className="result-analysis">
          <h2>{t('game.your_packed_items')}</h2>
          <div className="packed-items-list">
            {backpack.length === 0 ? (
              <p className="no-items-msg">{t('game.empty_bag_msg')}</p>
            ) : (
              backpack.map(item => (
                <div key={item.id} className={`analysis-card ${item.isEssential ? "good" : "bad"}`}>
                  <div className="analysis-icon">{item.icon}</div>
                  <div className="analysis-details">
                    <h4>{item.name} {item.isEssential ? "✅ +15" : "❌ -10"} {t('game.points')}</h4>
                    <p>{item.reason}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="game-actions">
          <button className="btn btn-primary" onClick={startGame}>{t('game.play_again')}</button>
          <button className="btn btn-outline" onClick={() => navigate("/")}>{t('game.home')}</button>
        </div>
      </div>
    </div>
  );
}
