import { substagesAdapter } from "./substagesReducer";

import { RootState } from "@/store";

const selectStageName = (state: RootState) => state.substage.stage;

const selectStatus = (state: RootState) => state.substage.status;

const selectCurrent = (state: RootState) => state.substage.current;

const selectCheckpoint = (state: RootState) => state.substage.checkpoint;

const {
  selectAll: selectAllSubstages,
  selectById: selectSubstageById,
  selectIds: selectSubstageIds,
} = substagesAdapter.getSelectors((state: RootState) => state.substage);

export const SubstagesSelectors = {
  /**
   * @DocMissing
   */
  selectStageName,

  /**
   * @DocMissing
   */
  selectCurrent,

  /**
   * @DocMissing
   */
  selectCheckpoint,

  /**
   * @DocMissing
   */
  selectStatus,

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
};
