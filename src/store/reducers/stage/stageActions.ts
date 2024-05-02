import { createAction } from "@reduxjs/toolkit";

import type { StageStatus } from "./stageReducer";

export type LoadedStagePayload = {
  name: string;
  initialSubstage: number;
};
const loaded = createAction<LoadedStagePayload>("stages/loaded");

const checkpointReached = createAction<number>("stages/checkpointReached");

const restartedFromCheckpoint = createAction("stages/restartedFromCheckpoint");

const chosenSubstage = createAction<number>("stages/chosenSubstage");

const statusUpdated = createAction<StageStatus>("stages/statusUpdated");

const unloaded = createAction("stages/unloaded");

export const StageActions = {
  /**
   * @DocMissing
   */
  loaded,

  /**
   * @DocMissing
   */
  checkpointReached,

  /**
   * @DocMissing
   */
  restartedFromCheckpoint,

  /**
   * @DocMissing
   */
  chosenSubstage,

  /**
   * @DocMissing
   */
  statusUpdated,

  /**
   * @DocMissing
   */
  unloaded,
};
