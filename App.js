import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import BottomNav from "./src/components/BottomNav";
import TodayScreen from "./src/screens/TodayScreen";
import PlanScreen from "./src/screens/PlanScreen";
import WorkoutScreen from "./src/screens/WorkoutScreen";
import StatsScreen from "./src/screens/StatsScreen";
import MoreScreen from "./src/screens/MoreScreen";
import { colors, spacing } from "./src/styles/theme";

const PLANNED_WORKOUTS_KEY = "command-fit-planned-workouts";
const COMPLETED_WORKOUTS_KEY = "command-fit-completed-workouts";

function AppContent() {
  const [activeTab, setActiveTab] = useState("today");
  const [plannedWorkouts, setPlannedWorkouts] = useState([]);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [storageLoaded, setStorageLoaded] = useState(false);

  const scrollViewRef = useRef(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    async function loadSavedData() {
      try {
        const savedPlannedWorkouts = await AsyncStorage.getItem(
          PLANNED_WORKOUTS_KEY
        );

        const savedCompletedWorkouts = await AsyncStorage.getItem(
          COMPLETED_WORKOUTS_KEY
        );

        if (savedPlannedWorkouts) {
          setPlannedWorkouts(JSON.parse(savedPlannedWorkouts));
        }

        if (savedCompletedWorkouts) {
          setCompletedWorkouts(JSON.parse(savedCompletedWorkouts));
        }
      } catch (error) {
        console.log("Could not load saved workout data:", error);
      } finally {
        setStorageLoaded(true);
      }
    }

    loadSavedData();
  }, []);

  useEffect(() => {
    if (!storageLoaded) return;

    async function savePlannedWorkouts() {
      try {
        await AsyncStorage.setItem(
          PLANNED_WORKOUTS_KEY,
          JSON.stringify(plannedWorkouts)
        );
      } catch (error) {
        console.log("Could not save planned workouts:", error);
      }
    }

    savePlannedWorkouts();
  }, [plannedWorkouts, storageLoaded]);

  useEffect(() => {
    if (!storageLoaded) return;

    async function saveCompletedWorkouts() {
      try {
        await AsyncStorage.setItem(
          COMPLETED_WORKOUTS_KEY,
          JSON.stringify(completedWorkouts)
        );
      } catch (error) {
        console.log("Could not save completed workouts:", error);
      }
    }

    saveCompletedWorkouts();
  }, [completedWorkouts, storageLoaded]);

  function addPlannedWorkout(newWorkout) {
    setPlannedWorkouts((currentWorkouts) => [newWorkout, ...currentWorkouts]);
  }

  function updatePlannedWorkout(updatedWorkout) {
    setPlannedWorkouts((currentWorkouts) =>
      currentWorkouts.map((workout) =>
        workout.id === updatedWorkout.id ? updatedWorkout : workout
      )
    );

    if (activeWorkout && activeWorkout.id === updatedWorkout.id) {
      setActiveWorkout(updatedWorkout);
    }
  }

  function deletePlannedWorkout(workoutId) {
    setPlannedWorkouts((currentWorkouts) =>
      currentWorkouts.filter((workout) => workout.id !== workoutId)
    );

    if (activeWorkout && activeWorkout.id === workoutId) {
      setActiveWorkout(null);
    }
  }

  function deleteCompletedWorkout(completedWorkoutId) {
    setCompletedWorkouts((currentCompletedWorkouts) =>
      currentCompletedWorkouts.filter(
        (workout) => workout.id !== completedWorkoutId
      )
    );
  }

  function scrollToY(y) {
    scrollViewRef.current?.scrollTo({
      y,
      animated: true,
    });
  }

  function scrollToTop() {
    scrollViewRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }

  function changeTab(tab) {
    setActiveTab(tab);

    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: 0,
        animated: false,
      });
    }, 50);
  }

  function startTraining(workout) {
    setActiveWorkout(workout);
    changeTab("train");
  }

  function finishWorkout(completedWorkout) {
    setCompletedWorkouts((currentCompletedWorkouts) => [
      completedWorkout,
      ...currentCompletedWorkouts,
    ]);

    setActiveWorkout(null);
    changeTab("stats");
  }

  function renderScreen() {
    if (activeTab === "today") {
      return (
        <TodayScreen
          plannedWorkouts={plannedWorkouts}
          onGoToPlan={() => changeTab("plan")}
          onStartTraining={startTraining}
        />
      );
    }

    if (activeTab === "plan") {
      return (
        <PlanScreen
          plannedWorkouts={plannedWorkouts}
          onAddWorkout={addPlannedWorkout}
          onUpdateWorkout={updatePlannedWorkout}
          onDeleteWorkout={deletePlannedWorkout}
          onScrollToTop={scrollToTop}
        />
      );
    }

    if (activeTab === "train") {
      return (
        <WorkoutScreen
          activeWorkout={activeWorkout}
          onFinishWorkout={finishWorkout}
          onScrollToY={scrollToY}
        />
      );
    }

    if (activeTab === "stats") {
      return (
        <StatsScreen
          completedWorkouts={completedWorkouts}
          onDeleteCompletedWorkout={deleteCompletedWorkout}
        />
      );
    }

    if (activeTab === "more") return <MoreScreen />;

    return (
      <TodayScreen
        plannedWorkouts={plannedWorkouts}
        onGoToPlan={() => changeTab("plan")}
        onStartTraining={startTraining}
      />
    );
  }

  if (!storageLoaded) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

        <View style={styles.loadingScreen}>
          <Text style={styles.loadingTitle}>Command Fit</Text>
          <Text style={styles.loadingText}>Loading saved workouts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.app}>
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom: spacing.bottomNavHeight + insets.bottom,
            },
          ]}
        >
          {renderScreen()}
        </ScrollView>

        <BottomNav activeTab={activeTab} onChangeTab={changeTab} />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  app: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    paddingHorizontal: spacing.screenX,
    paddingTop: Platform.OS === "android" ? 10 : 0,
  },

  loadingScreen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  loadingTitle: {
    fontSize: 34,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 8,
  },

  loadingText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.muted,
  },
});