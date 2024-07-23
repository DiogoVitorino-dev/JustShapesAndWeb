import { Stack } from "expo-router";
import React from "react";

import { useMusicContext } from "@/audio/music";
import { MathUtils } from "@/utils/mathUtils";

export default function MenuLayout() {
  const { playMusic } = useMusicContext();

  const playMenuMusic = () => {
    const selector = Math.floor(MathUtils.random(0, 3));

    switch (selector) {
      case 0:
        playMusic("amaksi-chipmunk-games");
        break;
      case 1:
        playMusic("nickpanek620-chiptune-score-theme-for-video-games");
        break;
      default:
        playMusic("stormAIMusician-firestorm");
        break;
    }
  };

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" listeners={{ focus: playMenuMusic }} />
    </Stack>
  );
}
