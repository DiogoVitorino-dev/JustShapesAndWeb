import { createReducer, isAnyOf } from "@reduxjs/toolkit";

import { StageActions } from "./stagesActions";

export enum StageStatus {
  Idle = "IDLE",
  Paused = "PAUSED",
  Playing = "PLAYING",
  Failed = "FAILED",
  Completed = "COMPLETED",
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

const isActionWhilePlaying = isAnyOf(
  chosenSubstage,
  restartedFromCheckpoint,
  checkpointReached,
);

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loaded, (state, action) => {
      state.name = action.payload.name;
      state.substage = action.payload.initialSubstage;
      state.checkpoint = action.payload.initialSubstage;
      state.status = StageStatus.Idle;
    })
    .addCase(unloaded, (state) => {
      const { name, status } = initialState;
      state.name = name;
      state.status = status;
      state.checkpoint = undefined;
      state.substage = undefined;
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
    })
    .addMatcher(isActionWhilePlaying, (state) => {
      state.status = StageStatus.Playing;
    });
});

export default reducer;
