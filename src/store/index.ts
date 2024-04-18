import { configureStore } from "@reduxjs/toolkit";

import playerReducer from "./reducers/player/playerReducer";
import settingsSlice from "./reducers/settings/settingsSlice";
import substageReducer from "./reducers/substages/substagesReducer";

export const store = configureStore({
  reducer: {
    settings: settingsSlice,
    player: playerReducer,
    substage: substageReducer,
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
