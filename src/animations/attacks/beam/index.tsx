import React, { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  SharedValue,
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { RunnableAnimation } from "@/animations/animations.type";
import Colors from "@/constants/Colors";
import { Angle, Position, Size } from "@/constants/commonTypes";
import Rectangle, { RectangleData } from "@/models/geometric/rectangle";

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
}

export interface BeamProps extends BeamConfig, RunnableAnimation {}

type BeamAttack = (props: BeamProps) => React.JSX.Element;

export const Beam: BeamAttack = ({
  length,
  size = 100,
  direction = "horizontal",
  attackSpeed = 100,
  prepareDuration = 2000,
  attackDuration = 1500,
  angle = 0,
  delay = 0,
  x = 0,
  y = 0,
  start,
  onFinish,
}) => {
  const window = useWindowDimensions();

  const indicatorDimension: Size = {
    width: direction === "horizontal" ? length || window.width : size,
    height: direction === "vertical" ? length || window.height : size,
  };

  const holding = useSharedValue(0);
  const beamOpacity = useSharedValue(0);
  const indicatorOpacity = useSharedValue(0);
  const width = useSharedValue<number>(
    direction === "horizontal" ? length || window.width : 0,
  );
  const height = useSharedValue<number>(
    direction === "vertical" ? length || window.height : 0,
  );
  const collidable = useSharedValue(false);

  const beam = useDerivedValue<RectangleData>(() => ({
    width: width.value,
    height: height.value,
    angle,
    x,
    y,
    collidable: collidable.value,
  }));

  const endAnimation = (dimension: SharedValue<number>) => {
    "worklet";
    collidable.value = false;
    holding.value = 0;
    indicatorOpacity.value = 0;
    beamOpacity.value = withTiming(0, { duration: prepareDuration / 2 });

    dimension.value = withTiming(0, { duration: prepareDuration / 2 }, (fin) =>
      fin && onFinish ? runOnJS(onFinish)() : undefined,
    );
  };

  const holdAnimation = (dimension: SharedValue<number>) => {
    "worklet";
    holding.value = withTiming(1, { duration: attackDuration }, (fin) =>
      fin ? endAnimation(dimension) : undefined,
    );
  };

  const attack = (dimension: SharedValue<number>) => {
    "worklet";

    collidable.value = true;
    beamOpacity.value = 1;

    dimension.value = withTiming(
      size,
      { duration: attackSpeed, easing: Easing.out(Easing.ease) },
      (fin) => (fin ? holdAnimation(dimension) : undefined),
    );
  };

  const startAnimation = (dimension: SharedValue<number>) => {
    "worklet";

    // Prepare
    if (delay) {
      beamOpacity.value = withDelay(delay, withTiming(0.7, { duration: 0 }));
      indicatorOpacity.value = withDelay(
        delay,
        withTiming(0.2, { duration: 0 }),
      );

      dimension.value = withDelay(
        delay,
        withTiming(size / 2, { duration: prepareDuration }, (prepared) =>
          prepared ? attack(dimension) : undefined,
        ),
      );
    } else {
      beamOpacity.value = withTiming(0.7, { duration: 0 });
      indicatorOpacity.value = withTiming(0.2, { duration: 0 });

      dimension.value = withTiming(
        size / 2,
        { duration: prepareDuration },
        (prepared) => (prepared ? attack(dimension) : undefined),
      );
    }
  };

  const cancel = (dimension: SharedValue<number>) => {
    cancelAnimation(holding);
    cancelAnimation(collidable);
    cancelAnimation(beamOpacity);
    cancelAnimation(indicatorOpacity);
    endAnimation(dimension);
  };

  const startByDirection = () => {
    "worklet";
    switch (direction) {
      case "vertical":
        startAnimation(width);
        break;

      default:
        startAnimation(height);
        break;
    }
  };

  const cancelByDirection = () => {
    "worklet";
    switch (direction) {
      case "vertical":
        cancel(width);
        break;

      default:
        cancel(height);
        break;
    }
  };

  useEffect(() => {
    if (start) startByDirection();
    return () => {
      if (start) {
        cancelByDirection();
      }
    };
  }, [start]);

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
