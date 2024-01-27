import { renderHook } from "@testing-library/react-native";
import { useSharedValue } from "react-native-reanimated";

import {
  CollidableCircle,
  CollidableRectangle,
} from "@/scripts/collision/collision.types";
import { useCollisionSystem } from "@/scripts/collision/useCollisionSystem";

describe("Testing Rectangles (useCollisionSystem) - Collision scripts tests", () => {
  const callbackMock = jest.fn((collided: boolean) => {});
  const rectangleMock: CollidableRectangle = {
    shape: "RECTANGLE",
    angle: 0,
    width: 100,
    height: 100,
    x: 200,
    y: 200,
  };
  const circleMock: CollidableCircle = {
    shape: "CIRCLE",
    diameter: 100,
    x: 200,
    y: 200,
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    callbackMock.mockClear();
  });

  it.each([
    [
      "Right side",
      { ...rectangleMock, x: rectangleMock.x + rectangleMock.width + 1 },
    ],
    [
      "Left side",
      { ...rectangleMock, x: rectangleMock.x - rectangleMock.width - 1 },
    ],
    [
      "Upper side",
      { ...rectangleMock, y: rectangleMock.y - rectangleMock.height - 1 },
    ],
    [
      "Bottom side",
      { ...rectangleMock, y: rectangleMock.y + rectangleMock.height + 1 },
    ],
  ])(`Rectangle shouldn't collide on the %s`, async (_, objectData) => {
    const target = renderHook(() => useSharedValue(rectangleMock));
    const object = renderHook(() => useSharedValue(rectangleMock));

    const sys = renderHook(() =>
      useCollisionSystem(
        callbackMock,
        [target.result.current],
        [object.result.current],
      ),
    );

    object.result.current.value = objectData;
    jest.advanceTimersByTime(100);
    sys.rerender({});
    expect(callbackMock).toHaveBeenLastCalledWith(false);
  });

  it.each([
    [
      "Right side",
      { ...rectangleMock, x: rectangleMock.x + rectangleMock.width },
    ],
    [
      "Left side",
      { ...rectangleMock, x: rectangleMock.x - rectangleMock.width },
    ],
    [
      "Upper side",
      { ...rectangleMock, y: rectangleMock.y - rectangleMock.height },
    ],
    [
      "Bottom side",
      { ...rectangleMock, y: rectangleMock.y + rectangleMock.height },
    ],
  ])(`Rectangle should collide on the %s`, async (_, objectData) => {
    const target = renderHook(() => useSharedValue(rectangleMock));
    const object = renderHook(() => useSharedValue(rectangleMock));

    const sys = renderHook(() =>
      useCollisionSystem(
        callbackMock,
        [target.result.current],
        [object.result.current],
      ),
    );

    object.result.current.value = objectData;
    jest.advanceTimersByTime(100);
    sys.rerender({});
    expect(callbackMock).toHaveBeenLastCalledWith(true);
  });

  it(`Rectangle should collide using the angles`, async () => {
    const target = renderHook(() => useSharedValue(rectangleMock));
    const object = renderHook(() => useSharedValue(rectangleMock));

    const sys = renderHook(() =>
      useCollisionSystem(
        callbackMock,
        [target.result.current],
        [object.result.current],
      ),
    );

    const before = object.result.current.value;

    object.result.current.value = {
      ...before,
      x: before.x + before.width + 20,
      angle: 0,
    };
    jest.advanceTimersByTime(100);
    sys.rerender({});

    const after = object.result.current.value;

    jest.advanceTimersByTime(100);
    sys.rerender({});

    object.result.current.value = {
      ...after,
      angle: 45,
    };

    expect(callbackMock).toHaveBeenNthCalledWith(1, false);
    expect(callbackMock).toHaveBeenLastCalledWith(true);
  });

  it(`Rectangle should collide using the sizes`, async () => {
    const target = renderHook(() => useSharedValue(rectangleMock));
    const object = renderHook(() => useSharedValue(rectangleMock));

    const sys = renderHook(() =>
      useCollisionSystem(
        callbackMock,
        [target.result.current],
        [object.result.current],
      ),
    );

    const before = object.result.current.value;

    object.result.current.value = {
      ...before,
      x: before.x - before.width - 50,
      width: before.width + 49,
    };
    jest.advanceTimersByTime(100);
    sys.rerender({});

    const after = object.result.current.value;

    object.result.current.value = {
      ...after,
      width: after.width + 50,
    };
    jest.advanceTimersByTime(100);
    sys.rerender({});

    expect(callbackMock).toHaveBeenNthCalledWith(1, false);
    expect(callbackMock).toHaveBeenLastCalledWith(true);
  });

  it(`Rectangle should collide in circles`, async () => {
    const target = renderHook(() => useSharedValue(rectangleMock));
    const object = renderHook(() => useSharedValue(circleMock));

    const sys = renderHook(() =>
      useCollisionSystem(
        callbackMock,
        [target.result.current],
        [object.result.current],
      ),
    );

    const before = object.result.current.value;
    object.result.current.value = {
      ...before,
      x: before.x + before.diameter + 1,
    };
    jest.advanceTimersByTime(100);
    sys.rerender({});

    const after = object.result.current.value;

    object.result.current.value = {
      ...after,
      x: after.x - 1,
    };
    jest.advanceTimersByTime(100);
    sys.rerender({});

    expect(callbackMock).toHaveBeenNthCalledWith(1, false);
    expect(callbackMock).toHaveBeenLastCalledWith(true);
  });

  it(`Rectangle shouldn't collide with ignoreCollision property`, async () => {
    const target = renderHook(() => useSharedValue(rectangleMock));
    const object = renderHook(() => useSharedValue(rectangleMock));

    const sys = renderHook(() =>
      useCollisionSystem(
        callbackMock,
        [target.result.current],
        [object.result.current],
      ),
    );

    const before = object.result.current.value;

    object.result.current.value = {
      ...before,
      x: before.x + before.width,
      angle: 0,
    };
    jest.advanceTimersByTime(100);
    sys.rerender({});

    const after = object.result.current.value;

    jest.advanceTimersByTime(100);
    sys.rerender({});

    object.result.current.value = {
      ...after,
      ignoreCollision: true,
    };

    expect(callbackMock).toHaveBeenNthCalledWith(1, true);
    expect(callbackMock).toHaveBeenLastCalledWith(false);
  });
});

// Circles
describe("Testing Circles (useCollisionSystem) - Collision scripts tests", () => {
  const callbackMock = jest.fn((collided: boolean) => {});
  const rectangleMock: CollidableRectangle = {
    shape: "RECTANGLE",
    angle: 0,
    width: 100,
    height: 100,
    x: 200,
    y: 200,
  };
  const circleMock: CollidableCircle = {
    shape: "CIRCLE",
    diameter: 100,
    x: 200,
    y: 200,
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    callbackMock.mockClear();
  });

  it(`Circles shouldn't collide`, async () => {
    const target = renderHook(() => useSharedValue(circleMock));
    const object = renderHook(() => useSharedValue(circleMock));

    const sys = renderHook(() =>
      useCollisionSystem(
        callbackMock,
        [target.result.current],
        [object.result.current],
      ),
    );

    const { x, ...others } = object.result.current.value;

    object.result.current.value = { ...others, x: x + others.diameter + 1 };
    jest.advanceTimersByTime(100);
    sys.rerender({});
    expect(callbackMock).toHaveBeenLastCalledWith(false);
  });

  it(`Circles should collide`, async () => {
    const target = renderHook(() => useSharedValue(circleMock));
    const object = renderHook(() => useSharedValue(circleMock));

    const sys = renderHook(() =>
      useCollisionSystem(
        callbackMock,
        [target.result.current],
        [object.result.current],
      ),
    );

    const { x, ...others } = object.result.current.value;
    object.result.current.value = { ...others, x: x + others.diameter };

    jest.advanceTimersByTime(100);
    sys.rerender({});
    expect(callbackMock).toHaveBeenLastCalledWith(true);
  });

  it(`Circle should collide using the sizes`, async () => {
    const target = renderHook(() => useSharedValue(circleMock));
    const object = renderHook(() => useSharedValue(circleMock));

    const sys = renderHook(() =>
      useCollisionSystem(
        callbackMock,
        [target.result.current],
        [object.result.current],
      ),
    );

    const before = object.result.current.value;

    object.result.current.value = {
      ...before,
      x: before.x - before.diameter - 50,
    };
    jest.advanceTimersByTime(100);
    sys.rerender({});

    const after = object.result.current.value;

    object.result.current.value = {
      ...after,
      diameter: after.diameter + 60,
    };
    jest.advanceTimersByTime(100);
    sys.rerender({});

    expect(callbackMock).toHaveBeenNthCalledWith(1, false);
    expect(callbackMock).toHaveBeenLastCalledWith(true);
  });

  it(`Circle should collide in rectangle`, async () => {
    const target = renderHook(() => useSharedValue(circleMock));
    const object = renderHook(() => useSharedValue(rectangleMock));

    const sys = renderHook(() =>
      useCollisionSystem(
        callbackMock,
        [target.result.current],
        [object.result.current],
      ),
    );

    const before = object.result.current.value;
    object.result.current.value = {
      ...before,
      x: before.x + before.width + 1,
    };
    jest.advanceTimersByTime(100);
    sys.rerender({});

    const after = object.result.current.value;

    object.result.current.value = {
      ...after,
      x: after.x - 1,
    };
    jest.advanceTimersByTime(100);
    sys.rerender({});

    expect(callbackMock).toHaveBeenNthCalledWith(1, false);
    expect(callbackMock).toHaveBeenLastCalledWith(true);
  });

  it(`Circle shouldn't collide with ignoreCollision property`, async () => {
    const target = renderHook(() => useSharedValue(circleMock));
    const object = renderHook(() => useSharedValue(circleMock));

    const sys = renderHook(() =>
      useCollisionSystem(
        callbackMock,
        [target.result.current],
        [object.result.current],
      ),
    );

    const before = object.result.current.value;
    object.result.current.value = {
      ...before,
      x: before.x + before.diameter,
    };
    jest.advanceTimersByTime(100);
    sys.rerender({});

    const after = object.result.current.value;

    object.result.current.value = {
      ...after,
      ignoreCollision: true,
    };
    jest.advanceTimersByTime(100);
    sys.rerender({});

    expect(callbackMock).toHaveBeenNthCalledWith(1, true);
    expect(callbackMock).toHaveBeenLastCalledWith(false);
  });
});
