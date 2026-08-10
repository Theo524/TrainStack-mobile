import React, { useState } from "react";
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
  const insets = useSafeAreaInsets();

  function addPlannedWorkout(newWorkout) {
    setPlannedWorkouts([newWorkout, ...plannedWorkouts]);
  }

  function renderScreen() {
    if (activeTab === "today") {
      return (
        <TodayScreen
          plannedWorkouts={plannedWorkouts}
          onGoToPlan={() => setActiveTab("plan")}
          onStartTraining={() => setActiveTab("train")}
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

    if (activeTab === "train") return <WorkoutScreen />;
    if (activeTab === "stats") return <StatsScreen />;
    if (activeTab === "more") return <MoreScreen />;

    return (
      <TodayScreen
        plannedWorkouts={plannedWorkouts}
        onGoToPlan={() => setActiveTab("plan")}
        onStartTraining={() => setActiveTab("train")}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.app}>
        <ScrollView
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

        <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
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