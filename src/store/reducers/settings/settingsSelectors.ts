import { createSelector } from "@reduxjs/toolkit";

import {
  GameCommands,
  KeyboardCommand,
  KeyboardKeys,
} from "@/settings/keyboardSettings";
import { RootState } from "@/store";

export const selectKeyboardSettings = (state: RootState) =>
  state.settings.data.keyboard;

type GameCommandsObject = Record<keyof typeof GameCommands, KeyboardKeys>;
export const selectGameCommands = createSelector(
  (state: RootState) => state.settings.data.keyboard.keys,
  (keys: KeyboardCommand[]) => {
    return keys.reduce(
      (prev, { command, ...others }) => ({
        ...prev,
        [command]: others,
      }),
      {} as GameCommandsObject,
    );
  },
);

export const selectAudioSettings = (state: RootState) =>
  state.settings.data.audio;

export const selectProcessing = (state: RootState) => state.settings.processing;

export const selectError = (state: RootState) => state.settings.error;

export const SettingsSelectors = {
  selectKeyboardSettings,
  selectAudioSettings,
  selectGameCommands,
  selectProcessing,
  selectError,
};
