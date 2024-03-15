import { act, renderHook } from "@testing-library/react-native";

import { useTimeoutUI } from "@/hooks";

describe("testing useTimeoutUI - Hook tests", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("Should run the timer", async () => {
    const hook = renderHook(() => useTimeoutUI(1000));

    act(() => {
      hook.result.current.run();
    });
    jest.advanceTimersByTime(500);
    expect(hook.result.current.result.value).toBeTruthy();

    jest.advanceTimersByTime(501);
    expect(hook.result.current.result.value).toBeFalsy();
    await act(() => {
      hook.result.current.run();
    });
    jest.advanceTimersByTime(500);
    expect(hook.result.current.result.value).toBeTruthy();
  });

  it("Shouldn't run the timer when it is still running", async () => {
    const hook = renderHook(() => useTimeoutUI(1000));

    await act(() => {
      hook.result.current.run();
    });
    jest.advanceTimersByTime(800);
    expect(hook.result.current.result.value).toBeTruthy();

    await act(() => {
      hook.result.current.run();
    });
    jest.advanceTimersByTime(400);
    expect(hook.result.current.result.value).toBeFalsy();
  });
});
