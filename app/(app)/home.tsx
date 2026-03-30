import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/Colors';
import { supabase } from '@/lib/supabase';
import { getUserProfile, getUserStats } from '@/lib/api';
import { Button } from '@/components/ui/Button';

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const profile = await getUserProfile();
      setUser(profile);

      const userStats = await getUserStats();
      setStats(userStats);
    } catch (error: any) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          router.replace('/');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back!</Text>
          <Text style={styles.userName}>{user?.full_name || 'Student'}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats?.totalAnswered || 0}</Text>
          <Text style={styles.statLabel}>Questions Answered</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats?.accuracy || 0}%</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats?.sessionsCompleted || 0}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
      </View>

      {/* Main Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>What would you like to do?</Text>

        {/* Start Practice Session */}
        <TouchableOpacity
          style={[styles.actionCard, styles.primaryCard]}
          onPress={() => router.push('/(app)/practice')}
        >
          <View style={styles.actionIcon}>
            <Text style={styles.actionEmoji}>🎯</Text>
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Start Practice Session</Text>
            <Text style={styles.actionDescription}>
              Answer questions and track your progress
            </Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>

        {/* Browse Topics */}
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('/(app)/topics')}
        >
          <View style={styles.actionIcon}>
            <Text style={styles.actionEmoji}>📚</Text>
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Browse by Topic</Text>
            <Text style={styles.actionDescription}>
              Explore all 10 CFA Level 1 topic areas
            </Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>

        {/* Mock Exams - Coming soon */}
        <TouchableOpacity
          style={[styles.actionCard, styles.disabledCard]}
          disabled
        >
          <View style={styles.actionIcon}>
            <Text style={styles.actionEmoji}>📝</Text>
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Mock Exams</Text>
            <Text style={styles.actionDescription}>Coming soon</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      {stats && stats.totalAnswered > 0 && (
        <View style={styles.progressContainer}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.progressCard}>
            <Text style={styles.progressText}>
              You've answered {stats.totalAnswered} questions with {stats.accuracy}% accuracy.
              Keep it up!
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.xl,
    paddingTop: Spacing.xxl + Spacing.lg,
  },
  greeting: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  userName: {
    ...Typography.h2,
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  logoutButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  logoutText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statNumber: {
    ...Typography.h2,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...Typography.small,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  actionsContainer: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  actionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  primaryCard: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  disabledCard: {
    opacity: 0.5,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  actionEmoji: {
    fontSize: 28,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  actionDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  actionArrow: {
    fontSize: 32,
    color: Colors.textLight,
    marginLeft: Spacing.sm,
  },
  progressContainer: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  progressCard: {
    backgroundColor: Colors.surfaceAlt,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  progressText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
