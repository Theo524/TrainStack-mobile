import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/theme";

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getExerciseLines(activeWorkout) {
  if (!activeWorkout || !activeWorkout.exercises) return [];

  return activeWorkout.exercises
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function WorkoutScreen({ activeWorkout }) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [restDuration, setRestDuration] = useState(60);
  const [restSeconds, setRestSeconds] = useState(60);
  const [isRestRunning, setIsRestRunning] = useState(false);

  const [completedExercises, setCompletedExercises] = useState({});

  const exerciseLines = getExerciseLines(activeWorkout);

  const completedCount = exerciseLines.filter(
    (exercise, index) => completedExercises[`${exercise}-${index}`]
  ).length;

  useEffect(() => {
    setCompletedExercises({});
  }, [activeWorkout]);

  useEffect(() => {
    let intervalId;

    if (isRunning) {
      intervalId = setInterval(() => {
        setSeconds((currentSeconds) => currentSeconds + 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning]);

  useEffect(() => {
    let restIntervalId;

    if (isRestRunning && restSeconds > 0) {
      restIntervalId = setInterval(() => {
        setRestSeconds((currentSeconds) => currentSeconds - 1);
      }, 1000);
    }

    if (restSeconds === 0) {
      setIsRestRunning(false);
    }

    return () => {
      clearInterval(restIntervalId);
    };
  }, [isRestRunning, restSeconds]);

  function toggleExerciseComplete(exercise, index) {
    const key = `${exercise}-${index}`;

    setCompletedExercises({
      ...completedExercises,
      [key]: !completedExercises[key],
    });
  }

  function startStopwatch() {
    setIsRunning(true);
  }

  function pauseStopwatch() {
    setIsRunning(false);
  }

  function resetStopwatch() {
    setIsRunning(false);
    setSeconds(0);
  }

  function chooseRestDuration(newDuration) {
    setIsRestRunning(false);
    setRestDuration(newDuration);
    setRestSeconds(newDuration);
  }

  function startRestTimer() {
    if (restSeconds === 0) {
      setRestSeconds(restDuration);
    }

    setIsRestRunning(true);
  }

  function pauseRestTimer() {
    setIsRestRunning(false);
  }

  function resetRestTimer() {
    setIsRestRunning(false);
    setRestSeconds(restDuration);
  }

  return (
    <View>
      <Text style={styles.eyebrow}>TRAIN</Text>
      <Text style={styles.title}>Train</Text>
      <Text style={styles.subtitle}>
        Timer first, checklist underneath.
      </Text>

      {activeWorkout ? (
        <View style={styles.summaryCard}>
          <View>
            <Text style={styles.summaryLabel}>Loaded workout</Text>
            <Text style={styles.summaryTitle}>{activeWorkout.name}</Text>
            <Text style={styles.summaryMeta}>
              {activeWorkout.day} • {completedCount}/{exerciseLines.length} done
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>No workout loaded</Text>
          <Text style={styles.summaryTitle}>Manual timer mode</Text>
          <Text style={styles.summaryMeta}>
            Start a workout from Today, or use the timer by itself.
          </Text>
        </View>
      )}

      <View style={styles.timerCard}>
        <Text style={styles.timerLabel}>Workout stopwatch</Text>
        <Text style={styles.timer}>{formatTime(seconds)}</Text>

        <View style={styles.buttonRow}>
          {isRunning ? (
            <Pressable style={styles.primaryButton} onPress={pauseStopwatch}>
              <Text style={styles.primaryButtonText}>Pause</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.primaryButton} onPress={startStopwatch}>
              <Text style={styles.primaryButtonText}>
                {seconds === 0 ? "Start" : "Resume"}
              </Text>
            </Pressable>
          )}

          <Pressable style={styles.secondaryButton} onPress={resetStopwatch}>
            <Text style={styles.secondaryButtonText}>Reset</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.restCard}>
        <Text style={styles.cardTitle}>Rest timer</Text>
        <Text style={styles.restTimer}>{formatTime(restSeconds)}</Text>

        <View style={styles.presetRow}>
          <Pressable
            style={restDuration === 30 ? styles.presetActive : styles.preset}
            onPress={() => chooseRestDuration(30)}
          >
            <Text
              style={
                restDuration === 30
                  ? styles.presetTextActive
                  : styles.presetText
              }
            >
              30s
            </Text>
          </Pressable>

          <Pressable
            style={restDuration === 60 ? styles.presetActive : styles.preset}
            onPress={() => chooseRestDuration(60)}
          >
            <Text
              style={
                restDuration === 60
                  ? styles.presetTextActive
                  : styles.presetText
              }
            >
              60s
            </Text>
          </Pressable>

          <Pressable
            style={restDuration === 90 ? styles.presetActive : styles.preset}
            onPress={() => chooseRestDuration(90)}
          >
            <Text
              style={
                restDuration === 90
                  ? styles.presetTextActive
                  : styles.presetText
              }
            >
              90s
            </Text>
          </Pressable>
        </View>

        <View style={styles.buttonRow}>
          {isRestRunning ? (
            <Pressable style={styles.darkButton} onPress={pauseRestTimer}>
              <Text style={styles.darkButtonText}>Pause rest</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.darkButton} onPress={startRestTimer}>
              <Text style={styles.darkButtonText}>
                {restSeconds === restDuration ? "Start rest" : "Resume rest"}
              </Text>
            </Pressable>
          )}

          <Pressable style={styles.lightButton} onPress={resetRestTimer}>
            <Text style={styles.lightButtonText}>Reset</Text>
          </Pressable>
        </View>
      </View>

      {activeWorkout ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Exercise checklist</Text>

          {exerciseLines.length > 0 ? (
            <>
              <View style={styles.progressBox}>
                <Text style={styles.progressText}>
                  {completedCount} / {exerciseLines.length} completed
                </Text>
              </View>

              <View style={styles.exerciseList}>
                {exerciseLines.map((exercise, index) => {
                  const key = `${exercise}-${index}`;
                  const isCompleted = completedExercises[key];

                  return (
                    <Pressable
                      key={key}
                      style={
                        isCompleted
                          ? styles.exerciseRowCompleted
                          : styles.exerciseRow
                      }
                      onPress={() => toggleExerciseComplete(exercise, index)}
                    >
                      <View
                        style={
                          isCompleted
                            ? styles.checkCircleCompleted
                            : styles.checkCircle
                        }
                      >
                        <Text
                          style={
                            isCompleted
                              ? styles.checkTextCompleted
                              : styles.checkText
                          }
                        >
                          {isCompleted ? "✓" : index + 1}
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
            </>
          ) : (
            <Text style={styles.cardText}>
              This workout has no exercises yet.
            </Text>
          )}
        </View>
      ) : null}
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

  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },

  summaryLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 5,
  },

  summaryTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
  },

  summaryMeta: {
    color: colors.green,
    fontSize: 14,
    fontWeight: "800",
    marginTop: 5,
    lineHeight: 20,
  },

  timerCard: {
    backgroundColor: colors.green,
    borderRadius: 30,
    padding: 24,
    marginBottom: 14,
    alignItems: "center",
  },

  timerLabel: {
    color: colors.greenLight,
    fontWeight: "800",
    fontSize: 14,
    marginBottom: 10,
  },

  timer: {
    color: "#ffffff",
    fontSize: 58,
    fontWeight: "900",
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
    justifyContent: "center",
  },

  primaryButton: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    paddingVertical: 13,
    paddingHorizontal: 28,
  },

  primaryButtonText: {
    color: colors.green,
    fontWeight: "900",
  },

  secondaryButton: {
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 18,
    paddingVertical: 13,
    paddingHorizontal: 28,
  },

  secondaryButtonText: {
    color: "#ffffff",
    fontWeight: "900",
  },

  restCard: {
    backgroundColor: colors.card,
    borderRadius: 30,
    padding: 22,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },

  restTimer: {
    color: colors.green,
    fontSize: 46,
    fontWeight: "900",
    marginTop: 4,
  },

  presetRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },

  preset: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },

  presetActive: {
    backgroundColor: colors.green,
    borderWidth: 1,
    borderColor: colors.green,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },

  presetText: {
    color: colors.muted,
    fontWeight: "900",
  },

  presetTextActive: {
    color: "#ffffff",
    fontWeight: "900",
  },

  darkButton: {
    backgroundColor: colors.green,
    borderRadius: 18,
    paddingVertical: 13,
    paddingHorizontal: 22,
  },

  darkButtonText: {
    color: "#ffffff",
    fontWeight: "900",
  },

  lightButton: {
    backgroundColor: colors.input,
    borderRadius: 18,
    paddingVertical: 13,
    paddingHorizontal: 22,
  },

  lightButtonText: {
    color: colors.green,
    fontWeight: "900",
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

  progressBox: {
    backgroundColor: colors.greenLight,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  progressText: {
    color: colors.green,
    fontWeight: "900",
    fontSize: 14,
  },

  exerciseList: {
    gap: 10,
  },

  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.input,
    borderRadius: 16,
    padding: 12,
  },

  exerciseRowCompleted: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.greenLight,
    borderRadius: 16,
    padding: 12,
  },

  checkCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  checkCircleCompleted: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.green,
    borderWidth: 1,
    borderColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  checkText: {
    color: colors.muted,
    fontWeight: "900",
    fontSize: 13,
  },

  checkTextCompleted: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 16,
  },

  exerciseText: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
  },

  exerciseTextCompleted: {
    flex: 1,
    color: colors.green,
    fontSize: 15,
    fontWeight: "900",
    textDecorationLine: "line-through",
  },
});