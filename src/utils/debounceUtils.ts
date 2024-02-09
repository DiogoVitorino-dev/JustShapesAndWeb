import { useSharedValue, withDelay, withTiming } from "react-native-reanimated";

/**
 * Specify a duration during which the returned ``SharedValue`` will be set to true.
 * @param timeout Duration that the ``SharedValue`` will be set to true.
 * @returns `SharedValue` which will be true when the timer is running, `runTimer` to start the timer.
 */

export const useDebounceValueUI = (timeout: number) => {
  const debounce = useSharedValue(0);

  const runTimer = () => {
    "worklet";

    if (!debounce.value) {
      debounce.value = 1;
      debounce.value = withDelay(timeout, withTiming(0, { duration: 0 }));
    }
  };

  return { debounce, runTimer };
};
