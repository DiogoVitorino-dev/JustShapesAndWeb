import { Stack } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { defaultStackScreenOptions } from "../_layout";

import { useSoundContext } from "@/audio/sound";
import { HeaderBackButton } from "@/components/shared";

export default function SettingsLayout() {
  const sound = useSoundContext();

  const transitionStart = async () => {
    await sound.play("openNestedMenu");
  };

  const beforeRemove = async () => {
    await sound.play("closeMenu");
  };

  const beforeRemoveScreen = async () => {
    await sound.play("closeNestedMenu");
  };

  return (
    <Stack
      screenListeners={{ transitionStart }}
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
      {Platform.OS === "web" ? (
        <Stack.Screen
          name="keyboard"
          listeners={{ beforeRemove: beforeRemoveScreen }}
          options={{ title: "Teclado" }}
        />
      ) : null}

      <Stack.Screen
        name="audio"
        listeners={{ beforeRemove: beforeRemoveScreen }}
        options={{ title: "Audio" }}
      />
    </Stack>
  );
}
