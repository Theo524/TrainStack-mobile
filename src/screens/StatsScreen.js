import React, { useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../styles/theme";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getWorkoutDate(workout) {
  const possibleDate =
    workout.completedAt || workout.finishedAt || workout.updatedAt || workout.createdAt;

  if (possibleDate) {
    const date = new Date(possibleDate);

    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  const fallbackDate = new Date(Number(workout.id));

  if (!Number.isNaN(fallbackDate.getTime())) {
    return fallbackDate;
  }

  return new Date();
}

function getExerciseLines(workout) {
  if (!workout.exercises) return [];

  return workout.exercises
    .split("\n")
    .map((exercise) => exercise.trim())
    .filter((exercise) => exercise.length > 0);
}

function getCompletedExerciseCount(workout) {
  if (Array.isArray(workout.completedExercises)) {
    return workout.completedExercises.length;
  }

  return getExerciseLines(workout).length;
}

function getTotalExerciseCount(workout) {
  return getExerciseLines(workout).length;
}

function formatDate(date) {
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatTimer(seconds) {
  if (!seconds || seconds <= 0) return null;

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes <= 0) {
    return `${remainingSeconds}s`;
  }

  return `${minutes}m ${remainingSeconds}s`;
}

function getStartOfWeek(date) {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  startOfWeek.setDate(startOfWeek.getDate() + diff);
  startOfWeek.setHours(0, 0, 0, 0);

  return startOfWeek;
}

export default function StatsScreen({
  completedWorkouts,
  onDeleteCompletedWorkout,
}) {
  const [openMenuWorkoutId, setOpenMenuWorkoutId] = useState(null);

  const stats = useMemo(() => {
    const now = new Date();
    const startOfWeek = getStartOfWeek(now);

    const workoutsThisWeek = completedWorkouts.filter((workout) => {
      const workoutDate = getWorkoutDate(workout);
      return workoutDate >= startOfWeek && workoutDate <= now;
    });

    const totalCompletedWorkouts = completedWorkouts.length;

    const totalExercisesCompleted = completedWorkouts.reduce(
      (total, workout) => total + getCompletedExerciseCount(workout),
      0
    );

    const totalExercisesPlanned = completedWorkouts.reduce(
      (total, workout) => total + getTotalExerciseCount(workout),
      0
    );

    const completionRate =
      totalExercisesPlanned === 0
        ? 0
        : Math.round((totalExercisesCompleted / totalExercisesPlanned) * 100);

    const focusCounts = {};
    const dayCounts = {};

    completedWorkouts.forEach((workout) => {
      const focus = workout.focus || "Custom";
      const workoutDate = getWorkoutDate(workout);
      const dayName = dayNames[workoutDate.getDay()];

      focusCounts[focus] = (focusCounts[focus] || 0) + 1;
      dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;
    });

    const mostCommonFocus =
      Object.entries(focusCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "None yet";

    const bestTrainingDay =
      Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "None yet";

    const latestWorkout = completedWorkouts[0];

    return {
      workoutsThisWeek: workoutsThisWeek.length,
      totalCompletedWorkouts,
      totalExercisesCompleted,
      completionRate,
      mostCommonFocus,
      bestTrainingDay,
      latestWorkoutName: latestWorkout?.name || "None yet",
    };
  }, [completedWorkouts]);

  function toggleMenu(workoutId) {
    setOpenMenuWorkoutId((currentOpenMenuId) =>
      currentOpenMenuId === workoutId ? null : workoutId
    );
  }

  function deleteCompletedWorkout(workout) {
    setOpenMenuWorkoutId(null);

    Alert.alert(
      "Delete workout?",
      `Delete "${workout.name}" from your history?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDeleteCompletedWorkout(workout.id),
        },
      ]
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Stats</Text>
        <Text style={styles.title}>Track your progress</Text>
        <Text style={styles.subtitle}>
          See your completed workouts, exercise totals, and training patterns.
        </Text>
      </View>

      <View style={styles.statGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>This week</Text>
          <Text style={styles.statValue}>{stats.workoutsThisWeek}</Text>
          <Text style={styles.statHint}>workouts finished</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>All time</Text>
          <Text style={styles.statValue}>{stats.totalCompletedWorkouts}</Text>
          <Text style={styles.statHint}>total workouts</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Exercises</Text>
          <Text style={styles.statValue}>{stats.totalExercisesCompleted}</Text>
          <Text style={styles.statHint}>completed reps/sets lines</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Completion</Text>
          <Text style={styles.statValue}>{stats.completionRate}%</Text>
          <Text style={styles.statHint}>checked off</Text>
        </View>
      </View>

      <View style={styles.insightCard}>
        <Text style={styles.insightTitle}>Training insights</Text>

        <View style={styles.insightRow}>
          <Text style={styles.insightLabel}>Most trained focus</Text>
          <Text style={styles.insightValue}>{stats.mostCommonFocus}</Text>
        </View>

        <View style={styles.insightRow}>
          <Text style={styles.insightLabel}>Best training day</Text>
          <Text style={styles.insightValue}>{stats.bestTrainingDay}</Text>
        </View>

        <View style={styles.insightRow}>
          <Text style={styles.insightLabel}>Latest workout</Text>
          <Text style={styles.insightValue}>{stats.latestWorkoutName}</Text>
        </View>
      </View>

      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Workout history</Text>

        {completedWorkouts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No workouts finished yet</Text>
            <Text style={styles.emptyText}>
              Finish a workout from the Train tab and your progress will appear
              here.
            </Text>
          </View>
        ) : (
          <View style={styles.historyList}>
            {completedWorkouts.map((workout) => {
              const workoutDate = getWorkoutDate(workout);
              const completedCount = getCompletedExerciseCount(workout);
              const totalCount = getTotalExerciseCount(workout);
              const timerText = formatTimer(workout.optionalTimerSeconds);

              return (
                <View key={workout.id} style={styles.historyCard}>
                  <View style={styles.historyTopRow}>
                    <View style={styles.historyTitleWrap}>
                      <Text style={styles.historyDate}>
                        {formatDate(workoutDate)}
                      </Text>
                      <Text style={styles.historyName}>{workout.name}</Text>
                      <Text style={styles.historyFocus}>
                        {workout.focus || "Custom"} workout
                      </Text>
                    </View>

                    <View style={styles.menuWrap}>
                      <Pressable
                        style={styles.menuButton}
                        onPress={() => toggleMenu(workout.id)}
                      >
                        <Text style={styles.menuButtonText}>•••</Text>
                      </Pressable>

                      {openMenuWorkoutId === workout.id && (
                        <View style={styles.menu}>
                          <Pressable
                            style={styles.menuItem}
                            onPress={() => deleteCompletedWorkout(workout)}
                          >
                            <Text style={styles.menuItemTextDelete}>
                              Delete
                            </Text>
                          </Pressable>
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={styles.historyStatsRow}>
                    <View style={styles.historyMiniStat}>
                      <Text style={styles.historyMiniValue}>
                        {completedCount}/{totalCount}
                      </Text>
                      <Text style={styles.historyMiniLabel}>exercises</Text>
                    </View>

                    <View style={styles.historyMiniStat}>
                      <Text style={styles.historyMiniValue}>
                        {timerText || "—"}
                      </Text>
                      <Text style={styles.historyMiniLabel}>timer</Text>
                    </View>
                  </View>

                  <Text style={styles.historyExercises}>{workout.exercises}</Text>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 12,
  },

  header: {
    marginBottom: 18,
  },

  kicker: {
    fontSize: 13,
    fontWeight: "900",
    color: colors.accent,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.muted,
    lineHeight: 22,
  },

  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 14,
  },

  statCard: {
    width: "48%",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 16,
  },

  statLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: colors.accent,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },

  statValue: {
    fontSize: 30,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 4,
  },

  statHint: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.muted,
    lineHeight: 17,
  },

  insightCard: {
    backgroundColor: colors.green,
    borderRadius: 24,
    padding: 18,
    marginBottom: 24,
  },

  insightTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#ffffff",
    marginBottom: 12,
  },

  insightRow: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
  },

  insightLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.greenLight,
    marginBottom: 4,
  },

  insightValue: {
    fontSize: 16,
    fontWeight: "900",
    color: "#ffffff",
  },

  historySection: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 12,
  },

  emptyCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 20,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.muted,
    textAlign: "center",
    lineHeight: 20,
  },

  historyList: {
    gap: 12,
  },

  historyCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 16,
  },

  historyTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },

  historyTitleWrap: {
    flex: 1,
  },

  historyDate: {
    fontSize: 12,
    fontWeight: "900",
    color: colors.accent,
    marginBottom: 4,
  },

  historyName: {
    fontSize: 19,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 4,
  },

  historyFocus: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.muted,
  },

  historyStatsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },

  historyMiniStat: {
    flex: 1,
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 12,
  },

  historyMiniValue: {
    fontSize: 17,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 2,
  },

  historyMiniLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.muted,
  },

  historyExercises: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    lineHeight: 22,
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 12,
  },

  menuWrap: {
    position: "relative",
    alignItems: "flex-end",
  },

  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  menuButtonText: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: "900",
    marginTop: -5,
  },

  menu: {
    position: "absolute",
    top: 42,
    right: 0,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 6,
    width: 120,
    zIndex: 10,
  },

  menuItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  menuItemTextDelete: {
    fontSize: 14,
    fontWeight: "900",
    color: "#b42318",
  },
});