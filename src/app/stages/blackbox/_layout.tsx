import { Stack } from "expo-router";
import React from "react";

import { useMusicContext } from "@/audio/music";
import StageControllerProvider from "@/scripts/stageController/stageControllerProvider";

export default function BlackBoxStageLayout() {
  const { stop } = useMusicContext();
  const stopMusic = () => stop();

  return (
    <StageControllerProvider>
      <Stack
        screenOptions={{ headerShown: false }}
        screenListeners={{ beforeRemove: stopMusic }}
      >
        <Stack.Screen name="ani" options={{ title: "Ani" }} />
      </Stack>
    </StageControllerProvider>
  );
}
