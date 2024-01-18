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

const {
  saveAudioSettings,
  saveKeyboardSettings,
  initialize,
  resetAudioSettings,
  resetKeyboardSettings,
} = SettingsActions;

const isAPendingAction = isPending(
  saveAudioSettings,
  saveKeyboardSettings,
  resetAudioSettings,
  resetKeyboardSettings,
  initialize,
);
const isARejectedAction = isRejected(
  saveAudioSettings,
  saveKeyboardSettings,
  resetAudioSettings,
  resetKeyboardSettings,
  initialize,
);
const isAFulfilledAction = isFulfilled(
  saveAudioSettings,
  saveKeyboardSettings,
  resetAudioSettings,
  resetKeyboardSettings,
  initialize,
);

const isAUpdateAudioAction = isFulfilled(resetAudioSettings, saveAudioSettings);

const isAUpdateKeyboardAction = isFulfilled(
  resetKeyboardSettings,
  saveKeyboardSettings,
);

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers(builder) {
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

    builder.addMatcher(isAUpdateAudioAction, (state, action) => {
      state.data.audio = action.payload;
    });
    builder.addMatcher(isAUpdateKeyboardAction, (state, action) => {
      state.data.keyboard = action.payload;
    });

    builder.addMatcher(isAPendingAction, (state) => {
      state.processing = true;
    });
    builder.addMatcher(isARejectedAction, (state, action) => {
      state.error = action.error;
      state.processing = false;
    });
    builder.addMatcher(isAFulfilledAction, (state) => {
      state.processing = false;
    });
  },
});

export default settingsSlice.reducer;
