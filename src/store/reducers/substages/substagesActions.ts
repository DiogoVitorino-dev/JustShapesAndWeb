import { createAction } from "@reduxjs/toolkit";

import type { SubstagesState, SubstageStatus } from "./substagesReducer";

const loaded =
  createAction<Pick<SubstagesState, "stage" | "entities">>("substages/loaded");

const checkpointReached = createAction<number>("substages/checkpointReached");

const restartedFromCheckpoint = createAction(
  "substages/restartedFromCheckpoint",
);

const nextSubstageReached = createAction("substages/nextSubstageReached");

const chosenSubstage = createAction<number>("substages/chosenSubstage");

const statusUpdated = createAction<SubstageStatus>("substages/statusUpdated");

const unloaded = createAction("substages/unloaded");

export const SubstageActions = {
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
  nextSubstageReached,

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
