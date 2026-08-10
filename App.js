import React, { useRef, useState } from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
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

function AppContent() {
  const [activeTab, setActiveTab] = useState("today");
  const [plannedWorkouts, setPlannedWorkouts] = useState([]);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);

  const scrollViewRef = useRef(null);
  const insets = useSafeAreaInsets();

  function addPlannedWorkout(newWorkout) {
    setPlannedWorkouts((currentWorkouts) => [newWorkout, ...currentWorkouts]);
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

  function scrollToY(y) {
    scrollViewRef.current?.scrollTo({
      y,
      animated: true,
    });
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
      return <StatsScreen completedWorkouts={completedWorkouts} />;
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
});