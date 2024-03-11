import { Stack } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { defaultStackScreenOptions } from "../_layout";

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ ...defaultStackScreenOptions }}>
      <Stack.Screen name="index" options={{ title: "Configurações" }} />
      {Platform.OS === "web" ? (
        <Stack.Screen name="keyboard" options={{ title: "Teclado" }} />
      ) : null}

      <Stack.Screen name="audio" options={{ title: "Audio" }} />
    </Stack>
  );
}
