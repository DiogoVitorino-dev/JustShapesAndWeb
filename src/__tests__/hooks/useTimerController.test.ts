import {
  RenderHookResult,
  act,
  renderHook,
} from "@testing-library/react-native";

import { useTimerController, TimerController } from "@/hooks";
import { TimerUtils } from "@/utils/timerUtils";

describe("testing useTimerController - Hook tests", () => {
  const { setTimer } = TimerUtils;
  let hook: RenderHookResult<TimerController, unknown>;
  const callback_1 = jest.fn(() => {});
  const callback_2 = jest.fn(() => {});

  beforeEach(async () => {
    jest.useFakeTimers();

    hook = renderHook(() => useTimerController());

    await act(() => {
      hook.result.current.addTimer(setTimer(callback_1, 1000), 5);
      hook.result.current.addTimer(setTimer(callback_2, 2000), 10);
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    callback_1.mockClear();
    callback_2.mockClear();
  });

  const testTimersIDS = (ids: number[] = []) =>
    expect(hook.result.current.timers.current.map((timer) => timer.id)).toEqual(
      ids,
    );

  it("Timers should have been added", async () => {
    testTimersIDS([5, 10]);

    jest.advanceTimersByTime(1000);

    expect(callback_1).toHaveBeenCalled();
    expect(callback_2).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);
    expect(callback_2).toHaveBeenCalled();
  });

  it("Should remove timers", async () => {
    hook.result.current.removeTimer();

    jest.advanceTimersByTime(2000);

    expect(callback_1).not.toHaveBeenCalled();
    expect(callback_2).not.toHaveBeenCalled();

    testTimersIDS();
  });

  it("Should remove timer by id", async () => {
    hook.result.current.removeTimer(5);

    jest.advanceTimersByTime(2000);

    expect(callback_1).not.toHaveBeenCalled();
    expect(callback_2).toHaveBeenCalled();

    testTimersIDS([10]);
  });

  it("Should pause timer", async () => {
    hook.result.current.pauseTimer();

    jest.advanceTimersByTime(2000);

    expect(callback_1).not.toHaveBeenCalled();
    expect(callback_2).not.toHaveBeenCalled();

    testTimersIDS([5, 10]);
  });

  it("Should pause timer by id", async () => {
    hook.result.current.pauseTimer(10);

    jest.advanceTimersByTime(2000);

    expect(callback_1).toHaveBeenCalled();
    expect(callback_2).not.toHaveBeenCalled();

    testTimersIDS([5, 10]);
  });

  it("Should resume timers", async () => {
    hook.result.current.pauseTimer();

    jest.advanceTimersByTime(2000);

    expect(callback_1).not.toHaveBeenCalled();
    expect(callback_2).not.toHaveBeenCalled();

    hook.result.current.resumeTimer();

    jest.advanceTimersByTime(2000);
    expect(callback_1).toHaveBeenCalled();
    expect(callback_2).toHaveBeenCalled();

    testTimersIDS([5, 10]);
  });

  it("Should resume timer by id", async () => {
    hook.result.current.pauseTimer();

    jest.advanceTimersByTime(2000);

    expect(callback_1).not.toHaveBeenCalled();

    hook.result.current.resumeTimer(5);

    jest.advanceTimersByTime(1000);

    expect(callback_1).toHaveBeenCalled();
    expect(callback_2).not.toHaveBeenCalled();

    testTimersIDS([5, 10]);
  });

  it("Should set the timer (removing existing and adding new timer)", async () => {
    const callback_3 = jest.fn(() => {});
    hook.result.current.setTimer(setTimer(callback_3, 1000), 50);

    jest.advanceTimersByTime(2000);

    expect(callback_1).not.toHaveBeenCalled();
    expect(callback_2).not.toHaveBeenCalled();
    expect(callback_3).toHaveBeenCalled();

    testTimersIDS([50]);
  });

  it("Should advance the timers", async () => {
    hook.result.current.advanceTimer([5, 10], 500);

    jest.advanceTimersByTime(500);

    expect(callback_1).toHaveBeenCalled();
    expect(callback_2).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);

    expect(callback_2).toHaveBeenCalled();

    testTimersIDS([5, 10]);
  });

  it("Should upsert timer", async () => {
    const callback_3 = jest.fn(() => {});
    hook.result.current.upsertTimer(setTimer(callback_3, 3000), 5);

    jest.advanceTimersByTime(2000);

    expect(callback_1).not.toHaveBeenCalled();
    expect(callback_3).not.toHaveBeenCalled();
    expect(callback_2).toHaveBeenCalled();

    jest.advanceTimersByTime(1000);

    expect(callback_3).toHaveBeenCalled();

    testTimersIDS([5, 10]);
  });
});
