import { configureStore } from "@reduxjs/toolkit";

import playerReducer from "./reducers/player/playerReducer";
import settingsSlice from "./reducers/settings/settingsSlice";
import stageReducer from "./reducers/stages/stagesReducer";
import substageReducer from "./reducers/substages/substagesReducer";

export const store = configureStore({
  reducer: {
    settings: settingsSlice,
    player: playerReducer,
    substage: substageReducer,
    stage: stageReducer,
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
