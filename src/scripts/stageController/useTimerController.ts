import { useRef } from "react";

import { useAppSelector } from "@/hooks";
import { StageStatus } from "@/store/reducers/stage/stageReducer";
import { StageSelectors } from "@/store/reducers/stage/stageSelectors";
import { Timer } from "@/utils/timerUtils";

export const useTimerController = () => {
  const timers = useRef<Timer[]>([]);

  const status = useAppSelector(StageSelectors.selectStatus);

  const mapByMatch = (
    callback: (item: Timer) => Timer | undefined | null | void,
    array: Timer[],
  ) => {
    const current = timers.current;

    if (array.length !== 0) {
      array.forEach((item) => {
        const index = current.findIndex((currTimer) => currTimer === item);

        if (index !== -1) {
          const result = callback(current[index]);

          if (result) {
            current[index] = result;
          } else {
            current.splice(index, 1);
          }
        }
      });
    }
    return current;
  };

  const removeTimer = (...timer: Timer[]) => {
    if (timer.length !== 0) {
      timers.current = mapByMatch((item) => item.clear(), timer);
    } else {
      timers.current = timers.current.filter((item) => item.clear());
    }
  };

  const setTimer = (...timer: Timer[]) => {
    removeTimer();
    timers.current = timer;
  };

  const addTimer = (...timer: Timer[]) => {
    timers.current = [...timers.current, ...timer];
  };

  const pauseTimer = (...timer: Timer[]) => {
    if (timer.length !== 0) {
      timers.current = mapByMatch((item) => item.stop(), timer);
    } else {
      timers.current = timers.current.map((item) => {
        item.stop();
        return item;
      });
    }
  };

  const resumeTimer = (...timer: Timer[]) => {
    if (timer.length !== 0) {
      timers.current = mapByMatch((item) => item.resume(), timer);
    } else {
      timers.current = timers.current.map((item) => {
        item.resume();
        return item;
      });
    }
  };

  switch (status) {
    case StageStatus.Playing:
      resumeTimer();
      break;

    case StageStatus.Idle:
    case StageStatus.Paused:
      pauseTimer();
      break;

    default:
      removeTimer();
      break;
  }

  return {
    timers,

    setTimer,

    addTimer,

    removeTimer,

    pauseTimer,

    resumeTimer,
  };
};
