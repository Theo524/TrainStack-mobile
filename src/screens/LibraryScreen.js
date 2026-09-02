import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { exerciseCategories, exerciseLibrary } from "../data/exerciseLibrary";
import { colors } from "../styles/theme";

export default function LibraryScreen() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchText, setSearchText] = useState("");

  const filteredExercises = useMemo(() => {
    const cleanSearchText = searchText.trim().toLowerCase();

    return exerciseLibrary.filter((exercise) => {
      const matchesCategory =
        selectedCategory === "All" || exercise.category === selectedCategory;

      const matchesSearch =
        cleanSearchText.length === 0 ||
        exercise.name.toLowerCase().includes(cleanSearchText) ||
        exercise.category.toLowerCase().includes(cleanSearchText) ||
        exercise.target.toLowerCase().includes(cleanSearchText) ||
        exercise.description.toLowerCase().includes(cleanSearchText);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchText]);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Exercise Library</Text>
        <Text style={styles.title}>Build smarter workouts</Text>
        <Text style={styles.subtitle}>
          Browse exercises by training style, skill goal, or body focus.
        </Text>
      </View>

      <TextInput
        style={styles.searchInput}
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search exercises..."
        placeholderTextColor={colors.muted}
      />

      <View style={styles.categoryWrap}>
        {exerciseCategories.map((category) => {
          const isActive = selectedCategory === category;

          return (
            <Pressable
              key={category}
              style={isActive ? styles.categoryChipActive : styles.categoryChip}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={
                  isActive ? styles.categoryChipTextActive : styles.categoryChipText
                }
              >
                {category}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>
          Showing {filteredExercises.length} exercise
          {filteredExercises.length === 1 ? "" : "s"}
        </Text>

        {(selectedCategory !== "All" || searchText.trim().length > 0) && (
          <Pressable
            onPress={() => {
              setSelectedCategory("All");
              setSearchText("");
            }}
          >
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>
        )}
      </View>

      {filteredExercises.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No exercises found</Text>
          <Text style={styles.emptyText}>
            Try a different category or search word.
          </Text>
        </View>
      ) : (
        <View style={styles.exerciseList}>
          {filteredExercises.map((exercise) => (
            <View key={exercise.id} style={styles.exerciseCard}>
              <View style={styles.exerciseTopRow}>
                <View style={styles.exerciseTitleWrap}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseTarget}>{exercise.target}</Text>
                </View>

                <View style={styles.levelBadge}>
                  <Text style={styles.levelBadgeText}>{exercise.level}</Text>
                </View>
              </View>

              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{exercise.category}</Text>
              </View>

              <Text style={styles.exerciseDescription}>
                {exercise.description}
              </Text>
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

  searchInput: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 14,
  },

  categoryWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },

  categoryChip: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 999,
  },

  categoryChipActive: {
    backgroundColor: colors.green,
    borderWidth: 1,
    borderColor: colors.green,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 999,
  },

  categoryChipText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "900",
  },

  categoryChipTextActive: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "900",
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  summaryText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.muted,
  },

  clearText: {
    fontSize: 13,
    fontWeight: "900",
    color: colors.accent,
  },

  exerciseList: {
    gap: 12,
  },

  exerciseCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 16,
  },

  exerciseTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 10,
  },

  exerciseTitleWrap: {
    flex: 1,
  },

  exerciseName: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 4,
  },

  exerciseTarget: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.muted,
    lineHeight: 19,
  },

  levelBadge: {
    backgroundColor: colors.greenLight,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
    alignSelf: "flex-start",
  },

  levelBadgeText: {
    color: colors.green,
    fontSize: 11,
    fontWeight: "900",
  },

  categoryBadge: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: "flex-start",
    marginBottom: 10,
  },

  categoryBadgeText: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: "900",
  },

  exerciseDescription: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    lineHeight: 21,
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
  },
});