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
  AudioSettings,
  AppThunkOptions
>("settings/saveAudioSettings", async (audioSetting, { getState }) => {
  const value = getState().settings.data;
  await SettingsDatabaseProvider.set({ ...value, audio: audioSetting });
  return audioSetting;
});

const saveKeyboardSettings = createAsyncThunk<
  KeyboardSettings,
  KeyboardSettings,
  AppThunkOptions
>("settings/saveKeyboardSettings", async (keyboardSettings, { getState }) => {
  const value = getState().settings.data;
  await SettingsDatabaseProvider.set({ ...value, keyboard: keyboardSettings });
  return keyboardSettings;
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

export const SettingsActions = {
  resetKeyboardSettings,
  saveAudioSettings,
  saveKeyboardSettings,
  initialize,
};
