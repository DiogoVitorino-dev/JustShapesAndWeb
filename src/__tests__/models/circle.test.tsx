import {
  act,
  render,
  renderHook,
  waitFor,
} from "@testing-library/react-native";
import { useSharedValue } from "react-native-reanimated";
import { getAnimatedStyle } from "react-native-reanimated/src/reanimated2/jestUtils";
import { CrashTestObjectData, CrashTestObject } from "test-utils";

import Circle, { CircleData } from "@/models/geometric/circle";
import CollisionSystemProvider from "@/scripts/collision/collisionSystemProvider";

describe("Circle - Model tests", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("Should move a model", () => {
    const data = renderHook(() =>
      useSharedValue<CircleData>({
        x: 0,
        y: 0,
      }),
    );
    const { getByTestId } = render(<Circle data={data.result.current} />);

    const view = getByTestId("circleModel");

    data.result.current.value = { x: 50, y: 100 };

    jest.advanceTimersByTime(1000);

    expect(view).toHaveAnimatedStyle({
      left: 50,
      top: 100,
    });
  });

  it("Should change diameter", () => {
    const data = renderHook(() => useSharedValue<CircleData>({ diameter: 0 }));
    const { getByTestId } = render(<Circle data={data.result.current} />);

    data.result.current.value = { diameter: 90 };

    jest.advanceTimersByTime(1500);

    const style = getAnimatedStyle(getByTestId("circleModel"));

    expect(style.width).toStrictEqual(90);
    expect(style.height).toStrictEqual(90);
  });

  it.each([
    ["Should collide", 200],
    ["Should not collide", 100],
  ])("%s", async (_, x) => {
    const dataTestObject: CrashTestObjectData = { x: 300 };
    const data = renderHook(() =>
      useSharedValue<CircleData>({
        diameter: 100,
        x: 0,
        y: 0,
        collidable: { enabled: true },
      }),
    );

    const { getByText } = render(
      <CollisionSystemProvider>
        <CrashTestObject data={dataTestObject} />
        <Circle data={data.result.current} collisionMode="target" />
      </CollisionSystemProvider>,
    );

    await waitFor(() =>
      act(() => {
        data.result.current.value = { ...data.result.current.value, x };
        jest.advanceTimersByTime(100);
      }),
    );

    if (x >= 200) {
      expect(getByText("collided"));
    } else {
      expect(getByText("don't collided"));
    }
  });

  it.todo("should remove collision on unmount");
});
