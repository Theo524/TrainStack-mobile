import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/theme";

export default function StatsScreen() {
  return (
    <View>
      <Text style={styles.eyebrow}>STATS</Text>
      <Text style={styles.title}>Progress</Text>
      <Text style={styles.subtitle}>Your workout progress will appear here.</Text>

      <View style={styles.grid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>workouts</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>minutes</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Later</Text>
        <Text style={styles.cardText}>Weekly workouts, total time, streaks, and exercise progress.</Text>
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

  grid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },

  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },

  statNumber: {
    fontSize: 36,
    fontWeight: "900",
    color: colors.green,
  },

  statLabel: {
    color: colors.muted,
    fontWeight: "800",
    marginTop: 4,
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
});