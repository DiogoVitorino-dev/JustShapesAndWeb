import { createEntityAdapter, createReducer } from "@reduxjs/toolkit";

import { SubstageActions } from "./substagesActions";

export enum SubstageStatus {
  Idle,
  Playing,
  Failed,
  Completed,
}

export interface Substage {
  id: number;

  /**
   * @DocMissing
   */
  musicStartTime: number;
}

interface SubstagesStateProps {
  /**
   * @DocMissing
   */
  stage: string;

  /**
   * @DocMissing
   */
  current?: Substage;

  /**
   * @DocMissing
   */
  checkpoint?: Substage;

  /**
   * @DocMissing
   */
  status: SubstageStatus;
}

export const substagesAdapter = createEntityAdapter<Substage>({
  sortComparer: (A, B) => A.id - B.id,
});

const initialState = substagesAdapter.getInitialState<SubstagesStateProps>({
  stage: "",
  status: SubstageStatus.Idle,
});

export type SubstagesState = typeof initialState;

const {
  loaded,
  unloaded,
  chosenSubstage,
  nextSubstageReached,
  restartedFromCheckpoint,
  checkpointReached,
  statusUpdated,
} = SubstageActions;

const substageReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loaded, (state, action) => {
      state.stage = action.payload.stage;
      substagesAdapter.setAll(state, action.payload.entities);

      state.checkpoint = action.payload.entities[0];
      state.current = action.payload.entities[0];
    })
    .addCase(unloaded, (state) => {
      state = initialState;
      substagesAdapter.removeAll(state);
    })
    .addCase(checkpointReached, (state, action) => {
      state.checkpoint = state.entities[action.payload];
    })
    .addCase(restartedFromCheckpoint, (state) => {
      state.current = state.checkpoint;
    })
    .addCase(statusUpdated, (state, action) => {
      state.status = action.payload;
    })
    .addCase(nextSubstageReached, (state) => {
      if (state.current) {
        const next = state.entities[state.current.id + 1];

        if (next) {
          state.current = next;
        }
      }
    })
    .addCase(chosenSubstage, (state, action) => {
      const selected = state.entities[action.payload];

      if (selected) {
        state.current = selected;
      }
    });
});

export default substageReducer;
