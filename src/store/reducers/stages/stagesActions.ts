import { createAction } from "@reduxjs/toolkit";

import type { StagesState, StageStatus } from "./stagesReducer";

export type LoadedStagePayload = Required<
  Pick<StagesState, "name" | "substage">
>;
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
