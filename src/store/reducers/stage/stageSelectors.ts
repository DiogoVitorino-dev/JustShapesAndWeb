import { RootState } from "@/store";

const selectName = (state: RootState) => state.stage.name;

const selectStatus = (state: RootState) => state.stage.status;

const selectSubstage = (state: RootState) => state.stage.substage;

const selectCheckpoint = (state: RootState) => state.stage.checkpoint;

export const StageSelectors = {
  /**
   * @DocMissing
   */
  selectName,

  /**
   * @DocMissing
   */
  selectSubstage,

  /**
   * @DocMissing
   */
  selectCheckpoint,

  /**
   * @DocMissing
   */
  selectStatus,
};
