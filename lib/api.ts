import { supabase } from './supabase';
import type { Question, UserProfile, PracticeSession, MockExam } from './types';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://www.analysttrainer.com/api';

// Helper to get auth headers
async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    ...(session?.access_token && {
      'Authorization': `Bearer ${session.access_token}`
    }),
  };
}

// Helper for API requests
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// User Profile
export async function getUserProfile(): Promise<UserProfile> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return data;
}

// Questions
export async function getQuestions(params?: {
  topic?: string;
  difficulty?: string;
  limit?: number;
  offset?: number;
}): Promise<Question[]> {
  let query = supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: false });

  if (params?.topic) {
    query = query.eq('topic_area', params.topic);
  }

  if (params?.difficulty) {
    query = query.eq('difficulty_level', params.difficulty);
  }

  if (params?.limit) {
    query = query.limit(params.limit);
  }

  if (params?.offset) {
    query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getQuestionById(id: string): Promise<Question> {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Practice Sessions
export async function createPracticeSession(params: {
  topic_area?: string;
  difficulty_level?: string;
}): Promise<PracticeSession> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('practice_sessions')
    .insert({
      user_id: user.id,
      ...params,
      started_at: new Date().toISOString(),
      questions_answered: 0,
      correct_answers: 0,
      time_spent_seconds: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePracticeSession(
  id: string,
  updates: Partial<PracticeSession>
): Promise<PracticeSession> {
  const { data, error } = await supabase
    .from('practice_sessions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// User Answers
export async function submitAnswer(params: {
  question_id: string;
  session_id?: string;
  selected_answer: 'A' | 'B' | 'C';
  is_correct: boolean;
  time_spent_seconds: number;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('user_answers')
    .insert({
      user_id: user.id,
      ...params,
      answered_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Mock Exams
export async function getMockExams(): Promise<MockExam[]> {
  const { data, error } = await supabase
    .from('mock_exams')
    .select('*')
    .order('difficulty_level', { ascending: true });

  if (error) throw error;
  return data || [];
}

// Statistics
export async function getUserStats() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Get total questions answered
  const { count: totalAnswered } = await supabase
    .from('user_answers')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  // Get correct answers
  const { count: correctAnswers } = await supabase
    .from('user_answers')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_correct', true);

  // Get practice sessions
  const { count: sessionsCompleted } = await supabase
    .from('practice_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .not('completed_at', 'is', null);

  return {
    totalAnswered: totalAnswered || 0,
    correctAnswers: correctAnswers || 0,
    accuracy: totalAnswered ? Math.round((correctAnswers! / totalAnswered) * 100) : 0,
    sessionsCompleted: sessionsCompleted || 0,
  };
}
