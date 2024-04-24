export interface Timer {
  /**
   * This object is created internally and is returned from `setTimeout()` and `setInterval()`. It can be passed to either `clearTimeout()` or `clearInterval()` in order to cancel the
   * scheduled actions.
   *
   * By default, when a timer is scheduled using either `setTimeout()` or `setInterval()`, the Node.js event loop will continue running as long as the
   * timer is active. Each of the `Timeout` objects returned by these functions
   * export both `timeout.ref()` and `timeout.unref()` functions that can be used to
   * control this default behavior.
   */
  data?: NodeJS.Timeout;

  /**
   * @DocMissing
   */
  stop: () => void;

  /**
   * @DocMissing
   */
  resume: () => void;

  /**
   * @DocMissing
   */
  clear: () => void;
}

export type SetTimer = (callback: () => void, timeout: number) => Timer;

const setTimer: SetTimer = (callback, timeout) => {
  let data: NodeJS.Timeout | undefined;
  let start = timeout;
  let remaining = timeout;

  const stop = () => {
    if (data) {
      clearTimeout(data);
      data = undefined;
      remaining -= Date.now() - start;
    }
  };

  const clear = () => {
    if (data) {
      clearTimeout(data);
      data = undefined;
      remaining = -1;
    }
  };

  const resume = () => {
    if (!data && remaining >= 0) {
      start = Date.now();
      data = setTimeout(callback, remaining);
    }
  };

  resume();

  return { clear, resume, stop, data };
};

/**
 * @DocMissing
 */
export const TimerUtils = {
  /**
   * @DocMissing
   */
  setTimer,
};
