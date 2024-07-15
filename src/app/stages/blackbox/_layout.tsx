import { Stack } from "expo-router";
import React from "react";

import StageControllerProvider from "@/scripts/stageController/stageControllerProvider";

export default function BlackBoxStageLayout() {
  return (
    <StageControllerProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ani" options={{ title: "Ani" }} />
      </Stack>
    </StageControllerProvider>
  );
}
