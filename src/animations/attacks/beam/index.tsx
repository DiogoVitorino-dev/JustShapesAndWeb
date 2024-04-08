import React, { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import Animated, {
  Easing,
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
import { Angle, Position } from "@/constants/commonTypes";
import Rectangle, { RectangleData } from "@/models/geometric/rectangle";
import { Collidable } from "@/scripts/collision/collisionDetector";

export interface BeamConfig extends Partial<Position> {
  /**
   * @DocMissing
   */
  beamWidth?: number;
  /**
   * @DocMissing
   */
  beamDuration?: number;
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
}

export interface BeamProps extends BeamConfig, RunnableAnimation {}

type BeamAttack = (props: BeamProps) => React.JSX.Element;

export const Beam: BeamAttack = ({
  beamWidth = 100,
  attackSpeed = 100,
  prepareDuration = 2000,
  beamDuration = 1500,
  angle = 0,
  x,
  y,
  start,
  onFinish,
}) => {
  const { width } = useWindowDimensions();

  const beamOpacity = useSharedValue(0);
  const indicatorOpacity = useSharedValue(0);
  const height = useSharedValue<number>(0);
  const collidable = useSharedValue<Collidable["collidable"]>({
    enabled: true,
    ignore: true,
  });

  const beam = useDerivedValue<RectangleData>(() => ({
    angle,
    width,
    height: height.value,
    collidable: { ...collidable.value },
  }));

  const holdAnimation = () => {
    "worklet";
    setTimeout(() => {
      endAnimation();
    }, beamDuration);
  };

  const attack = (prepared?: boolean) => {
    "worklet";
    if (prepared) {
      collidable.value = { ...collidable.value, ignore: false };
      beamOpacity.value = 1;
      indicatorOpacity.value = 0;

      height.value = withTiming(
        beamWidth,
        { duration: attackSpeed, easing: Easing.out(Easing.ease) },
        (fin) => (fin ? holdAnimation() : undefined),
      );
    }
  };

  const startAnimation = () => {
    "worklet";
    // Prepare
    beamOpacity.value = 0.7;
    indicatorOpacity.value = 0.2;

    height.value = withTiming(
      beamWidth / 2,
      { duration: prepareDuration },
      attack,
    );
  };

  const endAnimation = () => {
    "worklet";
    collidable.value = { ...collidable.value, ignore: true };
    beamOpacity.value = withTiming(0, { duration: prepareDuration / 2 });

    height.value = withTiming(0, { duration: prepareDuration / 2 }, (fin) => {
      if (fin && onFinish) runOnJS(onFinish)();
    });
  };

  const cancelAnimation = () => {
    cancel(collidable);
    cancel(beamOpacity);
    cancel(height);
    endAnimation();
  };

  useEffect(() => {
    if (start) {
      runOnUI(startAnimation)();
    } else {
      runOnUI(cancelAnimation)();
    }
  }, [start]);

  const beamStyle = useAnimatedStyle(() => ({
    opacity: beamOpacity.value,
    zIndex: 10,
  }));

  const indicatorStyle = useAnimatedStyle(() => ({
    width,
    height: beamWidth,
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
