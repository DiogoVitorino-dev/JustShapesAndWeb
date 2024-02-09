import { runOnUI, useSharedValue } from "react-native-reanimated";

/**
 * Specify a duration during which the returned ``SharedValue`` will be set to true.
 * @param timeout Duration that the ``SharedValue`` will be set to true.
 * @returns `SharedValue` which will be true when the timer is running, `runTimer` to start the timer.
 */

export const useDebounceValueUI = (timeout: number) => {
  const debounce = useSharedValue(false);

  const runTimer = runOnUI(() => {
    "worklet";

    if (!debounce.value) {
      debounce.value = true;
      setTimeout(() => {
        "worklet";
        debounce.value = false;
      }, timeout);
    }
  });

  return { debounce, runTimer };
};
