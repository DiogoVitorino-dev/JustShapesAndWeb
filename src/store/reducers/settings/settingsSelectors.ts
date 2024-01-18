import { RootState } from "@/store";

export const selectKeyboardSettings = (state: RootState) =>
  state.settings.data.keyboard;

export const selectAudioSettings = (state: RootState) =>
  state.settings.data.audio;

export const selectProcessing = (state: RootState) => state.settings.processing;

export const selectError = (state: RootState) => state.settings.error;

export const SettingsSelectors = {
  selectKeyboardSettings,
  selectAudioSettings,
  selectProcessing,
  selectError,
};