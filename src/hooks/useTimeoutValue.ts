import { useState } from "react";

/**
 * Specify a duration during which the returned ``value`` will be set to true.
 * @param timeout Duration that the ``value`` will be set to true.
 * @returns `value` which will be true when the timer is running, `run` to start the timer.
 */

export function useTimeoutValue(timeout = 100) {
  const [value, setValue] = useState(false);

  const run = () => {
    setValue(true);
    setTimeout(() => setValue(false));
  };

  return {
    value,
    run,
  };
}
