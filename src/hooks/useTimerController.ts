import { MutableRefObject, useEffect, useRef } from "react";

import { Timer } from "@/utils/timerUtils";

export type IdentifiableTimer = { id: number; timer: Timer };

export interface TimerController {
  timers: MutableRefObject<IdentifiableTimer[]>;
  setTimer: (timer: Timer, id?: number) => void;
  addTimer: (timer: Timer, id?: number) => void;
  removeTimer: (...ids: number[]) => void;
  pauseTimer: (...ids: number[]) => void;
  resumeTimer: (...ids: number[]) => void;
  advanceTimer: (id: number[] | number, ms?: number) => void;
  upsertTimer: (timer: Timer, id: number) => void;
}

export const useTimerController = (): TimerController => {
  const timers = useRef<IdentifiableTimer[]>([]);

  const generateUID = () => Math.floor(Date.now() * Math.random());

  const mapById = (
    callback: (
      item: IdentifiableTimer,
    ) => IdentifiableTimer | undefined | null | void,
    array: number[],
  ) => {
    const current = timers.current;

    if (array.length !== 0) {
      array.forEach((id) => {
        const index = current.findIndex((currTimer) => currTimer.id === id);

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

  const removeTimer: TimerController["removeTimer"] = (...ids) => {
    if (ids.length !== 0) {
      timers.current = mapById((item) => item.timer.clear(), ids);
    } else {
      timers.current = timers.current.filter((item) => item.timer.clear());
    }
  };

  const setTimer: TimerController["setTimer"] = (timer, id) => {
    removeTimer();
    timers.current = [{ id: id ? id : generateUID(), timer }];
  };

  const upsertTimer: TimerController["upsertTimer"] = (timer, id) => {
    let found = false;

    timers.current = mapById(
      (value) => {
        found = true;
        value.timer.clear();
        return { id, timer };
      },
      [id],
    );

    if (!found) {
      addTimer(timer, id);
    }
  };

  const addTimer: TimerController["addTimer"] = (timer, id) => {
    timers.current = [
      ...timers.current,
      { id: id ? id : generateUID(), timer },
    ];
  };

  const advanceTimer: TimerController["advanceTimer"] = (id, ms) => {
    const ids = typeof id === "number" ? [id] : id;
    timers.current = mapById((item) => {
      item.timer.advanceTime(ms);
      return item;
    }, ids);
  };

  const pauseTimer: TimerController["pauseTimer"] = (...ids) => {
    if (ids.length !== 0) {
      timers.current = mapById((item) => {
        item.timer.stop();
        return item;
      }, ids);
    } else {
      timers.current = timers.current.map((item) => {
        item.timer.stop();
        return item;
      });
    }
  };

  const resumeTimer: TimerController["resumeTimer"] = (...ids) => {
    if (ids.length !== 0) {
      timers.current = mapById((item) => {
        item.timer.resume();
        return item;
      }, ids);
    } else {
      timers.current = timers.current.map((item) => {
        item.timer.resume();
        return item;
      });
    }
  };

  useEffect(() => () => removeTimer(), []);

  return {
    timers,

    setTimer,

    addTimer,

    removeTimer,

    pauseTimer,

    resumeTimer,

    advanceTimer,

    upsertTimer,
  };
};
