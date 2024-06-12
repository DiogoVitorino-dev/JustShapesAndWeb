import React, { useEffect, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  SharedValue,
  cancelAnimation as cancel,
  runOnJS,
  runOnUI,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { RunnableAnimation } from "@/animations/animations.type";
import Colors from "@/constants/Colors";
import { Angle, Position, Size } from "@/constants/commonTypes";
import { useTimerController } from "@/hooks";
import Rectangle, { RectangleData } from "@/models/geometric/rectangle";
import { Collidable } from "@/scripts/collision/collisionDetector";
import { TimerUtils } from "@/utils/timerUtils";

type BeamDirection = "vertical" | "horizontal";

export interface BeamConfig extends Partial<Position> {
  /**
   * @DocMissing
   */
  length?: number;

  /**
   * @DocMissing
   */
  size?: number;

  /**
   * @DocMissing
   */
  direction?: BeamDirection;

  /**
   * @DocMissing
   */
  attackDuration?: number;

  /**
   * @DocMissing
   */
  attackSpeed?: number;

  /**
   * @DocMissing
   */
  angle?: Angle;

  /**
   * @DocMissing
   */
  prepareDuration?: number;
  /**
   * @DocMissing
   */
  delay?: number;

  /**
   * @DocMissing
   */
  numbersOfReps?: number;

  /**
   * @DocMissing
   */
  delayOfReps?: number;
}

export interface BeamProps extends BeamConfig, RunnableAnimation {
  /**
   * @DocMissing
   */
  onFinishEach?: () => void;
}

type BeamAttack = (props: BeamProps) => React.JSX.Element;

enum DelayID {
  START = 0,
  REPS = 1,
  ATTACK = 2,
}

export const Beam: BeamAttack = ({
  length,
  size = 100,
  direction = "horizontal",
  attackSpeed = 100,
  prepareDuration = 2000,
  attackDuration = 1500,
  numbersOfReps = 0,
  delayOfReps = 0,
  angle = 0,
  delay = 0,
  x = 0,
  y = 0,
  start,
  onFinish,
  onFinishEach,
}) => {
  const window = useWindowDimensions();
  const delayController = useTimerController();
  const { setTimer } = TimerUtils;

  const [reps, setReps] = useState(numbersOfReps);

  const callback = useRef([onFinish, onFinishEach]);

  const indicatorDimension: Size = {
    width: direction === "horizontal" ? length || window.width : size,
    height: direction === "vertical" ? length || window.height : size,
  };

  const beamOpacity = useSharedValue(0);
  const indicatorOpacity = useSharedValue(0);
  const width = useSharedValue<number>(
    direction === "horizontal" ? length || window.width : 0,
  );
  const height = useSharedValue<number>(
    direction === "vertical" ? length || window.height : 0,
  );
  const collidable = useSharedValue<Collidable["collidable"]>({
    enabled: true,
    ignore: true,
  });

  const beam = useDerivedValue<RectangleData>(() => ({
    width: width.value,
    height: height.value,
    angle,
    x,
    y,
    collidable: { ...collidable.value },
  }));

  const setDelay = (callback: () => void, id: DelayID) => {
    switch (id) {
      case DelayID.START:
        delayController.upsertTimer(setTimer(callback, delay), id);
        break;

      case DelayID.REPS:
        delayController.upsertTimer(setTimer(callback, delayOfReps), id);
        break;

      case DelayID.ATTACK:
        delayController.upsertTimer(setTimer(callback, attackDuration), id);
        break;

      default:
        callback();
        break;
    }
  };

  const handleFinish = (repsUpdated: number) => {
    const [onFinish, onFinishEach] = callback.current;
    if (onFinishEach) onFinishEach();

    if (repsUpdated > 0) {
      setReps(repsUpdated - 1);
    } else if (onFinish) {
      onFinish();
    }
  };

  const holdAnimation = (
    dimension: SharedValue<number>,
    repsUpdated: number,
  ) => {
    "worklet";
    setDelay(() => endAnimation(dimension, repsUpdated), DelayID.ATTACK);
  };

  const attack = (dimension: SharedValue<number>, repsUpdated: number) => {
    "worklet";

    collidable.value = { ...collidable.value, ignore: false };
    beamOpacity.value = 1;
    indicatorOpacity.value = 0;

    dimension.value = withTiming(
      size,
      { duration: attackSpeed, easing: Easing.out(Easing.ease) },
      (fin) => (fin ? holdAnimation(dimension, repsUpdated) : undefined),
    );
  };

  const startByDirection = (repsUpdated: number) => {
    switch (direction) {
      case "vertical":
        runOnUI(startAnimation)(width, repsUpdated);
        break;

      default:
        runOnUI(startAnimation)(height, repsUpdated);
        break;
    }
  };

  const startAnimation = (
    dimension: SharedValue<number>,
    repsUpdated: number,
  ) => {
    "worklet";

    // Prepare
    beamOpacity.value = withTiming(0.7, { duration: 0 });
    indicatorOpacity.value = withTiming(0.2, { duration: 0 });

    dimension.value = withTiming(
      size / 2,
      { duration: prepareDuration },
      (prepared) => (prepared ? attack(dimension, repsUpdated) : undefined),
    );
  };

  const endAnimation = (
    dimension: SharedValue<number>,
    repsUpdated: number,
  ) => {
    "worklet";
    collidable.value = { ...collidable.value, ignore: true };
    beamOpacity.value = withTiming(0, { duration: prepareDuration / 2 });

    dimension.value = withTiming(0, { duration: prepareDuration / 2 }, (fin) =>
      fin ? runOnJS(handleFinish)(repsUpdated) : undefined,
    );
  };

  const cancelAnimation = (dimension: SharedValue<number>) => {
    runOnJS(setReps)(0);
    runOnJS(delayController.removeTimer)();
    cancel(collidable);
    cancel(beamOpacity);
    cancel(dimension);
    endAnimation(dimension, 0);
  };

  useEffect(() => {
    callback.current = [onFinish, onFinishEach];
    if (start) {
      const initReps =
        numbersOfReps !== -1 ? numbersOfReps : Number.MAX_SAFE_INTEGER;
      setReps(initReps);
      
      
      if (delay) setDelay(() => startByDirection(initReps), DelayID.START);
      else startByDirection(initReps);
    }
    return () => {
      if (start) {
        if (direction === "horizontal") {
          runOnUI(cancelAnimation)(height);
        } else {
          runOnUI(cancelAnimation)(width);
        }
      }
    };
  }, [start]);

  useEffect(() => {
    if (reps > 0 && reps !== numbersOfReps) {
      callback.current = [onFinish, onFinishEach];
      if (delayOfReps) {
        setDelay(() => startByDirection(reps), DelayID.REPS);
      } else {
        startByDirection(reps);
      }
    }
  }, [reps]);

  const beamStyle = useAnimatedStyle(() => ({
    opacity: beamOpacity.value,
    zIndex: 10,
  }));

  const indicatorStyle = useAnimatedStyle(() => ({
    width: indicatorDimension.width,
    height: indicatorDimension.height,
    top: y,
    left: x,
    position: "absolute",
    transform: [{ rotate: angle + "deg" }],
    opacity: indicatorOpacity.value,
    backgroundColor: Colors.entity.enemy,
  }));

  return (
    <>
      <Animated.View testID="beamIndicator" style={indicatorStyle} />
      <Rectangle data={beam} style={beamStyle} />
    </>
  );
};
