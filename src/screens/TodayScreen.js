import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/theme";

function getTodayShortDay() {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "short",
  });
}

function getFullDateLabel() {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default function TodayScreen({
  plannedWorkouts,
  onGoToPlan,
  onStartTraining,
}) {
  const todayShortDay = getTodayShortDay();

  const todaysWorkouts = plannedWorkouts.filter(
    (workout) => workout.day === todayShortDay
  );

  const firstWorkout = todaysWorkouts[0];

  return (
    <View>
      <Text style={styles.eyebrow}>TODAY</Text>
      <Text style={styles.title}>Today’s Workout</Text>
      <Text style={styles.subtitle}>{getFullDateLabel()}</Text>

      {todaysWorkouts.length === 0 ? (
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>No workout scheduled</Text>
          <Text style={styles.heroText}>
            You do not have a workout planned for {todayShortDay}. Add one in
            the Plan tab and it will appear here.
          </Text>

          <Pressable style={styles.heroButton} onPress={onGoToPlan}>
            <Text style={styles.heroButtonText}>Plan a workout</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.heroCard}>
          <Text style={styles.heroSmall}>Scheduled for {todayShortDay}</Text>
          <Text style={styles.heroTitle}>
            {todaysWorkouts.length === 1
              ? firstWorkout.name
              : `${todaysWorkouts.length} workouts today`}
          </Text>
          <Text style={styles.heroText}>
            Start training when you are ready. The Train tab will load this
            workout and keep the stopwatch/rest timer available.
          </Text>

          <Pressable
            style={styles.heroButton}
            onPress={() => onStartTraining(firstWorkout)}
          >
            <Text style={styles.heroButtonText}>Start training</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today’s plan</Text>

        {todaysWorkouts.length === 0 ? (
          <Text style={styles.cardText}>
            Nothing planned yet. Go to Plan and create a workout for{" "}
            {todayShortDay}.
          </Text>
        ) : (
          todaysWorkouts.map((workout) => (
            <View key={workout.id} style={styles.workoutItem}>
              <View style={styles.workoutTopRow}>
                <Text style={styles.workoutName}>{workout.name}</Text>

                <View style={styles.dayBadge}>
                  <Text style={styles.dayBadgeText}>{workout.day}</Text>
                </View>
              </View>

              {workout.exercises ? (
                <Text style={styles.workoutExercises}>{workout.exercises}</Text>
              ) : (
                <Text style={styles.workoutExercisesMuted}>
                  No exercises added yet.
                </Text>
              )}

              <Pressable
                style={styles.smallStartButton}
                onPress={() => onStartTraining(workout)}
              >
                <Text style={styles.smallStartButtonText}>Start this workout</Text>
              </Pressable>
            </View>
          ))
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>How this screen works</Text>
        <Text style={styles.cardText}>
          Plan creates workouts for days of the week. Today checks the current
          day and shows matching workouts here. Starting a workout sends it to
          the Train screen.
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

  heroCard: {
    backgroundColor: colors.green,
    borderRadius: 28,
    padding: 24,
    marginBottom: 18,
  },

  heroSmall: {
    color: colors.greenLight,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 8,
  },

  heroTitle: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 10,
  },

  heroText: {
    color: colors.greenLight,
    fontSize: 15,
    lineHeight: 22,
  },

  heroButton: {
    marginTop: 18,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },

  heroButtonText: {
    color: colors.green,
    fontWeight: "900",
    fontSize: 15,
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

  workoutItem: {
    borderTopWidth: 1,
    borderTopColor: "#eee8da",
    paddingTop: 14,
    paddingBottom: 4,
    marginTop: 8,
  },

  workoutTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  workoutName: {
    fontSize: 17,
    fontWeight: "900",
    color: colors.text,
    flex: 1,
    marginRight: 10,
  },

  dayBadge: {
    backgroundColor: colors.greenLight,
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },

  dayBadgeText: {
    color: colors.green,
    fontWeight: "900",
    fontSize: 12,
  },

  workoutExercises: {
    marginTop: 8,
    color: "#3e3b34",
    fontSize: 14,
    lineHeight: 20,
  },

  workoutExercisesMuted: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 14,
    fontStyle: "italic",
  },

  smallStartButton: {
    marginTop: 12,
    backgroundColor: colors.green,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
  },

  smallStartButtonText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 14,
  },
});