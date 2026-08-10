import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/theme";

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatFinishedDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function StatsScreen({ completedWorkouts }) {
  const totalWorkouts = completedWorkouts.length;

  const totalCompletedExercises = completedWorkouts.reduce(
    (sum, workout) => sum + workout.completedExercises,
    0
  );

  const totalExercises = completedWorkouts.reduce(
    (sum, workout) => sum + workout.totalExercises,
    0
  );

  const completionPercentage =
    totalExercises === 0
      ? 0
      : Math.round((totalCompletedExercises / totalExercises) * 100);

  const latestWorkout = completedWorkouts[0];

  return (
    <View>
      <Text style={styles.eyebrow}>STATS</Text>
      <Text style={styles.title}>Progress</Text>
      <Text style={styles.subtitle}>
        Stats are based on completed workouts and checked exercises.
      </Text>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalWorkouts}</Text>
          <Text style={styles.statLabel}>Workouts finished</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalCompletedExercises}</Text>
          <Text style={styles.statLabel}>Exercises done</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{completionPercentage}%</Text>
          <Text style={styles.statLabel}>Completion rate</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {latestWorkout ? latestWorkout.name : "—"}
          </Text>
          <Text style={styles.statLabel}>Latest workout</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Workout history</Text>

        {completedWorkouts.length === 0 ? (
          <Text style={styles.emptyText}>
            No completed workouts yet. Start a workout from Today, tick off some
            exercises, then press Finish workout.
          </Text>
        ) : (
          completedWorkouts.map((workout) => (
            <View key={workout.id} style={styles.historyItem}>
              <View style={styles.historyTopRow}>
                <Text style={styles.historyName}>{workout.name}</Text>
                <Text style={styles.historyDate}>
                  {formatFinishedDate(workout.finishedAt)}
                </Text>
              </View>

              <Text style={styles.historyMeta}>
                {workout.completedExercises}/{workout.totalExercises} exercises
                completed
              </Text>

              <Text style={styles.historyTimer}>
                Optional timer:{" "}
                {workout.optionalTimerSeconds > 0
                  ? formatTime(workout.optionalTimerSeconds)
                  : "not used"}
              </Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Next upgrade</Text>
        <Text style={styles.cardText}>
          Next we can save this history to your phone, so stats stay even after
          closing the app.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#4d6b58",
    marginBottom: 6,
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    color: colors.text,
  },

  subtitle: {
    marginTop: 5,
    fontSize: 15,
    color: colors.muted,
    marginBottom: 18,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 18,
  },

  statCard: {
    width: "48%",
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },

  statValue: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.green,
  },

  statLabel: {
    marginTop: 5,
    fontSize: 13,
    fontWeight: "800",
    color: colors.muted,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: 26,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 12,
  },

  cardText: {
    fontSize: 15,
    color: colors.muted,
    lineHeight: 22,
  },

  emptyText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },

  historyItem: {
    borderTopWidth: 1,
    borderTopColor: "#eee8da",
    paddingTop: 14,
    paddingBottom: 4,
    marginTop: 8,
  },

  historyTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  historyName: {
    flex: 1,
    fontSize: 17,
    fontWeight: "900",
    color: colors.text,
  },

  historyDate: {
    fontSize: 13,
    fontWeight: "900",
    color: colors.green,
  },

  historyMeta: {
    marginTop: 7,
    fontSize: 14,
    color: colors.muted,
    lineHeight: 20,
  },

  historyTimer: {
    marginTop: 3,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 20,
  },
});