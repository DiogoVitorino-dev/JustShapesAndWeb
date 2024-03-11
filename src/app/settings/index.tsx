import { Href } from "expo-router";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import Animated, { SlideInLeft } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import OptionItem from "@/components/settings/optionItem";
import { IconProps, View } from "@/components/shared";
import Colors from "@/constants/Colors";

interface ListItemData {
  title: string;
  icon: IconProps["name"];
  to: Href<string>;
}

const options: ListItemData[] = [
  { title: "Audio", icon: "musical-notes-sharp", to: "/settings/audio" },
];

if (Platform.OS === "web") {
  options.push({
    title: "Keyboard",
    icon: "game-controller",
    to: "/settings/keyboard",
  });
}

const entryExitAnimation =
  Platform.OS !== "web"
    ? SlideInLeft.springify().delay(100).mass(0.5)
    : undefined;

export default function SettingsList() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={options}
        style={[{ ...insets }, styles.list]}
        entering={entryExitAnimation}
        exiting={entryExitAnimation}
        renderItem={({ item }) => OptionItem({ ...item })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: Colors.UI.background,
  },

  list: {
    margin: 16,
  },
});
