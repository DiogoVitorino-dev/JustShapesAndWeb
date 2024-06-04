import { useEffect } from "react";
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
import { AnimatedProps, Position } from "@/constants/commonTypes";
import Rectangle, { RectangleData } from "@/models/geometric/rectangle";
import { Collidable } from "@/scripts/collision/collisionDetector";

export type SmashDirection = "vertical" | "horizontal";

export interface RectangleSmashConfig extends Partial<Position> {
  /**
   * @DocMissing
   */
  initialLength?: number;

  /**
   * @DocMissing
   */
  size?: number;

  /**
   * @DocMissing
   */
  smashTo?: SmashDirection;

  /**
   * @DocMissing
   */
  prepareDuration?: number;

  /**
   * @DocMissing
   */
  prepareAmount?: number;

  /**
   * @DocMissing
   */
  attackSpeed?: number;

  /**
   * @DocMissing
   */
  attackDuration?: number;

  /**
   * @DocMissing
   */
  hideDuration?: number;

  /**
   * @DocMissing
   */
  delay?: number;
}

export interface RectangleSmashProps
  extends RectangleSmashConfig,
    RunnableAnimation {
  style?: AnimatedProps<"View">["style"];
}

export function RectangleSmash({
  size = 80,
  initialLength = 0,
  prepareAmount = 70,
  prepareDuration = 2000,
  attackDuration = 500,
  attackSpeed = 150,
  hideDuration = 200,
  smashTo = "horizontal",
  x = 0,
  y = 0,
  delay = 0,
  onFinish,
  start,
  style,
}: RectangleSmashProps) {
  const window = useWindowDimensions();

  const width = useSharedValue(smashTo === "horizontal" ? initialLength : size);
  const height = useSharedValue(smashTo === "vertical" ? initialLength : size);

  const opacity = useSharedValue(0);
  const opacityIndicator = useSharedValue(0);
  const collidable = useSharedValue<Collidable["collidable"]>({
    enabled: true,
    ignore: true,
  });

  const rect = useDerivedValue<RectangleData>(() => ({
    width: width.value,
    height: height.value,
    x,
    y,
    collidable: { ...collidable.value },
  }));

  const holdAnimation = (dimension: SharedValue<number>) => {
    "worklet";
    setTimeout(() => {
      endAnimation(dimension);
    }, attackDuration);
  };

  const SMASH = (dimension: SharedValue<number>) => {
    "worklet";
    const dimensionLimit =
      smashTo === "vertical" ? window.height : window.width;

    dimension.value = withTiming(
      dimensionLimit,
      {
        duration: attackSpeed,
        easing: Easing.exp,
      },
      (fin) => (fin ? holdAnimation(dimension) : undefined),
    );
  };

  const prepare = (dimension: SharedValue<number>) => {
    "worklet";
    collidable.value = { ...collidable.value, ignore: false };
    if (delay) {
      opacity.value = withDelay(delay, withTiming(1, { duration: 100 }));
      opacityIndicator.value = withDelay(
        delay,
        withTiming(0.2, { duration: 100 }),
      );

      dimension.value = withDelay(
        delay,
        withTiming(
          initialLength + prepareAmount,
          { duration: prepareDuration, easing: Easing.out(Easing.ease) },
          (finished) => (finished ? SMASH(dimension) : undefined),
        ),
      );
    } else {
      opacity.value = withTiming(1, { duration: 100 });
      opacityIndicator.value = withTiming(0.2, { duration: 100 });

      dimension.value = withTiming(
        initialLength + prepareAmount,
        { duration: prepareDuration, easing: Easing.out(Easing.ease) },
        (finished) => (finished ? SMASH(dimension) : undefined),
      );
    }
  };

  const endAnimation = (dimension: SharedValue<number>) => {
    "worklet";
    collidable.value = { ...collidable.value, ignore: true };
    opacityIndicator.value = 0;

    dimension.value = withTiming(0, {
      duration: hideDuration,
      easing: Easing.out(Easing.ease),
    });

    opacity.value = withTiming(0, { duration: hideDuration }, (fin) =>
      fin && onFinish ? runOnJS(onFinish)() : undefined,
    );
  };

  const cancel = (dimension: SharedValue<number>) => {
    "worklet";
    cancelAnimation(dimension);
    cancelAnimation(opacity);
    cancelAnimation(opacityIndicator);
    endAnimation(dimension);
  };

  useEffect(() => {
    if (start) {
      if (smashTo === "horizontal") prepare(width);
      else prepare(height);
    }
    return () => {
      if (start) {
        if (smashTo === "horizontal") {
          cancel(width);
        } else {
          cancel(height);
        }
      }
    };
  }, [start]);

  const indicatorStyle = useAnimatedStyle(() => ({
    width: smashTo === "horizontal" ? window.width : size,
    height: smashTo === "vertical" ? window.height : size,
    opacity: opacityIndicator.value,
    backgroundColor: Colors.entity.enemy,
    position: "absolute",
    top: y,
    left: x,
  }));

  return (
    <>
      <Animated.View style={indicatorStyle} />
      <Rectangle data={rect} style={[{ opacity }, style]} />;
    </>
  );
}
