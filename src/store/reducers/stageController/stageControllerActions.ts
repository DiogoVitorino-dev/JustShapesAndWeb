import { createAction } from "@reduxjs/toolkit";

import type {
  StageController,
  Substage,
  StageStatus,
} from "./stageControllerReducer";

const load = createAction<Pick<StageController, "name" | "allSubstage">>(
  "stageController/load",
);

const setCheckpoint = createAction<Substage>("stageController/setCheckpoint");

const nextSubstage = createAction("stageController/nextSubstage");
const selectSubstage = createAction<number>("stageController/selectSubstage");

const setStatus = createAction<StageStatus>("stageController/setStatus");

const unload = createAction("stageController/unload");

export const StageControllerActions = {
  load,
  setCheckpoint,
  nextSubstage,
  selectSubstage,
  setStatus,
  unload,
};
