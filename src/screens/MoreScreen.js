import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/theme";

export default function MoreScreen() {
  return (
    <View>
      <Text style={styles.eyebrow}>MORE</Text>
      <Text style={styles.title}>More</Text>
      <Text style={styles.subtitle}>Settings and future modules will go here.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Future sections</Text>
        <Text style={styles.cardText}>Settings</Text>
        <Text style={styles.cardText}>Themes</Text>
        <Text style={styles.cardText}>AI coach</Text>
        <Text style={styles.cardText}>Notes</Text>
        <Text style={styles.cardText}>Meals</Text>
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
    fontSize: 16,
    color: colors.muted,
    marginBottom: 10,
    fontWeight: "700",
  },
});