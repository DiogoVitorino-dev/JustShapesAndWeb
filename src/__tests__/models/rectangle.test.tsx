import {
  act,
  render,
  renderHook,
  waitFor,
} from "@testing-library/react-native";
import { useSharedValue } from "react-native-reanimated";
import { getAnimatedStyle } from "react-native-reanimated/src/reanimated2/jestUtils";
import { CrashTestObjectData, CrashTestObject } from "test-utils";

import Rectangle, { RectangleData } from "@/models/geometric/rectangle";
import CollisionSystemProvider from "@/scripts/collision/collisionSystemProvider";

describe("Rectangle - Model tests", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("Should move a model", () => {
    const data = renderHook(() =>
      useSharedValue<RectangleData>({ x: 10, y: 10 }),
    );
    const { getByTestId } = render(<Rectangle data={data.result.current} />);

    const view = getByTestId("rectangleModel");

    data.result.current.value = { x: 50, y: 100, angle: 90 };

    jest.advanceTimersByTime(1000);

    expect(view).toHaveAnimatedStyle({
      left: 50,
      top: 100,
    });
  });

  it("Should change angle", () => {
    const data = renderHook(() =>
      useSharedValue<RectangleData>({ x: 10, y: 10 }),
    );
    const { getByTestId } = render(<Rectangle data={data.result.current} />);

    data.result.current.value = { angle: 90 };

    jest.advanceTimersByTime(1500);

    const style = getAnimatedStyle(getByTestId("rectangleModel"));

    expect(style.transform[0].rotate).toStrictEqual("90deg");
  });

  it("Should change size", () => {
    const data = renderHook(() =>
      useSharedValue<RectangleData>({ width: 50, height: 50 }),
    );
    const { getByTestId } = render(<Rectangle data={data.result.current} />);

    data.result.current.value = { width: 100, height: 150 };

    jest.advanceTimersByTime(1000);

    const style = getAnimatedStyle(getByTestId("rectangleModel"));

    expect(style.width).toBe(100);
    expect(style.height).toBe(150);
  });

  it.each([
    ["Should collide", 200],
    ["Should not collide", 100],
  ])("%s", async (_, x) => {
    const dataTestObject: CrashTestObjectData = { x: 300 };
    const data = renderHook(() =>
      useSharedValue<RectangleData>({
        width: 100,
        height: 100,
        x: 0,
        y: 0,
        collidable: { enabled: true },
      }),
    );

    const { getByText } = render(
      <CollisionSystemProvider>
        <CrashTestObject data={dataTestObject} />
        <Rectangle data={data.result.current} collisionMode="target" />
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
