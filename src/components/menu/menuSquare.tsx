import { useEffect } from "react";
import { useWindowDimensions, Easing } from "react-native";
import {
  WithTimingConfig,
  useSharedValue,
  runOnUI,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

import { AnimatedView } from "../shared";

import Colors from "@/constants/Colors";
import { Angle } from "@/constants/commonTypes";
import { MathUtils } from "@/utils/mathUtils";

type SquareEasing = Pick<WithTimingConfig, "duration" | "easing">;

export default function MenuSquare() {
  const { random } = MathUtils;
  const window = useWindowDimensions();
  const duration = random(5000, 10000);

  const top = useSharedValue<number>(random(0, window.height));
  const left = useSharedValue<number>(random(0, window.width));
  const angle = useSharedValue<Angle>(random(-360, 360));
  const width = useSharedValue<number>(random(0, 200));
  const height = useSharedValue<number>(random(0, 200));

  const easing: SquareEasing = {
    duration,
    easing: Easing.inOut(Easing.ease),
  };
  const easingAngle: SquareEasing = {
    duration: duration * 2,
    easing: Easing.inOut(Easing.ease),
  };

  const run = runOnUI(() => {
    "worklet";
    top.value = withTiming(random(0, window.height), easing);
    left.value = withTiming(random(0, window.width), easing);
    width.value = withTiming(random(100, 200), easing);
    height.value = withTiming(random(100, 200), easing);
    angle.value = withTiming(random(-360, 360), easingAngle);
  });

  useEffect(() => {
    run();
    const interval = setInterval(() => run(), duration);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const animatedView = useAnimatedStyle(() => ({
    width: width.value,
    height: height.value,
    top: top.value,
    left: left.value,
    transform: [{ rotate: angle.value + "deg" }],
    opacity: 0.4,
    borderRadius: 3,
    backgroundColor: Colors.UI.backdrop,
    position: "absolute",
  }));

  return <AnimatedView style={animatedView} />;
}
