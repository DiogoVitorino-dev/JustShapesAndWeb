import { createAction } from "@reduxjs/toolkit";

import type { SubstagesState, Substage } from "./substagesReducer";

export type LoadedSubstagesPayload = Pick<SubstagesState, "stage"> & {
  substages: Substage[];
};
const loaded = createAction<LoadedSubstagesPayload>("substages/loaded");

const unloaded = createAction("substages/unloaded");

export const SubstageActions = {
  /**
   * @DocMissing
   */
  loaded,

  /**
   * @DocMissing
   */
  unloaded,
};
