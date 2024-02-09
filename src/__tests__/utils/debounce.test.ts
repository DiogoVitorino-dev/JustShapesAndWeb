import { act, renderHook } from "@testing-library/react-native";

import { useDebounceValueUI } from "@/utils/debounceUtils";

describe("testing useDebounceValueUI - Debounce Utils tests", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("Should run the timer", () => {
    const debounce = renderHook(() => useDebounceValueUI(1000));

    debounce.result.current.runTimer();
    jest.advanceTimersByTime(500);
    expect(debounce.result.current.debounce.value).toBeTruthy();

    jest.advanceTimersByTime(500);
    expect(debounce.result.current.debounce.value).toBeFalsy();

    debounce.result.current.runTimer();
    jest.advanceTimersByTime(500);
    expect(debounce.result.current.debounce.value).toBeTruthy();
  });

  it("Shouldn't run the timer when it is still running", () => {
    const debounce = renderHook(() => useDebounceValueUI(1000));

    debounce.result.current.runTimer();
    jest.advanceTimersByTime(800);
    expect(debounce.result.current.debounce.value).toBeTruthy();

    debounce.result.current.runTimer();
    jest.advanceTimersByTime(400);
    expect(debounce.result.current.debounce.value).toBeFalsy();
  });
});
