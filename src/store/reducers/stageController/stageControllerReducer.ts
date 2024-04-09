import { createReducer } from "@reduxjs/toolkit";

import { StageControllerActions } from "./stageControllerActions";

export enum StageStatus {
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

export interface StageController {
  name: string;
  substage?: Substage;
  allSubstage: Substage[];
  checkpoint?: Substage;
  status: StageStatus;
}

interface StageControllerState extends StageController {}

const initialState: StageControllerState = {
  name: "",
  allSubstage: [],
  status: StageStatus.Idle,
};

const { load, nextSubstage, selectSubstage, setCheckpoint, setStatus, unload } =
  StageControllerActions;

const stageControllerReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(load, (state, action) => {
      state.name = action.payload.name;
      state.allSubstage = action.payload.allSubstage;

      state.checkpoint = action.payload.allSubstage[0];
      state.substage = action.payload.allSubstage[0];
    })
    .addCase(unload, (state) => {
      state = initialState;
    })
    .addCase(setCheckpoint, (state, action) => {
      state.checkpoint = action.payload;
    })
    .addCase(setStatus, (state, action) => {
      state.status = action.payload;
    })
    .addCase(nextSubstage, (state) => {
      const index = state.allSubstage.findIndex(
        ({ id }) => id === state.substage?.id,
      );

      if (index !== -1) {
        const next = state.allSubstage.at(index + 1);

        if (next) {
          state.substage = next;
        }
      }
    })
    .addCase(selectSubstage, (state, action) => {
      const selected = state.allSubstage.find(
        ({ id }) => action.payload === id,
      );

      if (selected) {
        state.substage = selected;
      }
    });
});

export default stageControllerReducer;
