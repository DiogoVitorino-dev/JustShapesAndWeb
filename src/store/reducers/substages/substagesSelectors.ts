import { substagesAdapter } from "./substagesReducer";

import { RootState } from "@/store";

const selectStage = (state: RootState) => state.substage.stage;

const {
  selectAll: selectAllSubstages,
  selectById: selectSubstageById,
  selectIds: selectSubstageIds,
} = substagesAdapter.getSelectors((state: RootState) => state.substage);

export const SubstagesSelectors = {
  /**
   * @DocMissing
   */
  selectAllSubstages,

  /**
   * @DocMissing
   */
  selectSubstageById,

  /**
   * @DocMissing
   */
  selectSubstageIds,

  /**
   * @DocMissing
   */
  selectStage,
};
