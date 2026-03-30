// User and Authentication
export interface User {
  id: string;
  email: string;
  full_name?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  subscription_plan: 'basic' | 'premium' | null;
  subscription_status: 'active' | 'expired' | 'lifetime' | null;
  account_created_at: string;
}

// Questions and Practice
export interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  correct_answer: 'A' | 'B' | 'C';
  explanation: string;
  topic_area: string;
  subtopic?: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  keywords?: string[];
}

export interface PracticeSession {
  id: string;
  user_id: string;
  topic_area?: string;
  difficulty_level?: string;
  questions_answered: number;
  correct_answers: number;
  started_at: string;
  completed_at?: string;
  time_spent_seconds: number;
}

export interface UserAnswer {
  id: string;
  user_id: string;
  question_id: string;
  session_id?: string;
  selected_answer: 'A' | 'B' | 'C';
  is_correct: boolean;
  time_spent_seconds: number;
  answered_at: string;
}

// Mock Exams
export interface MockExam {
  id: string;
  title: string;
  description?: string;
  total_questions: number;
  time_limit_minutes: number;
  passing_score: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
}

export interface MockExamSession {
  id: string;
  user_id: string;
  mock_exam_id: string;
  started_at: string;
  completed_at?: string;
  score?: number;
  time_spent_seconds: number;
  passed?: boolean;
}

// Topic Areas
export const CFA_TOPICS = [
  'Ethical and Professional Standards',
  'Quantitative Methods',
  'Economics',
  'Financial Statement Analysis',
  'Corporate Issuers',
  'Equity Investments',
  'Fixed Income',
  'Derivatives',
  'Alternative Investments',
  'Portfolio Management',
] as const;

export type CFATopic = typeof CFA_TOPICS[number];

// API Responses
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
}
