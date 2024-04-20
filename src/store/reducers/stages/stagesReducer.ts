import { createReducer } from "@reduxjs/toolkit";

import { StageActions } from "./stagesActions";

export enum StageStatus {
  Idle,
  Paused,
  Playing,
  Failed,
  Completed,
}

export interface StagesState {
  /**
   * @DocMissing
   */
  name: string;

  /**
   * @DocMissing
   */
  substage?: number;

  /**
   * @DocMissing
   */
  checkpoint?: number;

  /**
   * @DocMissing
   */
  status: StageStatus;
}

const initialState: StagesState = {
  name: "",
  status: StageStatus.Idle,
};

const {
  loaded,
  unloaded,
  chosenSubstage,
  restartedFromCheckpoint,
  checkpointReached,
  statusUpdated,
} = StageActions;

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loaded, (state, action) => {
      state.name = action.payload.name;
      state.substage = action.payload.substage;
    })
    .addCase(unloaded, (state) => {
      state = initialState;
    })
    .addCase(checkpointReached, (state, action) => {
      state.checkpoint = action.payload;
    })
    .addCase(restartedFromCheckpoint, (state) => {
      state.substage = state.checkpoint;
    })
    .addCase(statusUpdated, (state, action) => {
      state.status = action.payload;
    })
    .addCase(chosenSubstage, (state, action) => {
      state.substage = action.payload;
    });
});

export default reducer;
