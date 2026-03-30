import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/Colors';
import { CFA_TOPICS } from '@/lib/types';

const TOPIC_EMOJIS: Record<string, string> = {
  'Ethical and Professional Standards': '⚖️',
  'Quantitative Methods': '📊',
  'Economics': '💹',
  'Financial Statement Analysis': '📋',
  'Corporate Issuers': '🏢',
  'Equity Investments': '📈',
  'Fixed Income': '💰',
  'Derivatives': '📉',
  'Alternative Investments': '🌐',
  'Portfolio Management': '💼',
};

export default function TopicsScreen() {
  const router = useRouter();

  const handleTopicPress = (topic: string) => {
    // Navigate to practice session with selected topic
    router.push({
      pathname: '/(app)/practice',
      params: { topic },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Topics</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Topics List */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.subtitle}>
          Select a topic to start practicing questions
        </Text>

        <View style={styles.topicsList}>
          {CFA_TOPICS.map((topic, index) => (
            <TouchableOpacity
              key={topic}
              style={styles.topicCard}
              onPress={() => handleTopicPress(topic)}
            >
              <View style={styles.topicIcon}>
                <Text style={styles.topicEmoji}>
                  {TOPIC_EMOJIS[topic] || '📚'}
                </Text>
              </View>
              <View style={styles.topicContent}>
                <Text style={styles.topicNumber}>Topic {index + 1}</Text>
                <Text style={styles.topicTitle}>{topic}</Text>
              </View>
              <Text style={styles.topicArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Study Tip */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={styles.tipText}>
            <Text style={styles.tipBold}>Study Tip:</Text> Focus on one topic at a time
            and aim to complete all questions in that area before moving to the next.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  headerTitle: {
    ...Typography.h2,
    color: Colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.xl,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  topicsList: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  topicCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  topicIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  topicEmoji: {
    fontSize: 28,
  },
  topicContent: {
    flex: 1,
  },
  topicNumber: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  topicTitle: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.text,
  },
  topicArrow: {
    fontSize: 32,
    color: Colors.textLight,
    marginLeft: Spacing.sm,
  },
  tipCard: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
    marginTop: 2,
  },
  tipText: {
    ...Typography.caption,
    color: Colors.surface,
    flex: 1,
    lineHeight: 20,
  },
  tipBold: {
    fontWeight: '700',
  },
});
