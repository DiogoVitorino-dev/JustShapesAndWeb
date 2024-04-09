import { RootState } from "@/store";

const selectName = (state: RootState) => state.stageController.name;

const selectStatus = (state: RootState) => state.stageController.status;

const selectSubstage = (state: RootState) => state.stageController.substage;

const selectLastCheckpoint = (state: RootState) =>
  state.stageController.checkpoint;

const selectAllSubstage = (state: RootState) =>
  state.stageController.allSubstage;

export const StageControllerSelectors = {
  selectName,
  selectSubstage,
  selectLastCheckpoint,
  selectAllSubstage,
  selectStatus,
};
