export type Option = {
  id: string;
  symbol: string;
};

export type Challenge = {
  id: number;
  hazard_type: string;
  scenario_svg_key: string;
  options: Option[];
  points: number;
};

export type UserReadiness = {
  user_id: string;
  score: number;
  completed_challenges: number[];
  unlocked_badges: string[];
};

export type VerifyResult = {
  is_correct: boolean;
  correct_option_id: string;
  points_awarded: number;
  current_readiness_score: number;
  unlocked_badge: string | null;
};

export type AuthUser = {
  username: string;
  is_admin: boolean;
};
// === Community Types (Mebil) ===
export type Volunteer = {
  id: number;
  user_id: string;
  full_name: string;
  phone: string | null;
  skills: string[];
  latitude: number | null;
  longitude: number | null;
  is_available: boolean;
  created_at: string | null;
};

export type SafeCheck = {
  id: number;
  user_id: string;
  latitude: number | null;
  longitude: number | null;
  message: string;
  created_at: string | null;
};

export type HelpRequest = {
  id: number;
  user_id: string;
  latitude: number | null;
  longitude: number | null;
  request_type: string;
  description: string | null;
  urgency: string;
  status: string;
  assigned_volunteer_id: number | null;
  created_at: string | null;
  updated_at: string | null;
};

export type PriorityItem = {
  help_request_id: number;
  priority_score: number;
  factors: Record<string, number | string>;
  recommendation: string;
};

// === Recovery Types (Mebil) ===
export type DamageReport = {
  id: number;
  user_id: string;
  latitude: number | null;
  longitude: number | null;
  category: string;
  severity: string;
  description: string | null;
  image_refs: string[];
  estimated_cost: number | null;
  status: string;
  created_at: string | null;
  updated_at: string | null;
};

export type RecoveryScheme = {
  id: number;
  name: string;
  description: string | null;
  eligibility: string | null;
  authority: string | null;
  contact_info: string | null;
  link: string | null;
  hazard_type: string | null;
  max_compensation: number | null;
};

export type DamageSummary = {
  total_reports: number;
  by_category: Record<string, number>;
  by_severity: Record<string, number>;
  total_estimated_cost: number;
};

// === Preparedness Content Types (Mebil) ===
export type SafetyTip = {
  id: number;
  hazard_type: string;
  phase: string;
  title: string;
  content: string;
  content_hi: string | null;
  icon: string;
  order_index: number;
};

export type MicroChallenge = {
  id: number;
  title: string;
  title_hi: string | null;
  description: string;
  description_hi: string | null;
  category: string;
  points: number;
  icon: string;
  is_completed: boolean;
};

export type ReadinessOverview = {
  quiz_score: number;
  quizzes_completed: number;
  micro_challenges_completed: number;
  total_points: number;
  level: string;
  badges: string[];
};
