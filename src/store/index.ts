import { configureStore } from "@reduxjs/toolkit";

import playerStatusReducer from "./reducers/playerStatus/playerStatusReducer";
import settingsSlice from "./reducers/settings/settingsSlice";
import stageControllerReducer from "./reducers/stageController/stageControllerReducer";

export const store = configureStore({
  reducer: {
    settings: settingsSlice,
    playerStatus: playerStatusReducer,
    stageController: stageControllerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunkOptions = {
  state: RootState;
  dispatch: AppDispatch;
  extra?: unknown;
  rejectValue?: unknown;
  serializedErrorType?: unknown;
  pendingMeta?: unknown;
  fulfilledMeta?: unknown;
  rejectedMeta?: unknown;
};
