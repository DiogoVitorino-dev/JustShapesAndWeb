import { runOnUI, useSharedValue, withDelay, withTiming } from "react-native-reanimated";

/**
 * Specify a duration during which the returned ``result`` will be set to true.
 * @param timeout Duration that the ``result`` will be set to true.
 * @returns `result` which will be true when the timer is running, `run` to start the timer.
 */

export const useTimeoutUI = (timeout = 100) => {
  const result = useSharedValue(0);

  const run = runOnUI(() => {
    if (!result.value) {
      result.value = 1;
      result.value = withDelay(timeout, withTiming(0, { duration: 0 }));
    }
  });

  return { run, result };
};
