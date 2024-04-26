import { useContext } from "react";

import { StageControllerContext } from "@/scripts/stageController/stageControllerProvider";

/**
 * @returns React Context hook that provides stage and substage management and UI feedback
 */
export const useStageController = () => useContext(StageControllerContext);
