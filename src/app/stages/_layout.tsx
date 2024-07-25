import { Stack } from "expo-router";
import React from "react";

export default function StagesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Stages" }} />
    </Stack>
  );
}
