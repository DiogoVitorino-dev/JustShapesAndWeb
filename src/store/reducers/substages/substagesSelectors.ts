import { Substage, substagesAdapter } from "./substagesReducer";

import { RootState } from "@/store";

const selectStage = (state: RootState) => state.substages.stage;

const selectFirstSubstage = (
  state: RootState,
): Required<Substage> | undefined =>
  state.substages.entities[state.substages.ids[0]];

const {
  selectAll: selectAllSubstages,
  selectById: selectSubstageById,
  selectIds: selectSubstageIds,
} = substagesAdapter.getSelectors((state: RootState) => state.substages);

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

  /**
   * @DocMissing
   */
  selectFirstSubstage,
};
