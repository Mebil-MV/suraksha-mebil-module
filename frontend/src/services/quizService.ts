import quizBankData from '../data/quiz_bank.json';

export interface QuizQuestion {
  id: string;
  type: 'single_choice' | 'true_false';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizAnimation {
  animationId: string;
  title: string;
  hazard: string;
  phase: 'before' | 'during' | 'after' | 'general';
  animationSource: string;
  questions: QuizQuestion[];
}

export interface QuizHazard {
  id: string;
  name: string;
  description: string;
  animationIds: string[];
}

export interface QuizBank {
  schemaVersion: string;
  language: string;
  defaults: {
    passingScorePercent: number;
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    showExplanationAfterEachQuestion: boolean;
  };
  hazards: QuizHazard[];
  animations: QuizAnimation[];
}

export const QUIZ_BANK = quizBankData as unknown as QuizBank;
export const STORAGE_KEY = 'suraksha.quiz.best.v1';

export function getBestScores(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('Failed to read quiz scores from localStorage', err);
    return {};
  }
}

export function getBestScore(id: string): number | null {
  const scores = getBestScores();
  return typeof scores[id] === 'number' ? scores[id] : null;
}

export function saveBestScore(id: string, scorePercent: number): number {
  const rounded = Math.round(scorePercent);
  try {
    const scores = getBestScores();
    const prev = scores[id] ?? -1;
    if (rounded > prev) {
      scores[id] = rounded;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
      return rounded;
    }
    return prev;
  } catch (err) {
    console.error('Failed to save quiz score to localStorage', err);
    return rounded;
  }
}

export function getAllHazards(): QuizHazard[] {
  return QUIZ_BANK.hazards;
}

export function getHazardById(hazardId: string): QuizHazard | undefined {
  return QUIZ_BANK.hazards.find((h) => h.id === hazardId);
}

export function getAllAnimations(): QuizAnimation[] {
  return QUIZ_BANK.animations;
}

export function getAnimationById(animationId: string): QuizAnimation | undefined {
  return QUIZ_BANK.animations.find((a) => a.animationId === animationId);
}

export function getAnimationsByHazard(hazardId: string): QuizAnimation[] {
  return QUIZ_BANK.animations.filter((a) => a.hazard === hazardId);
}

export function getQuestionsForAnimation(animationId: string): QuizQuestion[] {
  const anim = getAnimationById(animationId);
  return anim ? anim.questions : [];
}

export function getQuestionsForHazard(hazardId: string, maxQuestions: number = 10): QuizQuestion[] {
  const anims = getAnimationsByHazard(hazardId);
  const picked: QuizQuestion[] = [];
  
  // Pick at least 1 question from each animation if available
  anims.forEach((anim) => {
    if (anim.questions.length > 0) {
      const q = anim.questions[Math.floor(Math.random() * anim.questions.length)];
      picked.push(q);
    }
  });

  // If more questions needed, fill from remaining questions
  if (picked.length < maxQuestions) {
    const allRemaining = anims
      .flatMap((a) => a.questions)
      .filter((q) => !picked.some((p) => p.id === q.id));
    
    // Shuffle remaining
    const shuffled = [...allRemaining].sort(() => 0.5 - Math.random());
    picked.push(...shuffled.slice(0, maxQuestions - picked.length));
  }

  return picked.slice(0, maxQuestions);
}

export function getPassingScorePercent(): number {
  return QUIZ_BANK.defaults.passingScorePercent || 60;
}
