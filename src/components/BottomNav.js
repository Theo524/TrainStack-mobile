import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../styles/theme";

const tabs = [
  { id: "today", label: "Today" },
  { id: "plan", label: "Plan" },
  { id: "train", label: "Train" },
  { id: "library", label: "Library" },
  { id: "stats", label: "Stats" },
  { id: "more", label: "More" },
];

export default function BottomNav({ activeTab, onChangeTab }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bottomNav,
        {
          bottom: Math.max(insets.bottom, 10) + 10,
        },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <Pressable
            key={tab.id}
            style={isActive ? styles.navItemActive : styles.navItem}
            onPress={() => onChangeTab(tab.id)}
          >
            <Text style={isActive ? styles.navTextActive : styles.navText}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    left: 10,
    right: 10,
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 7,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.border,
  },

  navItem: {
    flex: 1,
    paddingVertical: 11,
    alignItems: "center",
    borderRadius: 17,
  },

  navItemActive: {
    flex: 1,
    paddingVertical: 11,
    alignItems: "center",
    borderRadius: 17,
    backgroundColor: colors.green,
  },

  navText: {
    color: colors.muted,
    fontWeight: "800",
    fontSize: 9,
  },

  navTextActive: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 9,
  },
});