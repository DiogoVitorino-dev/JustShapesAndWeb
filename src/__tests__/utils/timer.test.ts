import { TimerUtils } from "@/utils/timerUtils";

describe("Testing setTimer - Timer Utils tests", () => {
  const { setTimer } = TimerUtils;
  const callback = jest.fn();

  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.useRealTimers();
    callback.mockClear();
  });

  it("Should call a callback when time runs out", () => {
    setTimer(callback, 1000);

    jest.advanceTimersByTime(500);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(499);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalled();
  });

  it("Should stop the timer", () => {
    const timer = setTimer(callback, 1000);

    jest.advanceTimersByTime(500);
    timer.stop();

    jest.advanceTimersByTime(500);
    expect(callback).not.toHaveBeenCalled();
  });

  it("Should resume timer", () => {
    const timer = setTimer(callback, 1000);

    jest.advanceTimersByTime(500);
    timer.stop();

    jest.advanceTimersByTime(500);
    timer.resume();

    jest.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalled();
  });

  it("Should clear timer", () => {
    const timer = setTimer(callback, 1000);

    jest.advanceTimersByTime(500);
    timer.clear();

    jest.advanceTimersByTime(500);
    expect(callback).not.toHaveBeenCalled();
  });

  it("Should not be resumed after timer is cleared", () => {
    const timer = setTimer(callback, 1000);

    jest.advanceTimersByTime(500);
    timer.clear();

    jest.advanceTimersByTime(500);
    timer.resume();

    jest.advanceTimersByTime(500);
    expect(callback).not.toHaveBeenCalled();
  });
});
