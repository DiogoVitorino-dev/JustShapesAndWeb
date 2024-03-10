import { GameCommands, KeyboardKeys } from "@/settings/keyboardSettings";
import { RootState } from "@/store";

export const selectKeyboardSettings = (state: RootState) =>
  state.settings.data.keyboard;

export const selectGameCommands = (state: RootState) => {
  let commands!: Record<keyof typeof GameCommands, KeyboardKeys>;
  state.settings.data.keyboard.keys.forEach(({ command, ...others }) => {
    commands[command] = { ...others };
  });
  return commands;
};

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
