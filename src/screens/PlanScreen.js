import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../styles/theme";
import {
  buildWorkoutSuggestion,
  workoutFocusOptions,
} from "../data/workoutSuggestions";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function PlanScreen({
  plannedWorkouts,
  onAddWorkout,
  onUpdateWorkout,
  onDeleteWorkout,
  onScrollToTop,
}) {
  const [workoutName, setWorkoutName] = useState("");
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [exercises, setExercises] = useState("");

  const [focus, setFocus] = useState("Push");
  const [editingWorkoutId, setEditingWorkoutId] = useState(null);
  const [openMenuWorkoutId, setOpenMenuWorkoutId] = useState(null);

  const isEditing = editingWorkoutId !== null;

  function resetForm() {
    setWorkoutName("");
    setSelectedDay("Mon");
    setExercises("");
    setEditingWorkoutId(null);
  }

  function saveWorkout() {
    if (!workoutName.trim()) return;

    if (isEditing) {
      const updatedWorkout = {
        id: editingWorkoutId,
        name: workoutName.trim(),
        day: selectedDay,
        exercises: exercises.trim(),
      };

      onUpdateWorkout(updatedWorkout);
      resetForm();
      return;
    }

    const newWorkout = {
      id: Date.now().toString(),
      name: workoutName.trim(),
      day: selectedDay,
      exercises: exercises.trim(),
    };

    onAddWorkout(newWorkout);
    resetForm();
  }

  function generateSuggestion() {
    const suggestion = buildWorkoutSuggestion({
      focus,
    });

    setWorkoutName(suggestion.name);
    setExercises(suggestion.exercises);
  }

  function startEditingWorkout(workout) {
    setEditingWorkoutId(workout.id);
    setWorkoutName(workout.name);
    setSelectedDay(workout.day);
    setExercises(workout.exercises || "");
    setOpenMenuWorkoutId(null);
    onScrollToTop();
  }

  function deleteWorkout(workoutId) {
    onDeleteWorkout(workoutId);
    setOpenMenuWorkoutId(null);

    if (editingWorkoutId === workoutId) {
      resetForm();
    }
  }

  function toggleMenu(workoutId) {
    if (openMenuWorkoutId === workoutId) {
      setOpenMenuWorkoutId(null);
    } else {
      setOpenMenuWorkoutId(workoutId);
    }
  }

  return (
    <View>
      <Text style={styles.eyebrow}>PLAN</Text>
      <Text style={styles.title}>Workout Planner</Text>
      <Text style={styles.subtitle}>
        Generate a starting point or type your own workout.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Suggest workout</Text>
        <Text style={styles.cardText}>
          Pick one main focus. The app fills the form below, then you can edit
          anything before saving.
        </Text>

        <Text style={styles.label}>What do you want to train?</Text>
        <View style={styles.chipRow}>
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

        <Pressable style={styles.secondaryButton} onPress={generateSuggestion}>
          <Text style={styles.secondaryButtonText}>Generate suggestion</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {isEditing ? "Edit workout" : "Create workout"}
        </Text>

        {isEditing ? (
          <View style={styles.editingNotice}>
            <Text style={styles.editingNoticeText}>
              Editing workout. Save changes or cancel below.
            </Text>
          </View>
        ) : null}

        <Text style={styles.label}>Workout name</Text>
        <TextInput
          style={styles.input}
          placeholder="Pull day, speed session, handstand practice..."
          placeholderTextColor="#8b8578"
          value={workoutName}
          onChangeText={setWorkoutName}
        />

        <Text style={styles.label}>Day</Text>
        <View style={styles.dayRow}>
          {days.map((day) => {
            const isActive = selectedDay === day;

            return (
              <Pressable
                key={day}
                style={isActive ? styles.dayChipActive : styles.dayChip}
                onPress={() => setSelectedDay(day)}
              >
                <Text style={isActive ? styles.dayTextActive : styles.dayText}>
                  {day}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Exercises</Text>
        <TextInput
          style={[styles.input, styles.exerciseInput]}
          placeholder={"Pull-ups 3x6\nRows 3x10\nLeg raises 4x12"}
          placeholderTextColor="#8b8578"
          value={exercises}
          onChangeText={setExercises}
          multiline
        />

        <Pressable style={styles.primaryButton} onPress={saveWorkout}>
          <Text style={styles.primaryButtonText}>
            {isEditing ? "Save changes" : "Save workout plan"}
          </Text>
        </Pressable>

        {isEditing ? (
          <Pressable style={styles.cancelButton} onPress={resetForm}>
            <Text style={styles.cancelButtonText}>Cancel editing</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Planned workouts</Text>

        {plannedWorkouts.length === 0 ? (
          <Text style={styles.emptyText}>
            No workouts planned yet. Create your first one above.
          </Text>
        ) : (
          plannedWorkouts.map((workout) => {
            const isMenuOpen = openMenuWorkoutId === workout.id;

            return (
              <View key={workout.id} style={styles.workoutItem}>
                <View style={styles.workoutTopRow}>
                  <Text style={styles.workoutName}>{workout.name}</Text>

                  <View style={styles.workoutActions}>
                    <View style={styles.dayBadge}>
                      <Text style={styles.dayBadgeText}>{workout.day}</Text>
                    </View>

                    <Pressable
                      style={styles.optionsButton}
                      onPress={() => toggleMenu(workout.id)}
                    >
                      <Text style={styles.optionsButtonText}>⋯</Text>
                    </Pressable>
                  </View>
                </View>

                {workout.exercises ? (
                  <Text style={styles.workoutExercises}>
                    {workout.exercises}
                  </Text>
                ) : (
                  <Text style={styles.workoutExercisesMuted}>
                    No exercises added yet.
                  </Text>
                )}

                {isMenuOpen ? (
                  <View style={styles.actionMenu}>
                    <Pressable
                      style={styles.actionMenuButton}
                      onPress={() => startEditingWorkout(workout)}
                    >
                      <Text style={styles.actionMenuButtonText}>Edit workout</Text>
                    </Pressable>

                    <Pressable
                      style={styles.actionMenuDeleteButton}
                      onPress={() => deleteWorkout(workout.id)}
                    >
                      <Text style={styles.actionMenuDeleteText}>
                        Delete workout
                      </Text>
                    </Pressable>
                  </View>
                ) : null}
              </View>
            );
          })
        )}
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
    marginBottom: 10,
  },

  cardText: {
    fontSize: 15,
    color: colors.muted,
    lineHeight: 22,
    marginBottom: 4,
  },

  editingNotice: {
    backgroundColor: colors.greenLight,
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
  },

  editingNoticeText: {
    color: colors.green,
    fontWeight: "900",
    fontSize: 14,
    lineHeight: 20,
  },

  label: {
    fontSize: 12,
    fontWeight: "900",
    color: colors.muted,
    marginBottom: 7,
    marginTop: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  input: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 13,
    color: colors.text,
    fontSize: 16,
  },

  exerciseInput: {
    minHeight: 110,
    textAlignVertical: "top",
  },

  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  chip: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 13,
  },

  chipActive: {
    backgroundColor: colors.green,
    borderWidth: 1,
    borderColor: colors.green,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 13,
  },

  chipText: {
    color: colors.muted,
    fontWeight: "900",
    fontSize: 13,
  },

  chipTextActive: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 13,
  },

  dayRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  dayChip: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 13,
  },

  dayChipActive: {
    backgroundColor: colors.green,
    borderWidth: 1,
    borderColor: colors.green,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 13,
  },

  dayText: {
    color: colors.muted,
    fontWeight: "900",
    fontSize: 13,
  },

  dayTextActive: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 13,
  },

  primaryButton: {
    marginTop: 16,
    backgroundColor: colors.accent,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },

  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 16,
  },

  secondaryButton: {
    marginTop: 16,
    backgroundColor: colors.green,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },

  secondaryButtonText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 16,
  },

  cancelButton: {
    marginTop: 10,
    backgroundColor: colors.input,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },

  cancelButtonText: {
    color: colors.green,
    fontWeight: "900",
    fontSize: 15,
  },

  emptyText: {
    color: colors.muted,
    fontSize: 15,
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
    gap: 10,
  },

  workoutName: {
    fontSize: 17,
    fontWeight: "900",
    color: colors.text,
    flex: 1,
  },

  workoutActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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

  optionsButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  optionsButtonText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    marginTop: -8,
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

  actionMenu: {
    marginTop: 12,
    backgroundColor: colors.input,
    borderRadius: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },

  actionMenuButton: {
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },

  actionMenuButtonText: {
    color: colors.green,
    fontWeight: "900",
    fontSize: 14,
  },

  actionMenuDeleteButton: {
    backgroundColor: "#fff1ef",
    borderWidth: 1,
    borderColor: "#f0c5bf",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },

  actionMenuDeleteText: {
    color: "#9f2f24",
    fontWeight: "900",
    fontSize: 14,
  },
});