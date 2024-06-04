import { act, render, renderHook } from "@testing-library/react-native";
import { useWindowDimensions } from "react-native";
import { getAnimatedStyle } from "react-native-reanimated/src/reanimated2/jestUtils";

import { Beam, BeamConfig } from "@/animations/attacks/beam";

describe("Beam attack - Animation tests", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it("Should run animation", async () => {
    const { getByTestId } = render(
      <Beam attackDuration={500} prepareDuration={500} size={100} start />,
    );
    const view = getByTestId("rectangleModel");
    let style!: Record<string, any>;

    await act(() => {
      jest.advanceTimersByTime(500);
      style = getAnimatedStyle(view);
    });

    expect(style.height).toBeCloseTo(50);

    await act(() => {
      jest.advanceTimersByTime(500);
      style = getAnimatedStyle(view);
    });

    expect(style.height).toBeCloseTo(100);
  });

  it("Should render with correct initial values", async () => {
    const window = renderHook(() => useWindowDimensions());
    const { getByTestId } = render(
      <Beam
        size={100}
        angle={0}
        x={200}
        y={200}
        direction="horizontal"
        start={false}
      />,
    );
    const view = getByTestId("rectangleModel");
    const indicator = getByTestId("beamIndicator");

    let style = getAnimatedStyle(view);
    let indicatorStyle = getAnimatedStyle(indicator);

    expect(style.width).toBe(window.result.current.width);
    expect(style.height).toBe(0);
    expect(style.opacity).toBe(0);

    expect(indicatorStyle.width).toBe(window.result.current.width);
    expect(indicatorStyle.height).toBe(100);
    expect(indicatorStyle.opacity).toBe(0);
    expect(indicatorStyle.top).toBe(200);
    expect(indicatorStyle.left).toBe(200);

    const rerender = render(
      <Beam
        size={100}
        angle={0}
        x={200}
        y={200}
        direction="vertical"
        start={false}
      />,
    );

    style = getAnimatedStyle(rerender.getByTestId("rectangleModel"));
    indicatorStyle = getAnimatedStyle(rerender.getByTestId("beamIndicator"));

    expect(style.width).toBe(0);
    expect(style.height).toBe(window.result.current.height);

    expect(indicatorStyle.height).toBe(window.result.current.height);
    expect(indicatorStyle.width).toBe(100);
  });

  it("Should hide after the attack", async () => {
    const { getByTestId } = render(
      <Beam prepareDuration={500} attackDuration={500} size={100} start />,
    );
    const view = getByTestId("rectangleModel");
    const indicator = getByTestId("beamIndicator");

    let style!: Record<string, any>;
    let indicatorStyle!: Record<string, any>;

    await act(() => {
      jest.advanceTimersByTime(1500);
      style = getAnimatedStyle(view);
      indicatorStyle = getAnimatedStyle(indicator);
    });

    expect(style.height).toBe(0);
    expect(style.opacity).toBe(0);
    expect(indicatorStyle.opacity).toBe(0);
  });

  it("Should prepare the attack", async () => {
    const { getByTestId } = render(
      <Beam prepareDuration={500} size={100} start />,
    );
    const view = getByTestId("rectangleModel");
    const indicator = getByTestId("beamIndicator");

    let style = getAnimatedStyle(view);
    let indicatorStyle = getAnimatedStyle(indicator);

    await act(() => {
      jest.advanceTimersByTime(490);
      style = getAnimatedStyle(view);
      indicatorStyle = getAnimatedStyle(indicator);
    });

    expect(style.opacity).toBeCloseTo(0.7);
    expect(indicatorStyle.opacity).toBeCloseTo(0.2);

    await act(() => {
      jest.advanceTimersByTime(10);
      style = getAnimatedStyle(view);
    });

    expect(style.height).toBeCloseTo(100 / 2);
  });

  it("Should perform the attack", async () => {
    const { getByTestId } = render(
      <Beam prepareDuration={500} attackDuration={500} size={100} start />,
    );
    const view = getByTestId("rectangleModel");
    const indicator = getByTestId("beamIndicator");
    let indicatorStyle = getAnimatedStyle(indicator);
    let style = getAnimatedStyle(view);

    await act(() => {
      jest.advanceTimersByTime(1000);
      style = getAnimatedStyle(getByTestId("rectangleModel"));
      indicatorStyle = getAnimatedStyle(getByTestId("beamIndicator"));
    });

    expect(style.height).toBeCloseTo(100);
    expect(style.opacity).toBeCloseTo(1);
    expect(indicatorStyle.opacity).toBeCloseTo(0);
  });

  it("Should attack with correct attack speed", async () => {
    const { getByTestId } = render(
      <Beam prepareDuration={500} size={100} attackSpeed={500} start />,
    );
    const view = getByTestId("rectangleModel");

    let style = getAnimatedStyle(view);

    await act(() => {
      jest.advanceTimersByTime(500);
      style = getAnimatedStyle(view);
    });

    expect(style.height).toBeCloseTo(50);

    await act(() => {
      jest.advanceTimersByTime(500);
      style = getAnimatedStyle(view);
    });

    expect(style.height).toBeCloseTo(100);
  });

  it("Should call onFinish when the animation finishes", async () => {
    const callback = jest.fn(() => {});

    render(
      <Beam
        attackDuration={500}
        prepareDuration={500}
        onFinish={callback}
        start
      />,
    );

    await act(() => {
      jest.advanceTimersByTime(800);
    });

    expect(callback).not.toHaveBeenCalled();

    await act(() => {
      jest.runAllTimers();
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it.each(["vertical", "horizontal"])(
    "Should attack in a %s direction",
    async (direction) => {
      const { getByTestId } = render(
        <Beam
          size={100}
          attackDuration={500}
          prepareDuration={500}
          attackSpeed={150}
          direction={direction as BeamConfig["direction"]}
          start
        />,
      );
      const view = getByTestId("rectangleModel");

      let style = getAnimatedStyle(view);

      if (direction === "vertical") {
        await act(() => {
          jest.advanceTimersByTime(500);
          style = getAnimatedStyle(view);
        });

        expect(style.width).toBeCloseTo(50);

        await act(() => {
          jest.advanceTimersByTime(500);
          style = getAnimatedStyle(view);
        });

        expect(style.width).toBeCloseTo(100);
      } else {
        await act(() => {
          jest.advanceTimersByTime(500);
          style = getAnimatedStyle(view);
        });

        expect(style.height).toBeCloseTo(50);

        await act(() => {
          jest.advanceTimersByTime(650);
          style = getAnimatedStyle(view);
        });

        expect(style.height).toBeCloseTo(100);
      }
    },
  );

  it.each(["vertical", "horizontal"])(
    "Should set the length in the %s direction",
    async (direction) => {
      const { getByTestId } = render(
        <Beam
          direction={direction as BeamConfig["direction"]}
          length={100}
          start={false}
        />,
      );
      const view = getByTestId("rectangleModel");
      const indicator = getByTestId("beamIndicator");

      const style = getAnimatedStyle(view);
      const styleIndicator = getAnimatedStyle(indicator);

      if (direction === "vertical") {
        expect(style.height).toBeCloseTo(100);
        expect(style.width).toBeCloseTo(0);
        expect(styleIndicator.height).toBeCloseTo(100);
      } else {
        expect(style.width).toBeCloseTo(100);
        expect(style.height).toBeCloseTo(0);
        expect(styleIndicator.width).toBeCloseTo(100);
      }
    },
  );

  it("Should repeat the animation", async () => {
    const duration = 500 + 500 + 100 + 250;
    const { getByTestId } = render(
      <Beam
        size={100}
        prepareDuration={500}
        attackDuration={500}
        attackSpeed={100}
        numbersOfReps={2}
        start
      />,
    );

    const view = getByTestId("rectangleModel");
    let style = getAnimatedStyle(view);

    await act(() => {
      jest.advanceTimersByTime(duration);
      style = getAnimatedStyle(view);
    });

    expect(style.height).toBeCloseTo(0);

    await act(() => {
      jest.advanceTimersByTime(500);
      style = getAnimatedStyle(view);
    });

    expect(style.height).toBeCloseTo(50);
  });

  it("Should delay the animation", async () => {
    const { getByTestId } = render(
      <Beam
        size={100}
        prepareDuration={500}
        attackDuration={500}
        attackSpeed={100}
        delay={100}
        start
      />,
    );

    const view = getByTestId("rectangleModel");
    let style = getAnimatedStyle(view);

    await act(() => {
      jest.advanceTimersByTime(600);
      style = getAnimatedStyle(view);
    });

    expect(style.height).toBeCloseTo(50);
  });

  it("Should delay between repetitions", async () => {
    const duration = 500 + 500 + 100 + 250;
    const { getByTestId } = render(
      <Beam
        size={100}
        prepareDuration={500}
        attackDuration={500}
        attackSpeed={100}
        delayOfReps={100}
        numbersOfReps={2}
        start
      />,
    );

    const view = getByTestId("rectangleModel");
    let style = getAnimatedStyle(view);

    await act(() => {
      jest.advanceTimersByTime(duration);
    });

    await act(() => {
      jest.advanceTimersByTime(100);
    });

    await act(() => {
      jest.advanceTimersByTime(500);
    });

    style = getAnimatedStyle(view);
    expect(style.height).toBeCloseTo(50);
  });

  it.todo(
    "Should call onFinishEach when the animation ends between repeats BUG JEST",
  );
});
