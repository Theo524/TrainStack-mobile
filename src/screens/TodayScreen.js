import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/theme";

export default function TodayScreen() {
  return (
    <View>
      <Text style={styles.eyebrow}>TODAY</Text>
      <Text style={styles.title}>Today’s Workout</Text>
      <Text style={styles.subtitle}>Your scheduled workout will appear here.</Text>

      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>No workout scheduled yet</Text>
        <Text style={styles.heroText}>
          Later, this screen will show your workout for today, the next exercise,
          and a quick button to start training.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Planned flow</Text>
        <Text style={styles.cardText}>1. Check today’s workout</Text>
        <Text style={styles.cardText}>2. Start workout mode</Text>
        <Text style={styles.cardText}>3. Use stopwatch and rest timer</Text>
        <Text style={styles.cardText}>4. Save completed workout</Text>
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

  heroTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 10,
  },

  heroText: {
    color: colors.greenLight,
    fontSize: 15,
    lineHeight: 22,
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
    marginBottom: 8,
  },
});