import { Stack } from "expo-router";
import React from "react";

import { defaultStackScreenOptions } from "../_layout";

import { useSoundContext } from "@/audio/sound";
import { HeaderBackButton } from "@/components/shared";

export default function SettingsLayout() {
  const { playSound } = useSoundContext();

  const focus = async () => playSound("open-nested-menu");

  const beforeRemove = async () => playSound("close-menu");

  const beforeRemoveScreen = async () => playSound("close-nested-menu");

  return (
    <Stack
      screenOptions={(routeProps) => ({
        ...defaultStackScreenOptions,
        headerLeft: (props) => <HeaderBackButton {...routeProps} {...props} />,
      })}
    >
      <Stack.Screen
        name="index"
        listeners={{ beforeRemove }}
        options={{ title: "Configurações" }}
      />

      <Stack.Screen
        name="keyboard"
        listeners={{ focus, beforeRemove: beforeRemoveScreen }}
        options={{ title: "Teclado" }}
      />

      <Stack.Screen
        name="audio"
        listeners={{ focus, beforeRemove: beforeRemoveScreen }}
        options={{ title: "Audio" }}
      />
    </Stack>
  );
}
