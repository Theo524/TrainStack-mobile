import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { getDailyMotivationalQuote } from "../data/motivationalQuotes";
import { colors } from "../styles/theme";

function getTodayShortDay() {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "short",
  });
}

function getTodayFullDate() {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function getExerciseCount(workout) {
  if (!workout?.exercises) return 0;

  return workout.exercises
    .split("\n")
    .map((exercise) => exercise.trim())
    .filter((exercise) => exercise.length > 0).length;
}

export default function TodayScreen({
  plannedWorkouts,
  onGoToPlan,
  onGoToMore,
  onStartTraining,
}) {
  const todayShortDay = getTodayShortDay();
  const todayFullDate = getTodayFullDate();
  const dailyQuote = getDailyMotivationalQuote();

  const todaysWorkouts = plannedWorkouts.filter(
    (workout) => workout.day === todayShortDay
  );

  const firstWorkout = todaysWorkouts[0];

  return (
    <View style={styles.screen}>
      <View style={styles.headerTopRow}>
        <View style={styles.headerTextWrap}>
          <Text style={styles.kicker}>Today</Text>
          <Text style={styles.title}>Today's workout</Text>
          <Text style={styles.dateText}>{todayFullDate}</Text>
        </View>

        <Pressable style={styles.settingsButton} onPress={onGoToMore}>
          <Text style={styles.settingsButtonText}>Settings</Text>
        </Pressable>
      </View>

      <View style={styles.quoteCard}>
        <Text style={styles.quoteLabel}>Daily focus</Text>
        <Text style={styles.quoteText}>“{dailyQuote}”</Text>
      </View>

      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>Today's focus</Text>

        {firstWorkout ? (
          <>
            <Text style={styles.heroTitle}>{firstWorkout.name}</Text>
            <Text style={styles.heroText}>
              {firstWorkout.focus || "Custom"} • {getExerciseCount(firstWorkout)}{" "}
              exercise{getExerciseCount(firstWorkout) === 1 ? "" : "s"}
            </Text>

            <Pressable
              style={styles.heroButton}
              onPress={() => onStartTraining(firstWorkout)}
            >
              <Text style={styles.heroButtonText}>Start training</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.heroTitle}>No workout planned</Text>
            <Text style={styles.heroText}>
              Plan a workout for today and it will appear here.
            </Text>

            <Pressable style={styles.heroButton} onPress={onGoToPlan}>
              <Text style={styles.heroButtonText}>Plan workout</Text>
            </Pressable>
          </>
        )}
      </View>

      <View style={styles.sectionTopRow}>
        <Text style={styles.sectionTitle}>Today's workouts</Text>

        <Pressable onPress={onGoToPlan}>
          <Text style={styles.sectionAction}>Plan</Text>
        </Pressable>
      </View>

      {todaysWorkouts.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Nothing scheduled today</Text>
          <Text style={styles.emptyText}>
            Go to Plan and create a workout for {todayShortDay}.
          </Text>
        </View>
      ) : (
        <View style={styles.workoutList}>
          {todaysWorkouts.map((workout) => (
            <View key={workout.id} style={styles.workoutCard}>
              <View style={styles.workoutTopRow}>
                <View style={styles.workoutTitleWrap}>
                  <Text style={styles.workoutDay}>{workout.day}</Text>
                  <Text style={styles.workoutName}>{workout.name}</Text>
                  <Text style={styles.workoutFocus}>
                    {workout.focus || "Custom"} workout •{" "}
                    {getExerciseCount(workout)} exercise
                    {getExerciseCount(workout) === 1 ? "" : "s"}
                  </Text>
                </View>
              </View>

              <Text style={styles.workoutExercises}>{workout.exercises}</Text>

              <Pressable
                style={styles.startButton}
                onPress={() => onStartTraining(workout)}
              >
                <Text style={styles.startButtonText}>Start this workout</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 12,
  },

  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14,
  },

  headerTextWrap: {
    flex: 1,
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
    marginBottom: 6,
  },

  dateText: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.muted,
    lineHeight: 22,
  },

  settingsButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
    alignSelf: "flex-start",
  },

  settingsButtonText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "900",
  },

  quoteCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
  },

  quoteLabel: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
  },

  quoteText: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 24,
  },

  heroCard: {
    backgroundColor: colors.green,
    borderRadius: 28,
    padding: 22,
    marginBottom: 24,
  },

  heroLabel: {
    color: colors.greenLight,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },

  heroTitle: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 8,
  },

  heroText: {
    color: colors.greenLight,
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 21,
    marginBottom: 16,
  },

  heroButton: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },

  heroButtonText: {
    color: colors.green,
    fontSize: 15,
    fontWeight: "900",
  },

  sectionTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.text,
  },

  sectionAction: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.accent,
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

  workoutList: {
    gap: 12,
  },

  workoutCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 16,
  },

  workoutTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 10,
  },

  workoutTitleWrap: {
    flex: 1,
  },

  workoutDay: {
    fontSize: 12,
    fontWeight: "900",
    color: colors.accent,
    marginBottom: 4,
  },

  workoutName: {
    fontSize: 19,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 4,
  },

  workoutFocus: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.muted,
    lineHeight: 19,
  },

  workoutExercises: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    lineHeight: 22,
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },

  startButton: {
    backgroundColor: colors.green,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },

  startButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
  },
});