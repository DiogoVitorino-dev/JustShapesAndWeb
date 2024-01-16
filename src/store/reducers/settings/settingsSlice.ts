import {
  SerializedError,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";

import { SettingsActions } from "./settingsActions";

import { DefaultSettings, Settings } from "@/settings";

export interface SettingsReducerState {
  initialized: boolean;
  processing: boolean;
  data: Settings;
  error?: SerializedError;
}

const initialState: SettingsReducerState = {
  initialized: false,
  processing: false,
  data: DefaultSettings,
};

const { saveAudioSettings, saveKeyboardSettings, initialize } = SettingsActions;

const isAPendingAction = isPending(
  saveAudioSettings,
  saveKeyboardSettings,
  initialize,
);
const isARejectedAction = isRejected(
  saveAudioSettings,
  saveKeyboardSettings,
  initialize,
);
const isAFulfilledAction = isFulfilled(
  saveAudioSettings,
  saveKeyboardSettings,
  initialize,
);

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(saveAudioSettings.fulfilled, (state, action) => {
      state.data.audio = action.payload;
    });
    builder.addCase(saveKeyboardSettings.fulfilled, (state, action) => {
      state.data.keyboard = action.payload;
    });

    builder.addCase(initialize.fulfilled, (state, action) => {
      if (!state.initialized) {
        state.initialized = true;
      }

      if (action.payload) {
        state.data = action.payload;
      }
    });
    builder.addCase(initialize.rejected, (state) => {
      if (!state.initialized) {
        state.initialized = true;
      }
    });

    builder.addMatcher(isAPendingAction, (state) => {
      state.processing = true;
    });
    builder.addMatcher(isARejectedAction, (state, action) => {
      state.error = action.error;
    });
    builder.addMatcher(isAFulfilledAction, (state) => {
      state.processing = false;
    });
  },
});

export default settingsSlice.reducer;
