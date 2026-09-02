import React, { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  buildWorkoutSuggestion,
  workoutFocusOptions,
} from "../data/workoutSuggestions";
import { exerciseCategories, exerciseLibrary } from "../data/exerciseLibrary";
import { colors } from "../styles/theme";

const dayOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function PlanScreen({
  plannedWorkouts,
  workoutTemplates,
  customExercises = [],
  onAddWorkout,
  onUpdateWorkout,
  onDeleteWorkout,
  onAddWorkoutTemplate,
  onDeleteWorkoutTemplate,
  onScrollToTop,
}) {
  const [workoutName, setWorkoutName] = useState("");
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [exercises, setExercises] = useState("");
  const [focus, setFocus] = useState("Push");
  const [editingWorkoutId, setEditingWorkoutId] = useState(null);
  const [openMenuWorkoutId, setOpenMenuWorkoutId] = useState(null);

  const [showLibraryPicker, setShowLibraryPicker] = useState(false);
  const [libraryCategory, setLibraryCategory] = useState("All");
  const [librarySearchText, setLibrarySearchText] = useState("");

  const [showTemplates, setShowTemplates] = useState(false);

  const allLibraryExercises = useMemo(() => {
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

  const filteredLibraryExercises = useMemo(() => {
    const cleanSearch = librarySearchText.trim().toLowerCase();

    return allLibraryExercises.filter((exercise) => {
      const matchesCategory =
        libraryCategory === "All" || exercise.category === libraryCategory;

      const matchesSearch =
        cleanSearch.length === 0 ||
        exercise.name.toLowerCase().includes(cleanSearch) ||
        exercise.category.toLowerCase().includes(cleanSearch) ||
        exercise.target.toLowerCase().includes(cleanSearch) ||
        exercise.description.toLowerCase().includes(cleanSearch);

      return matchesCategory && matchesSearch;
    });
  }, [allLibraryExercises, libraryCategory, librarySearchText]);

  function resetForm() {
    setWorkoutName("");
    setSelectedDay("Mon");
    setExercises("");
    setFocus("Push");
    setEditingWorkoutId(null);
    setOpenMenuWorkoutId(null);
  }

  function saveWorkout() {
    const cleanWorkoutName = workoutName.trim();
    const cleanExercises = exercises.trim();

    if (!cleanWorkoutName && !cleanExercises) {
      Alert.alert(
        "Empty workout",
        "Add a workout name or at least one exercise first."
      );
      return;
    }

    const workoutToSave = {
      id: editingWorkoutId || Date.now().toString(),
      name: cleanWorkoutName || `${focus} Session`,
      day: selectedDay,
      exercises: cleanExercises,
      focus,
      updatedAt: new Date().toISOString(),
      createdAt: editingWorkoutId ? undefined : new Date().toISOString(),
    };

    if (editingWorkoutId) {
      onUpdateWorkout(workoutToSave);
    } else {
      onAddWorkout(workoutToSave);
    }

    resetForm();
  }

  function saveCurrentAsTemplate() {
    const cleanWorkoutName = workoutName.trim();
    const cleanExercises = exercises.trim();

    if (!cleanWorkoutName && !cleanExercises) {
      Alert.alert(
        "Empty template",
        "Add a workout name or at least one exercise before saving a template."
      );
      return;
    }

    const newTemplate = {
      id: Date.now().toString(),
      name: cleanWorkoutName || `${focus} Template`,
      exercises: cleanExercises,
      focus,
      createdAt: new Date().toISOString(),
    };

    onAddWorkoutTemplate(newTemplate);

    Alert.alert(
      "Template saved",
      `"${newTemplate.name}" was saved as a reusable template.`
    );
  }

  function loadTemplate(template) {
    setWorkoutName(template.name);
    setExercises(template.exercises);
    setFocus(template.focus || "Custom");
    setEditingWorkoutId(null);
    setShowTemplates(false);

    setTimeout(() => {
      onScrollToTop?.();
    }, 50);
  }

  function deleteTemplate(template) {
    Alert.alert(
      "Delete template?",
      `Delete "${template.name}" from your templates?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDeleteWorkoutTemplate(template.id),
        },
      ]
    );
  }

  function generateSuggestion() {
    const suggestion = buildWorkoutSuggestion({ focus });

    setWorkoutName(suggestion.name);
    setExercises(suggestion.exercises);
    setEditingWorkoutId(null);
  }

  function startEditingWorkout(workout) {
    setWorkoutName(workout.name);
    setSelectedDay(workout.day);
    setExercises(workout.exercises);
    setFocus(workout.focus || "Custom");
    setEditingWorkoutId(workout.id);
    setOpenMenuWorkoutId(null);

    setTimeout(() => {
      onScrollToTop?.();
    }, 50);
  }

  function duplicateWorkout(workout) {
    setWorkoutName(`${workout.name} Copy`);
    setSelectedDay(workout.day);
    setExercises(workout.exercises);
    setFocus(workout.focus || "Custom");
    setEditingWorkoutId(null);
    setOpenMenuWorkoutId(null);

    Alert.alert(
      "Workout copied",
      "Change the day if you want, then tap Save workout to create the duplicate."
    );

    setTimeout(() => {
      onScrollToTop?.();
    }, 50);
  }

  function deleteWorkout(workout) {
    setOpenMenuWorkoutId(null);

    Alert.alert(
      "Delete workout?",
      `Delete "${workout.name}" from your plan?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            onDeleteWorkout(workout.id);

            if (editingWorkoutId === workout.id) {
              resetForm();
            }
          },
        },
      ]
    );
  }

  function toggleMenu(workoutId) {
    setOpenMenuWorkoutId((currentOpenMenuId) =>
      currentOpenMenuId === workoutId ? null : workoutId
    );
  }

  function addExerciseFromLibrary(exerciseName) {
    setExercises((currentExercises) => {
      const cleanCurrentExercises = currentExercises.trim();

      if (cleanCurrentExercises.length === 0) {
        return exerciseName;
      }

      return `${cleanCurrentExercises}\n${exerciseName}`;
    });
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Planner</Text>
        <Text style={styles.title}>Plan your training</Text>
        <Text style={styles.subtitle}>
          Create workouts, load templates, generate ideas, or add exercises from
          your library.
        </Text>
      </View>

      <View style={styles.formCard}>
        <View style={styles.formTopRow}>
          <View style={styles.formTitleWrap}>
            <Text style={styles.cardTitle}>
              {editingWorkoutId ? "Edit workout" : "New workout"}
            </Text>
            <Text style={styles.cardSubtitle}>
              Pick a focus, choose a day, then save it.
            </Text>
          </View>

          {editingWorkoutId && (
            <Pressable style={styles.cancelEditButton} onPress={resetForm}>
              <Text style={styles.cancelEditButtonText}>Cancel</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.templateActions}>
          <Pressable
            style={styles.templateToggleButton}
            onPress={() => setShowTemplates((currentValue) => !currentValue)}
          >
            <Text style={styles.templateToggleButtonText}>
              {showTemplates ? "Hide Templates" : "Load Template"}
            </Text>
          </Pressable>

          <Pressable
            style={styles.saveTemplateButton}
            onPress={saveCurrentAsTemplate}
          >
            <Text style={styles.saveTemplateButtonText}>Save as Template</Text>
          </Pressable>
        </View>

        {showTemplates && (
          <View style={styles.templatePanel}>
            <Text style={styles.templatePanelTitle}>Workout Templates</Text>
            <Text style={styles.templatePanelSubtitle}>
              Load a saved workout idea into the planner.
            </Text>

            {workoutTemplates.length === 0 ? (
              <View style={styles.templateEmptyCard}>
                <Text style={styles.templateEmptyTitle}>No templates yet</Text>
                <Text style={styles.templateEmptyText}>
                  Build a workout, then tap Save as Template.
                </Text>
              </View>
            ) : (
              <View style={styles.templateList}>
                {workoutTemplates.map((template) => (
                  <View key={template.id} style={styles.templateCard}>
                    <View style={styles.templateInfo}>
                      <Text style={styles.templateName}>{template.name}</Text>
                      <Text style={styles.templateFocus}>
                        {template.focus || "Custom"} template
                      </Text>
                    </View>

                    <View style={styles.templateButtonRow}>
                      <Pressable
                        style={styles.loadTemplateButton}
                        onPress={() => loadTemplate(template)}
                      >
                        <Text style={styles.loadTemplateButtonText}>Load</Text>
                      </Pressable>

                      <Pressable
                        style={styles.deleteTemplateButton}
                        onPress={() => deleteTemplate(template)}
                      >
                        <Text style={styles.deleteTemplateButtonText}>Delete</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        <Text style={styles.label}>Focus</Text>
        <View style={styles.chipWrap}>
          {workoutFocusOptions.map((option) => {
            const isActive = focus === option;

            return (
              <Pressable
                key={option}
                style={isActive ? styles.chipActive : styles.chip}
                onPress={() => setFocus(option)}
              >
                <Text style={isActive ? styles.chipTextActive : styles.chipText}>
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Day</Text>
        <View style={styles.dayWrap}>
          {dayOptions.map((day) => {
            const isActive = selectedDay === day;

            return (
              <Pressable
                key={day}
                style={isActive ? styles.dayButtonActive : styles.dayButton}
                onPress={() => setSelectedDay(day)}
              >
                <Text
                  style={isActive ? styles.dayButtonTextActive : styles.dayButtonText}
                >
                  {day}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Workout name</Text>
        <TextInput
          style={styles.input}
          value={workoutName}
          onChangeText={setWorkoutName}
          placeholder="Example: Push Session"
          placeholderTextColor={colors.muted}
        />

        <View style={styles.exerciseLabelRow}>
          <Text style={styles.label}>Exercises</Text>

          <Pressable
            style={styles.libraryToggleButton}
            onPress={() => setShowLibraryPicker((currentValue) => !currentValue)}
          >
            <Text style={styles.libraryToggleButtonText}>
              {showLibraryPicker ? "Hide Library" : "Add from Library"}
            </Text>
          </Pressable>
        </View>

        <TextInput
          style={styles.exerciseInput}
          value={exercises}
          onChangeText={setExercises}
          placeholder={"Example:\nPush-ups 4x12\nDips 3x8\nPlank 3x45s"}
          placeholderTextColor={colors.muted}
          multiline
          textAlignVertical="top"
        />

        {showLibraryPicker && (
          <View style={styles.libraryPicker}>
            <Text style={styles.libraryPickerTitle}>Exercise Library</Text>
            <Text style={styles.libraryPickerSubtitle}>
              Tap Add to place an exercise into your workout.
            </Text>

            <TextInput
              style={styles.librarySearchInput}
              value={librarySearchText}
              onChangeText={setLibrarySearchText}
              placeholder="Search library..."
              placeholderTextColor={colors.muted}
            />

            <View style={styles.libraryCategoryWrap}>
              {exerciseCategories.map((category) => {
                const isActive = libraryCategory === category;

                return (
                  <Pressable
                    key={category}
                    style={
                      isActive
                        ? styles.libraryCategoryChipActive
                        : styles.libraryCategoryChip
                    }
                    onPress={() => setLibraryCategory(category)}
                  >
                    <Text
                      style={
                        isActive
                          ? styles.libraryCategoryChipTextActive
                          : styles.libraryCategoryChipText
                      }
                    >
                      {category}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.libraryCountText}>
              Showing {filteredLibraryExercises.length} exercise
              {filteredLibraryExercises.length === 1 ? "" : "s"}
            </Text>

            {filteredLibraryExercises.map((exercise) => (
              <View key={exercise.id} style={styles.libraryExerciseCard}>
                <View style={styles.libraryExerciseInfo}>
                  <Text style={styles.libraryExerciseName}>{exercise.name}</Text>
                  <Text style={styles.libraryExerciseTarget}>
                    {exercise.isCustom ? "Custom • " : ""}
                    {exercise.category} • {exercise.target}
                  </Text>
                </View>

                <Pressable
                  style={styles.addExerciseButton}
                  onPress={() => addExerciseFromLibrary(exercise.name)}
                >
                  <Text style={styles.addExerciseButtonText}>Add</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        <Pressable style={styles.generateButton} onPress={generateSuggestion}>
          <Text style={styles.generateButtonText}>Generate suggestion</Text>
        </Pressable>

        <Pressable style={styles.saveButton} onPress={saveWorkout}>
          <Text style={styles.saveButtonText}>
            {editingWorkoutId ? "Save changes" : "Save workout"}
          </Text>
        </Pressable>
      </View>

      <View style={styles.plannedSection}>
        <Text style={styles.sectionTitle}>Planned workouts</Text>

        {plannedWorkouts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No workouts planned yet</Text>
            <Text style={styles.emptyText}>
              Create your first workout above and it will appear here.
            </Text>
          </View>
        ) : (
          <View style={styles.workoutList}>
            {plannedWorkouts.map((workout) => (
              <View key={workout.id} style={styles.workoutCard}>
                <View style={styles.workoutCardTopRow}>
                  <View style={styles.workoutCardTitleWrap}>
                    <Text style={styles.workoutDay}>{workout.day}</Text>
                    <Text style={styles.workoutName}>{workout.name}</Text>
                    <Text style={styles.workoutFocus}>
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
                          onPress={() => startEditingWorkout(workout)}
                        >
                          <Text style={styles.menuItemText}>Edit</Text>
                        </Pressable>

                        <Pressable
                          style={styles.menuItem}
                          onPress={() => duplicateWorkout(workout)}
                        >
                          <Text style={styles.menuItemText}>Duplicate</Text>
                        </Pressable>

                        <Pressable
                          style={styles.menuItem}
                          onPress={() => deleteWorkout(workout)}
                        >
                          <Text style={styles.menuItemTextDelete}>Delete</Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                </View>

                <Text style={styles.workoutExercises}>{workout.exercises}</Text>
              </View>
            ))}
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

  formCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 16,
    marginBottom: 24,
  },

  formTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 16,
  },

  formTitleWrap: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 4,
  },

  cardSubtitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.muted,
    lineHeight: 19,
  },

  cancelEditButton: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },

  cancelEditButtonText: {
    fontSize: 12,
    fontWeight: "900",
    color: colors.muted,
  },

  templateActions: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },

  templateToggleButton: {
    flex: 1,
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
  },

  templateToggleButtonText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
  },

  saveTemplateButton: {
    flex: 1,
    backgroundColor: colors.greenLight,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
  },

  saveTemplateButtonText: {
    color: colors.green,
    fontSize: 13,
    fontWeight: "900",
  },

  templatePanel: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
  },

  templatePanelTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 4,
  },

  templatePanelSubtitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.muted,
    lineHeight: 19,
    marginBottom: 12,
  },

  templateEmptyCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
  },

  templateEmptyTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 4,
  },

  templateEmptyText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.muted,
    lineHeight: 19,
  },

  templateList: {
    gap: 10,
  },

  templateCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 12,
  },

  templateInfo: {
    marginBottom: 10,
  },

  templateName: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 3,
  },

  templateFocus: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.muted,
  },

  templateButtonRow: {
    flexDirection: "row",
    gap: 8,
  },

  loadTemplateButton: {
    flex: 1,
    backgroundColor: colors.green,
    borderRadius: 999,
    paddingVertical: 9,
    alignItems: "center",
  },

  loadTemplateButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "900",
  },

  deleteTemplateButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingVertical: 9,
    alignItems: "center",
  },

  deleteTemplateButtonText: {
    color: "#b42318",
    fontSize: 12,
    fontWeight: "900",
  },

  label: {
    fontSize: 13,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 8,
  },

  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },

  chip: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
  },

  chipActive: {
    backgroundColor: colors.green,
    borderWidth: 1,
    borderColor: colors.green,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
  },

  chipText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "900",
  },

  chipTextActive: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "900",
  },

  dayWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },

  dayButton: {
    flexGrow: 1,
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
  },

  dayButtonActive: {
    flexGrow: 1,
    backgroundColor: colors.green,
    borderWidth: 1,
    borderColor: colors.green,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
  },

  dayButtonText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "900",
  },

  dayButtonTextActive: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "900",
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
    marginBottom: 16,
  },

  exerciseLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },

  libraryToggleButton: {
    backgroundColor: colors.greenLight,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  libraryToggleButtonText: {
    color: colors.green,
    fontSize: 12,
    fontWeight: "900",
  },

  exerciseInput: {
    minHeight: 150,
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    lineHeight: 22,
    marginBottom: 14,
  },

  libraryPicker: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 14,
    marginBottom: 14,
  },

  libraryPickerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 4,
  },

  libraryPickerSubtitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.muted,
    lineHeight: 19,
    marginBottom: 12,
  },

  librarySearchInput: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
  },

  libraryCategoryWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },

  libraryCategoryChip: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  libraryCategoryChipActive: {
    backgroundColor: colors.green,
    borderWidth: 1,
    borderColor: colors.green,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  libraryCategoryChipText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "900",
  },

  libraryCategoryChipTextActive: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "900",
  },

  libraryCountText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.muted,
    marginBottom: 10,
  },

  libraryExerciseCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  libraryExerciseInfo: {
    flex: 1,
  },

  libraryExerciseName: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 3,
  },

  libraryExerciseTarget: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.muted,
    lineHeight: 17,
  },

  addExerciseButton: {
    backgroundColor: colors.green,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  addExerciseButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "900",
  },

  generateButton: {
    backgroundColor: colors.greenLight,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
  },

  generateButtonText: {
    color: colors.green,
    fontSize: 14,
    fontWeight: "900",
  },

  saveButton: {
    backgroundColor: colors.green,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
  },

  saveButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "900",
  },

  plannedSection: {
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

  workoutCardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 10,
  },

  workoutCardTitleWrap: {
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
    width: 135,
    zIndex: 10,
  },

  menuItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  menuItemText: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
  },

  menuItemTextDelete: {
    fontSize: 14,
    fontWeight: "900",
    color: "#b42318",
  },
});