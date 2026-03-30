import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/Colors';
import { getQuestions, submitAnswer, createPracticeSession, updatePracticeSession } from '@/lib/api';
import type { Question, PracticeSession } from '@/lib/types';
import { Button } from '@/components/ui/Button';

export default function PracticeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const topic = params.topic as string | undefined;

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'C' | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [startTime, setStartTime] = useState<Date>(new Date());

  useEffect(() => {
    loadQuestions();
    initializeSession();
  }, [topic]);

  const initializeSession = async () => {
    try {
      const newSession = await createPracticeSession({
        topic_area: topic,
      });
      setSession(newSession);
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const fetchedQuestions = await getQuestions({
        topic,
        limit: 20,
      });
      setQuestions(fetchedQuestions);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load questions. Please try again.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = async (answer: 'A' | 'B' | 'C') => {
    if (showExplanation) return; // Already answered

    setSelectedAnswer(answer);
    setShowExplanation(true);

    const currentQuestion = questions[currentIndex];
    const isCorrect = answer === currentQuestion.correct_answer;
    const timeSpent = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);

    try {
      // Submit answer
      await submitAnswer({
        question_id: currentQuestion.id,
        session_id: session?.id,
        selected_answer: answer,
        is_correct: isCorrect,
        time_spent_seconds: timeSpent,
      });

      // Update session stats
      if (session) {
        await updatePracticeSession(session.id, {
          questions_answered: (session.questions_answered || 0) + 1,
          correct_answers: (session.correct_answers || 0) + (isCorrect ? 1 : 0),
          time_spent_seconds: (session.time_spent_seconds || 0) + timeSpent,
        });
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setStartTime(new Date());
    } else {
      // Session complete
      Alert.alert(
        'Session Complete!',
        'Great job! Would you like to practice more?',
        [
          { text: 'Go Home', onPress: () => router.push('/(app)/home') },
          { text: 'Practice Again', onPress: () => loadQuestions() },
        ]
      );
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>No questions available</Text>
        <Button title="Go Back" onPress={() => router.back()} style={styles.backButton} />
      </View>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            Question {currentIndex + 1} of {questions.length}
          </Text>
          {topic && <Text style={styles.headerSubtitle}>{topic}</Text>}
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>

      {/* Question Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Question Text */}
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{currentQuestion.question_text}</Text>
          {currentQuestion.difficulty_level && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{currentQuestion.difficulty_level}</Text>
            </View>
          )}
        </View>

        {/* Answer Options */}
        <View style={styles.optionsContainer}>
          {['A', 'B', 'C'].map((option) => {
            const optionText = currentQuestion[`option_${option.toLowerCase()}` as keyof Question] as string;
            const isSelected = selectedAnswer === option;
            const isCorrect = option === currentQuestion.correct_answer;
            const showCorrect = showExplanation && isCorrect;
            const showWrong = showExplanation && isSelected && !isCorrect;

            return (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionSelected,
                  showCorrect && styles.optionCorrect,
                  showWrong && styles.optionWrong,
                ]}
                onPress={() => handleAnswerSelect(option as 'A' | 'B' | 'C')}
                disabled={showExplanation}
              >
                <View style={styles.optionLabel}>
                  <Text style={styles.optionLetter}>{option}</Text>
                </View>
                <Text style={styles.optionText}>{optionText}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Explanation */}
        {showExplanation && (
          <View style={styles.explanationCard}>
            <Text style={styles.explanationTitle}>
              {selectedAnswer === currentQuestion.correct_answer ? '✓ Correct!' : '✗ Incorrect'}
            </Text>
            <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Button */}
      {showExplanation && (
        <View style={styles.bottomButton}>
          <Button
            title={currentIndex < questions.length - 1 ? 'Next Question' : 'Finish'}
            onPress={handleNext}
            size="large"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.xxl + Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 32,
    color: Colors.text,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.text,
  },
  headerSubtitle: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
  placeholder: {
    width: 40,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: Colors.surfaceAlt,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl * 2,
  },
  questionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  questionText: {
    ...Typography.bodyLarge,
    color: Colors.text,
    lineHeight: 28,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.md,
  },
  badgeText: {
    ...Typography.small,
    color: Colors.textSecondary,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  optionsContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  optionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  optionSelected: {
    borderColor: Colors.primary,
  },
  optionCorrect: {
    borderColor: Colors.success,
    backgroundColor: '#E6F7ED',
  },
  optionWrong: {
    borderColor: Colors.error,
    backgroundColor: '#FEE2E2',
  },
  optionLabel: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  optionLetter: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.text,
  },
  optionText: {
    ...Typography.body,
    color: Colors.text,
    flex: 1,
  },
  explanationCard: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
  },
  explanationTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  explanationText: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  bottomButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.xl,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  errorText: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
});
