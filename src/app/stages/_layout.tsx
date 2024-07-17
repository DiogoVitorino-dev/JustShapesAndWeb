import { Stack } from "expo-router";
import React from "react";

import { useMusicContext } from "@/audio/music";

export default function StagesLayout() {
  const { stop } = useMusicContext();
  const stopMenuMusic = () => stop(500);

  return (
    <Stack
      screenOptions={{ headerShown: false }}
      screenListeners={{ focus: stopMenuMusic }}
    >
      <Stack.Screen name="index" options={{ title: "Stages" }} />
    </Stack>
  );
}
