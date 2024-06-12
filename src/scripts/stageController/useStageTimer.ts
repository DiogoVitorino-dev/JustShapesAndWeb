import { useAppSelector } from "@/hooks";
import { useTimerController } from "@/hooks/useTimerController";
import { StageStatus } from "@/store/reducers/stage/stageReducer";
import { StageSelectors } from "@/store/reducers/stage/stageSelectors";

export const useStageTimer = () => {
  const value = useTimerController();

  const status = useAppSelector(StageSelectors.selectStatus);

  switch (status) {
    case StageStatus.Playing:
      value.resumeTimer();
      break;

    case StageStatus.Idle:
    case StageStatus.Paused:
      value.pauseTimer();
      break;

    default:
      value.removeTimer();
      break;
  }

  return value;
};
