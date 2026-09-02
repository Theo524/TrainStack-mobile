import React, { useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { exerciseCategories, exerciseLibrary } from "../data/exerciseLibrary";
import { colors } from "../styles/theme";

const customCategoryOptions = exerciseCategories.filter(
  (category) => category !== "All"
);

export default function LibraryScreen({
  customExercises = [],
  onAddCustomExercise,
  onDeleteCustomExercise,
}) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchText, setSearchText] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customCategory, setCustomCategory] = useState("Push");
  const [customTarget, setCustomTarget] = useState("");
  const [customDescription, setCustomDescription] = useState("");

  const allExercises = useMemo(() => {
    return [
      ...customExercises.map((exercise) => ({
        ...exercise,
        isCustom: true,
      })),
      ...exerciseLibrary.map((exercise) => ({
        ...exercise,
        isCustom: false,
      })),
    ];
  }, [customExercises]);

  const filteredExercises = useMemo(() => {
    const cleanSearchText = searchText.trim().toLowerCase();

    return allExercises.filter((exercise) => {
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
  }, [allExercises, selectedCategory, searchText]);

  function resetCustomForm() {
    setCustomName("");
    setCustomCategory("Push");
    setCustomTarget("");
    setCustomDescription("");
  }

  function saveCustomExercise() {
    const cleanName = customName.trim();
    const cleanTarget = customTarget.trim();
    const cleanDescription = customDescription.trim();

    if (!cleanName) {
      Alert.alert("Missing name", "Type an exercise name first.");
      return;
    }

    const newExercise = {
      id: `custom-${Date.now()}`,
      name: cleanName,
      category: customCategory,
      level: "Custom",
      target: cleanTarget || "Custom target",
      description:
        cleanDescription || "Custom exercise added to your TrainStack library.",
      createdAt: new Date().toISOString(),
    };

    onAddCustomExercise(newExercise);
    resetCustomForm();
    setShowAddForm(false);

    Alert.alert("Exercise added", `"${newExercise.name}" was added.`);
  }

  function confirmDeleteCustomExercise(exercise) {
    Alert.alert(
      "Delete custom exercise?",
      `Delete "${exercise.name}" from your library?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDeleteCustomExercise(exercise.id),
        },
      ]
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Exercise Library</Text>
        <Text style={styles.title}>Build smarter workouts</Text>
        <Text style={styles.subtitle}>
          Browse built-in exercises or add your own custom movements.
        </Text>
      </View>

      <Pressable
        style={styles.addCustomToggleButton}
        onPress={() => setShowAddForm((currentValue) => !currentValue)}
      >
        <Text style={styles.addCustomToggleButtonText}>
          {showAddForm ? "Hide custom exercise form" : "Add custom exercise"}
        </Text>
      </Pressable>

      {showAddForm && (
        <View style={styles.customFormCard}>
          <Text style={styles.formTitle}>New custom exercise</Text>
          <Text style={styles.formSubtitle}>
            Add exercises that are not already in the built-in library.
          </Text>

          <Text style={styles.label}>Exercise name</Text>
          <TextInput
            style={styles.input}
            value={customName}
            onChangeText={setCustomName}
            placeholder="Example: Muscle-ups"
            placeholderTextColor={colors.muted}
          />

          <Text style={styles.label}>Category</Text>
          <View style={styles.customCategoryWrap}>
            {customCategoryOptions.map((category) => {
              const isActive = customCategory === category;

              return (
                <Pressable
                  key={category}
                  style={
                    isActive
                      ? styles.customCategoryChipActive
                      : styles.customCategoryChip
                  }
                  onPress={() => setCustomCategory(category)}
                >
                  <Text
                    style={
                      isActive
                        ? styles.customCategoryChipTextActive
                        : styles.customCategoryChipText
                    }
                  >
                    {category}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Target</Text>
          <TextInput
            style={styles.input}
            value={customTarget}
            onChangeText={setCustomTarget}
            placeholder="Example: Back, biceps, explosiveness"
            placeholderTextColor={colors.muted}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.descriptionInput}
            value={customDescription}
            onChangeText={setCustomDescription}
            placeholder="Quick note on how to do it..."
            placeholderTextColor={colors.muted}
            multiline
            textAlignVertical="top"
          />

          <View style={styles.formButtonRow}>
            <Pressable style={styles.cancelButton} onPress={resetCustomForm}>
              <Text style={styles.cancelButtonText}>Clear</Text>
            </Pressable>

            <Pressable style={styles.saveCustomButton} onPress={saveCustomExercise}>
              <Text style={styles.saveCustomButtonText}>Save exercise</Text>
            </Pressable>
          </View>
        </View>
      )}

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
                  <Text style={styles.levelBadgeText}>
                    {exercise.isCustom ? "Custom" : exercise.level}
                  </Text>
                </View>
              </View>

              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{exercise.category}</Text>
              </View>

              <Text style={styles.exerciseDescription}>
                {exercise.description}
              </Text>

              {exercise.isCustom && (
                <Pressable
                  style={styles.deleteCustomButton}
                  onPress={() => confirmDeleteCustomExercise(exercise)}
                >
                  <Text style={styles.deleteCustomButtonText}>
                    Delete custom exercise
                  </Text>
                </Pressable>
              )}
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

  addCustomToggleButton: {
    backgroundColor: colors.green,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 14,
  },

  addCustomToggleButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
  },

  customFormCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
  },

  formTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 4,
  },

  formSubtitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.muted,
    lineHeight: 19,
    marginBottom: 14,
  },

  label: {
    fontSize: 13,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 8,
  },

  input: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 14,
  },

  descriptionInput: {
    minHeight: 90,
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    lineHeight: 21,
    marginBottom: 14,
  },

  customCategoryWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },

  customCategoryChip: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },

  customCategoryChipActive: {
    backgroundColor: colors.green,
    borderWidth: 1,
    borderColor: colors.green,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },

  customCategoryChipText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "900",
  },

  customCategoryChipTextActive: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "900",
  },

  formButtonRow: {
    flexDirection: "row",
    gap: 10,
  },

  cancelButton: {
    flex: 1,
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: "center",
  },

  cancelButtonText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "900",
  },

  saveCustomButton: {
    flex: 1,
    backgroundColor: colors.green,
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: "center",
  },

  saveCustomButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
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

  deleteCustomButton: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 12,
  },

  deleteCustomButtonText: {
    color: "#b42318",
    fontSize: 13,
    fontWeight: "900",
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