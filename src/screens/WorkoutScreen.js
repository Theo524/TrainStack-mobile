import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { colors } from "../styles/theme";

function getExerciseLines(workout) {
  if (!workout?.exercises) return [];

  return workout.exercises
    .split("\n")
    .map((exercise) => exercise.trim())
    .filter((exercise) => exercise.length > 0);
}

function formatStopwatch(milliseconds) {
  const totalHundredths = Math.floor(milliseconds / 10);
  const hundredths = totalHundredths % 100;
  const totalSeconds = Math.floor(totalHundredths / 100);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}.${String(hundredths).padStart(2, "0")}`;
}

function formatRestTimer(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

export default function WorkoutScreen({
  activeWorkout,
  onFinishWorkout,
  onScrollToY,
}) {
  const [completedExercises, setCompletedExercises] = useState([]);
  const [checklistY, setChecklistY] = useState(0);

  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [stopwatchElapsedMs, setStopwatchElapsedMs] = useState(0);
  const stopwatchStartTimeRef = useRef(null);
  const stopwatchBaseMsRef = useRef(0);

  const [restTimerSeconds, setRestTimerSeconds] = useState(60);
  const [restRemainingSeconds, setRestRemainingSeconds] = useState(0);
  const [restTimerRunning, setRestTimerRunning] = useState(false);
  const [customRestInput, setCustomRestInput] = useState("45");

  const exerciseLines = useMemo(
    () => getExerciseLines(activeWorkout),
    [activeWorkout]
  );

  const completionPercent =
    exerciseLines.length === 0
      ? 0
      : Math.round((completedExercises.length / exerciseLines.length) * 100);

  useEffect(() => {
    setCompletedExercises([]);
    setChecklistY(0);

    setStopwatchRunning(false);
    setStopwatchElapsedMs(0);
    stopwatchStartTimeRef.current = null;
    stopwatchBaseMsRef.current = 0;

    setRestTimerRunning(false);
    setRestRemainingSeconds(0);
  }, [activeWorkout]);

  useEffect(() => {
    if (!stopwatchRunning) return;

    stopwatchStartTimeRef.current = Date.now();

    const interval = setInterval(() => {
      const startTime = stopwatchStartTimeRef.current || Date.now();
      const liveElapsed = stopwatchBaseMsRef.current + (Date.now() - startTime);

      setStopwatchElapsedMs(liveElapsed);
    }, 30);

    return () => clearInterval(interval);
  }, [stopwatchRunning]);

  useEffect(() => {
    if (!restTimerRunning) return;

    const interval = setInterval(() => {
      setRestRemainingSeconds((currentSeconds) => {
        if (currentSeconds <= 1) {
          setRestTimerRunning(false);
          return 0;
        }

        return currentSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [restTimerRunning]);

  function toggleStopwatch() {
    if (stopwatchRunning) {
      stopwatchBaseMsRef.current = stopwatchElapsedMs;
      setStopwatchRunning(false);
      return;
    }

    stopwatchStartTimeRef.current = Date.now();
    stopwatchBaseMsRef.current = stopwatchElapsedMs;
    setStopwatchRunning(true);
  }

  function resetStopwatch() {
    setStopwatchRunning(false);
    setStopwatchElapsedMs(0);
    stopwatchStartTimeRef.current = null;
    stopwatchBaseMsRef.current = 0;
  }

  function startRestTimer(seconds) {
    setRestTimerSeconds(seconds);
    setRestRemainingSeconds(seconds);
    setRestTimerRunning(true);
  }

  function startCustomRestTimer() {
    const customSeconds = Number(customRestInput);

    if (!customRestInput.trim() || Number.isNaN(customSeconds)) {
      Alert.alert("Invalid rest time", "Type a rest time in seconds first.");
      return;
    }

    if (customSeconds < 1) {
      Alert.alert("Invalid rest time", "Rest time must be at least 1 second.");
      return;
    }

    if (customSeconds > 3600) {
      Alert.alert("Rest time too long", "Use 3600 seconds or less.");
      return;
    }

    startRestTimer(customSeconds);
  }

  function resetRestTimer() {
    setRestTimerRunning(false);
    setRestRemainingSeconds(0);
  }

  function toggleExercise(index) {
    setCompletedExercises((currentCompletedExercises) => {
      if (currentCompletedExercises.includes(index)) {
        return currentCompletedExercises.filter(
          (exerciseIndex) => exerciseIndex !== index
        );
      }

      return [...currentCompletedExercises, index];
    });
  }

  function completeWorkout() {
    if (!activeWorkout) return;

    const completedWorkout = {
      ...activeWorkout,
      id: Date.now().toString(),
      originalWorkoutId: activeWorkout.id,
      completedAt: new Date().toISOString(),
      completedExercises,
      totalExercises: exerciseLines.length,
      optionalTimerSeconds: Math.floor(stopwatchElapsedMs / 1000),
      optionalTimerMilliseconds: stopwatchElapsedMs,
    };

    onFinishWorkout(completedWorkout);
  }

  function finishWorkout() {
    if (!activeWorkout) return;

    if (
      exerciseLines.length > 0 &&
      completedExercises.length < exerciseLines.length
    ) {
      Alert.alert(
        "Finish workout?",
        `You checked off ${completedExercises.length} of ${exerciseLines.length} exercises.`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Finish anyway",
            onPress: completeWorkout,
          },
        ]
      );

      return;
    }

    completeWorkout();
  }

  function renderTimers() {
    return (
      <>
        <View style={styles.timerCard}>
          <Text style={styles.timerLabel}>Stopwatch</Text>
          <Text style={styles.stopwatchText}>
            {formatStopwatch(stopwatchElapsedMs)}
          </Text>

          <View style={styles.timerButtonRow}>
            <Pressable
              style={styles.primaryTimerButton}
              onPress={toggleStopwatch}
            >
              <Text style={styles.primaryTimerButtonText}>
                {stopwatchRunning ? "Pause" : "Start"}
              </Text>
            </Pressable>

            <Pressable
              style={styles.secondaryTimerButton}
              onPress={resetStopwatch}
            >
              <Text style={styles.secondaryTimerButtonText}>Reset</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.restCard}>
          <View style={styles.restTopRow}>
            <View>
              <Text style={styles.timerLabel}>Rest timer</Text>
              <Text style={styles.restTimeText}>
                {restRemainingSeconds > 0
                  ? formatRestTimer(restRemainingSeconds)
                  : formatRestTimer(restTimerSeconds)}
              </Text>
            </View>

            <Pressable
              style={styles.secondaryTimerButton}
              onPress={resetRestTimer}
            >
              <Text style={styles.secondaryTimerButtonText}>Reset</Text>
            </Pressable>
          </View>

          <View style={styles.restButtonRow}>
            <Pressable
              style={styles.restButton}
              onPress={() => startRestTimer(30)}
            >
              <Text style={styles.restButtonText}>30s</Text>
            </Pressable>

            <Pressable
              style={styles.restButton}
              onPress={() => startRestTimer(60)}
            >
              <Text style={styles.restButtonText}>60s</Text>
            </Pressable>

            <Pressable
              style={styles.restButton}
              onPress={() => startRestTimer(90)}
            >
              <Text style={styles.restButtonText}>90s</Text>
            </Pressable>

            <Pressable
              style={styles.restButton}
              onPress={() => startRestTimer(120)}
            >
              <Text style={styles.restButtonText}>120s</Text>
            </Pressable>
          </View>

          <View style={styles.customRestSection}>
            <Text style={styles.customRestLabel}>Custom rest seconds</Text>

            <View style={styles.customRestRow}>
              <TextInput
                style={styles.customRestInput}
                value={customRestInput}
                onChangeText={(text) =>
                  setCustomRestInput(text.replace(/[^0-9]/g, ""))
                }
                placeholder="45"
                placeholderTextColor={colors.muted}
                keyboardType="number-pad"
              />

              <Pressable
                style={styles.customRestButton}
                onPress={startCustomRestTimer}
              >
                <Text style={styles.customRestButtonText}>Start</Text>
              </Pressable>
            </View>
          </View>

          <Text style={styles.restHint}>
            {restTimerRunning ? "Rest timer running" : "Pick or type a rest time"}
          </Text>
        </View>
      </>
    );
  }

  if (!activeWorkout) {
    return (
      <View style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.kicker}>Train</Text>
          <Text style={styles.title}>Free training tools</Text>
          <Text style={styles.subtitle}>
            Use the stopwatch or rest timer anytime, even without a workout
            loaded.
          </Text>
        </View>

        {renderTimers()}

        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No workout loaded</Text>
          <Text style={styles.emptyText}>
            Start a planned workout from the Today tab when you want a checklist.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Train</Text>
        <Text style={styles.title}>Workout mode</Text>
        <Text style={styles.subtitle}>
          Check off exercises, use the stopwatch, and finish when done.
        </Text>
      </View>

      <Pressable
        style={styles.loadedWorkoutCard}
        onPress={() => onScrollToY?.(checklistY)}
      >
        <View style={styles.loadedTopRow}>
          <View style={styles.loadedTitleWrap}>
            <Text style={styles.loadedLabel}>Loaded workout</Text>
            <Text style={styles.loadedName}>{activeWorkout.name}</Text>
            <Text style={styles.loadedMeta}>
              {activeWorkout.day} • {activeWorkout.focus || "Custom"}
            </Text>
          </View>

          <Pressable style={styles.finishSmallButton} onPress={finishWorkout}>
            <Text style={styles.finishSmallButtonText}>Finish</Text>
          </Pressable>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${completionPercent}%`,
              },
            ]}
          />
        </View>

        <Text style={styles.loadedHint}>
          {completedExercises.length}/{exerciseLines.length} exercises complete •
          Tap card to jump to checklist
        </Text>
      </Pressable>

      {renderTimers()}

      <View
        style={styles.checklistSection}
        onLayout={(event) => setChecklistY(event.nativeEvent.layout.y)}
      >
        <Text style={styles.sectionTitle}>Exercise checklist</Text>

        {exerciseLines.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No exercises listed</Text>
            <Text style={styles.emptyText}>
              This workout has no exercise lines yet.
            </Text>
          </View>
        ) : (
          <View style={styles.checklist}>
            {exerciseLines.map((exercise, index) => {
              const isCompleted = completedExercises.includes(index);

              return (
                <Pressable
                  key={`${exercise}-${index}`}
                  style={
                    isCompleted
                      ? styles.exerciseCheckCardCompleted
                      : styles.exerciseCheckCard
                  }
                  onPress={() => toggleExercise(index)}
                >
                  <View
                    style={
                      isCompleted ? styles.checkboxCompleted : styles.checkbox
                    }
                  >
                    <Text style={styles.checkboxText}>
                      {isCompleted ? "✓" : ""}
                    </Text>
                  </View>

                  <Text
                    style={
                      isCompleted
                        ? styles.exerciseTextCompleted
                        : styles.exerciseText
                    }
                  >
                    {exercise}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>

      <Pressable style={styles.finishButton} onPress={finishWorkout}>
        <Text style={styles.finishButtonText}>Finish workout</Text>
      </Pressable>
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

  loadedWorkoutCard: {
    backgroundColor: colors.green,
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
  },

  loadedTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14,
  },

  loadedTitleWrap: {
    flex: 1,
  },

  loadedLabel: {
    color: colors.greenLight,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  loadedName: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 5,
  },

  loadedMeta: {
    color: colors.greenLight,
    fontSize: 13,
    fontWeight: "800",
  },

  finishSmallButton: {
    backgroundColor: "#ffffff",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    alignSelf: "flex-start",
  },

  finishSmallButtonText: {
    color: colors.green,
    fontSize: 12,
    fontWeight: "900",
  },

  progressTrack: {
    height: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 10,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 999,
  },

  loadedHint: {
    color: colors.greenLight,
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 18,
  },

  timerCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
  },

  timerLabel: {
    fontSize: 13,
    fontWeight: "900",
    color: colors.accent,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  stopwatchText: {
    fontSize: 44,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 14,
  },

  timerButtonRow: {
    flexDirection: "row",
    gap: 10,
  },

  primaryTimerButton: {
    flex: 1,
    backgroundColor: colors.green,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },

  primaryTimerButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
  },

  secondaryTimerButton: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryTimerButtonText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "900",
  },

  restCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 18,
    marginBottom: 24,
  },

  restTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14,
  },

  restTimeText: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.text,
  },

  restButtonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },

  restButton: {
    flexGrow: 1,
    backgroundColor: colors.greenLight,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: "center",
  },

  restButtonText: {
    color: colors.green,
    fontSize: 13,
    fontWeight: "900",
  },

  customRestSection: {
    marginBottom: 10,
  },

  customRestLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: colors.muted,
    marginBottom: 8,
  },

  customRestRow: {
    flexDirection: "row",
    gap: 10,
  },

  customRestInput: {
    flex: 1,
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
  },

  customRestButton: {
    backgroundColor: colors.green,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  customRestButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
  },

  restHint: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
  },

  checklistSection: {
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 12,
  },

  checklist: {
    gap: 10,
  },

  exerciseCheckCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  exerciseCheckCardCompleted: {
    backgroundColor: colors.greenLight,
    borderWidth: 1,
    borderColor: colors.greenLight,
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
  },

  checkboxCompleted: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.green,
  },

  checkboxText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "900",
  },

  exerciseText: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 21,
  },

  exerciseTextCompleted: {
    flex: 1,
    color: colors.green,
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 21,
  },

  finishButton: {
    backgroundColor: colors.green,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 24,
  },

  finishButtonText: {
    color: "#ffffff",
    fontSize: 16,
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
    lineHeight: 20,
  },
});