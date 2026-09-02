import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../styles/theme";

export default function MoreScreen({
  plannedWorkoutsCount,
  completedWorkoutsCount,
  workoutTemplatesCount,
  onResetPlannedWorkouts,
  onResetCompletedWorkouts,
  onResetWorkoutTemplates,
  onResetAllData,
}) {
  function confirmResetPlanned() {
    Alert.alert(
      "Reset planned workouts?",
      "This will delete all planned workouts. Your completed history and templates will stay.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: onResetPlannedWorkouts,
        },
      ]
    );
  }

  function confirmResetCompleted() {
    Alert.alert(
      "Reset completed history?",
      "This will delete your completed workout history. Your planned workouts and templates will stay.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: onResetCompletedWorkouts,
        },
      ]
    );
  }

  function confirmResetTemplates() {
    Alert.alert(
      "Reset templates?",
      "This will delete all saved workout templates. Your planned workouts and history will stay.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: onResetWorkoutTemplates,
        },
      ]
    );
  }

  function confirmResetAll() {
    Alert.alert(
      "Reset all TrainStack data?",
      "This will delete planned workouts, completed history, and workout templates. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset everything",
          style: "destructive",
          onPress: onResetAllData,
        },
      ]
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.kicker}>More</Text>
        <Text style={styles.title}>App settings</Text>
        <Text style={styles.subtitle}>
          Manage your TrainStack data and see what is included in this version.
        </Text>
      </View>

      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>TrainStack</Text>
        <Text style={styles.heroTitle}>v0.2.0 in progress</Text>
        <Text style={styles.heroText}>
          A mobile workout planner for building sessions, training with timers,
          and tracking progress.
        </Text>
      </View>

      <View style={styles.statGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{plannedWorkoutsCount}</Text>
          <Text style={styles.statLabel}>planned</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{completedWorkoutsCount}</Text>
          <Text style={styles.statLabel}>completed</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{workoutTemplatesCount}</Text>
          <Text style={styles.statLabel}>templates</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Current features</Text>

        <Text style={styles.featureText}>✓ Workout planner</Text>
        <Text style={styles.featureText}>✓ Exercise library</Text>
        <Text style={styles.featureText}>✓ Add exercises from library</Text>
        <Text style={styles.featureText}>✓ Workout templates</Text>
        <Text style={styles.featureText}>✓ Train screen timers</Text>
        <Text style={styles.featureText}>✓ Workout history and stats</Text>
        <Text style={styles.featureText}>✓ Phone storage with AsyncStorage</Text>
      </View>

      <View style={styles.dangerCard}>
        <Text style={styles.sectionTitle}>Reset data</Text>
        <Text style={styles.dangerText}>
          These buttons delete saved data from this phone. Use them carefully.
        </Text>

        <Pressable style={styles.resetButton} onPress={confirmResetPlanned}>
          <Text style={styles.resetButtonText}>Reset planned workouts</Text>
        </Pressable>

        <Pressable style={styles.resetButton} onPress={confirmResetCompleted}>
          <Text style={styles.resetButtonText}>Reset completed history</Text>
        </Pressable>

        <Pressable style={styles.resetButton} onPress={confirmResetTemplates}>
          <Text style={styles.resetButtonText}>Reset templates</Text>
        </Pressable>

        <Pressable style={styles.resetAllButton} onPress={confirmResetAll}>
          <Text style={styles.resetAllButtonText}>Reset all app data</Text>
        </Pressable>
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

  heroCard: {
    backgroundColor: colors.green,
    borderRadius: 24,
    padding: 20,
    marginBottom: 14,
  },

  heroLabel: {
    color: colors.greenLight,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
  },

  heroTitle: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 8,
  },

  heroText: {
    color: colors.greenLight,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 21,
  },

  statGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },

  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 14,
    alignItems: "center",
  },

  statValue: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 11,
    fontWeight: "900",
    color: colors.muted,
    textTransform: "uppercase",
  },

  infoCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 10,
  },

  featureText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
    lineHeight: 24,
  },

  dangerCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 18,
    marginBottom: 24,
  },

  dangerText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.muted,
    lineHeight: 21,
    marginBottom: 14,
  },

  resetButton: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
  },

  resetButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
  },

  resetAllButton: {
    backgroundColor: "#b42318",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },

  resetAllButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
  },
});