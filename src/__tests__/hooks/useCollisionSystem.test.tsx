import { act, renderHook } from "@testing-library/react-native";
import { useSharedValue } from "react-native-reanimated";

import { Wrapper } from "../test-utils";

import { useCollisionSystem } from "@/hooks";
import {
  CollidableRectangle,
  CollidableCircle,
} from "@/scripts/collision/collisionDetector";
import CollisionSystemProvider, {
  ForceRemoveCollidableObject,
} from "@/scripts/collision/collisionSystemProvider";

const rectangleMock: Readonly<Required<CollidableRectangle>> = {
  collidable: { enabled: true },
  angle: 0,
  width: 100,
  height: 100,
  x: 200,
  y: 200,
};

const circleMock: Readonly<Required<CollidableCircle>> = {
  collidable: { enabled: true },
  diameter: 100,
  x: 200,
  y: 200,
};

const wrapper: Wrapper = ({ children }) => (
  <CollisionSystemProvider>{children}</CollisionSystemProvider>
);

describe("useCollisionSystem - Hook tests", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it(`Objects shouldn't collide`, async () => {
    const target = renderHook(() => useSharedValue(rectangleMock));
    const object = renderHook(() => useSharedValue(rectangleMock));
    const system = renderHook(() => useCollisionSystem(), { wrapper });

    await act(() => {
      system.result.current.addTarget(target.result.current);
      system.result.current.addObject(object.result.current);
    });

    act(() => {
      object.result.current.value = {
        ...rectangleMock,
        x: rectangleMock.x + rectangleMock.width,
      };

      object.result.current.value = {
        ...rectangleMock,
        x: object.result.current.value.x + 1,
      };
      jest.advanceTimersByTime(200);
    }).then(
      (value) => {
        expect(system.result.current.collided).toBeFalsy();
        return value;
      },
      (value) => value,
    );
  });

  it(`Objects should collide`, async () => {
    const target = renderHook(() => useSharedValue(rectangleMock));
    const object = renderHook(() => useSharedValue(rectangleMock));
    const system = renderHook(() => useCollisionSystem(), { wrapper });

    await act(() => {
      system.result.current.addTarget(target.result.current);
      system.result.current.addObject(object.result.current);
    });

    act(() => {
      object.result.current.value = {
        ...rectangleMock,
        x: rectangleMock.x + rectangleMock.width + 1,
      };

      object.result.current.value = {
        ...rectangleMock,
        x: object.result.current.value.x - 1,
      };
      jest.advanceTimersByTime(200);
    }).then(
      (value) => {
        expect(system.result.current.collided).toBeTruthy();
        return value;
      },
      (value) => value,
    );
  });

  it(`Objects of different types should collide`, async () => {
    const target = renderHook(() => useSharedValue(rectangleMock));
    const object = renderHook(() => useSharedValue(circleMock));
    const system = renderHook(() => useCollisionSystem(), { wrapper });

    await act(() => {
      system.result.current.addTarget(target.result.current);
      system.result.current.addObject(object.result.current);
    });

    act(() => {
      object.result.current.value = {
        ...circleMock,
        x: circleMock.x + circleMock.diameter,
      };
      jest.advanceTimersByTime(100);
    }).then(
      (value) => {
        expect(system.result.current.collided).toBeTruthy();
        return value;
      },
      (value) => value,
    );
  });

  it(`Objects with collision disabled should not collide`, async () => {
    const target = renderHook(() => useSharedValue(rectangleMock));
    const object = renderHook(() => useSharedValue(rectangleMock));
    const system = renderHook(() => useCollisionSystem(), { wrapper });

    await act(() => {
      system.result.current.addTarget(target.result.current);
      system.result.current.addObject(object.result.current);
    });

    act(() => {
      target.result.current.value = {
        ...rectangleMock,
        collidable: { enabled: false },
      };

      object.result.current.value = {
        ...rectangleMock,
        y: rectangleMock.y + rectangleMock.height,
      };
      jest.advanceTimersByTime(100);
    }).then(
      (value) => {
        expect(system.result.current.collided).toBeFalsy();
        return value;
      },
      (reason) => reason,
    );
  });

  it.each(["target", "object"])(`Should remove the %s`, async (testObject) => {
    let remove!: ForceRemoveCollidableObject;
    const target = renderHook(() => useSharedValue(rectangleMock));
    const object = renderHook(() => useSharedValue(rectangleMock));
    const system = renderHook(() => useCollisionSystem(), { wrapper });

    await act(() => {
      if (testObject === "target") {
        remove = system.result.current.addTarget(target.result.current);
        system.result.current.addObject(object.result.current);
      } else {
        system.result.current.addTarget(target.result.current);
        remove = system.result.current.addObject(object.result.current);
      }
    });

    await act(() => {
      remove();
    });

    act(() => {
      if (testObject === "target") {
        object.result.current.value = {
          ...rectangleMock,
          y: rectangleMock.y + rectangleMock.height,
        };
      } else {
        target.result.current.value = {
          ...rectangleMock,
          y: rectangleMock.y + rectangleMock.height,
        };
      }
      jest.advanceTimersByTime(100);
    }).then(
      (value) => {
        expect(system.result.current.collided).toBeFalsy();
        return value;
      },
      (reason) => reason,
    );
  });
});
