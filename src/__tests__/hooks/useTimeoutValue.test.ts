import { renderHook } from "@testing-library/react-native";

import { useTimeoutValue } from "@/hooks";

describe("testing useTimeoutValue - Debounce Utils tests", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("Should run the timer", () => {
    const hook = renderHook(() => useTimeoutValue(1000));

    hook.result.current.run();
    jest.advanceTimersByTime(500);
    expect(hook.result.current.value).toBeTruthy();

    jest.advanceTimersByTime(501);
    expect(hook.result.current.value).toBeFalsy();

    hook.result.current.run();
    jest.advanceTimersByTime(500);
    expect(hook.result.current.value).toBeTruthy();
  });

  it("Shouldn't run the timer when it is still running", () => {
    const hook = renderHook(() => useTimeoutValue(1000));

    hook.result.current.run();
    jest.advanceTimersByTime(800);
    expect(hook.result.current.value).toBeTruthy();

    hook.result.current.run();
    jest.advanceTimersByTime(400);
    expect(hook.result.current.value).toBeFalsy();
  });
});
