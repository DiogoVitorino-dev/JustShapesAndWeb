import { createAsyncThunk } from "@reduxjs/toolkit";

import { SettingsDatabaseProvider } from "@/database/providers";
import { DefaultSettings, Settings } from "@/settings";
import { AudioSettings } from "@/settings/audioSettings";
import { KeyboardSettings } from "@/settings/keyboardSettings";
import { AppThunkOptions } from "@/store";

const initialize = createAsyncThunk<Settings | null, void, AppThunkOptions>(
  "settings/initialize",
  async (_) => {
    const settings = await SettingsDatabaseProvider.get();

    if (!settings) {
      await SettingsDatabaseProvider.set(DefaultSettings);
    }

    return settings;
  },
);

const saveAudioSettings = createAsyncThunk<
  AudioSettings,
  Partial<AudioSettings>,
  AppThunkOptions
>("settings/saveAudioSettings", async (partialSettings, { getState }) => {
  const { audio, ...others } = getState().settings.data;
  const newSettings: AudioSettings = { ...audio, ...partialSettings };

  await SettingsDatabaseProvider.set({ ...others, audio: newSettings });
  return newSettings;
});

const saveKeyboardSettings = createAsyncThunk<
  KeyboardSettings,
  Partial<KeyboardSettings>,
  AppThunkOptions
>("settings/saveKeyboardSettings", async (partialSettings, { getState }) => {
  const { keyboard, ...others } = getState().settings.data;
  const newSettings: KeyboardSettings = { ...keyboard, ...partialSettings };

  await SettingsDatabaseProvider.set({ ...others, keyboard: newSettings });
  return newSettings;
});

const resetKeyboardSettings = createAsyncThunk<
  KeyboardSettings,
  void,
  AppThunkOptions
>("settings/resetKeyboardSettings", async (_, { getState }) => {
  const value = getState().settings.data;
  await SettingsDatabaseProvider.set({
    ...value,
    keyboard: DefaultSettings.keyboard,
  });
  return DefaultSettings.keyboard;
});

const resetAudioSettings = createAsyncThunk<
  AudioSettings,
  void,
  AppThunkOptions
>("settings/resetAudioSettings", async (_, { getState }) => {
  const value = getState().settings.data;
  await SettingsDatabaseProvider.set({
    ...value,
    audio: DefaultSettings.audio,
  });
  return DefaultSettings.audio;
});

export const SettingsActions = {
  resetAudioSettings,
  resetKeyboardSettings,
  saveAudioSettings,
  saveKeyboardSettings,
  initialize,
};
