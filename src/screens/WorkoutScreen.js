import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/theme";

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function WorkoutScreen() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [restDuration, setRestDuration] = useState(60);
  const [restSeconds, setRestSeconds] = useState(60);
  const [isRestRunning, setIsRestRunning] = useState(false);

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
      <Text style={styles.title}>Active Workout</Text>
      <Text style={styles.subtitle}>Track workout time and rest between sets.</Text>

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
            <Text style={restDuration === 30 ? styles.presetTextActive : styles.presetText}>
              30s
            </Text>
          </Pressable>

          <Pressable
            style={restDuration === 60 ? styles.presetActive : styles.preset}
            onPress={() => chooseRestDuration(60)}
          >
            <Text style={restDuration === 60 ? styles.presetTextActive : styles.presetText}>
              60s
            </Text>
          </Pressable>

          <Pressable
            style={restDuration === 90 ? styles.presetActive : styles.preset}
            onPress={() => chooseRestDuration(90)}
          >
            <Text style={restDuration === 90 ? styles.presetTextActive : styles.presetText}>
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

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Next upgrade</Text>
        <Text style={styles.cardText}>
          After this, we can add exercises and set tracking so you can tick off each set while training.
        </Text>
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

  timerCard: {
    backgroundColor: colors.green,
    borderRadius: 30,
    padding: 24,
    marginBottom: 18,
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
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },

  restTimer: {
    color: colors.green,
    fontSize: 50,
    fontWeight: "900",
    marginTop: 4,
  },

  presetRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 18,
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
});