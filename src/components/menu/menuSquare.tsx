import { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import {
  WithTimingConfig,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
  withRepeat,
  withDelay,
  runOnUI,
} from "react-native-reanimated";

import { AnimatedView } from "../shared";

import Colors from "@/constants/Colors";
import { Angle } from "@/constants/commonTypes";
import { MathUtils } from "@/utils/mathUtils";

type SquareEasing = Pick<WithTimingConfig, "duration" | "easing">;

export default function MenuSquare() {
  const { random } = MathUtils;
  const window = useWindowDimensions();
  const duration = random(8000, 20000);
  const fase = random(0, 1) < 0.5;

  const top = useSharedValue<number>(random(0, window.height));
  const left = useSharedValue<number>(random(0, window.width));
  const angle = useSharedValue<Angle>(random(-360, 360));
  const width = useSharedValue<number>(random(0, window.width / 5));
  const height = useSharedValue<number>(random(0, window.height / 5));
  const scale = useSharedValue<number>(1);

  const easing: SquareEasing = {
    duration,
    easing: Easing.inOut(Easing.ease),
  };
  const easingAngle: SquareEasing = {
    duration: duration * 2,
    easing: Easing.inOut(Easing.ease),
  };

  const run = () => {
    "worklet";
    top.value = withTiming(random(0, window.height), easing);
    left.value = withTiming(random(0, window.width), easing);
    width.value = withTiming(random(100, window.width / 5), easing);
    height.value = withTiming(random(100, window.height / 5), easing);
    angle.value = withTiming(random(-360, 360), easingAngle);
  };

  const bounce = runOnUI(() => {
    "worklet";
    if (fase) {
      scale.value = withRepeat(
        withTiming(1.1, { duration: 300, easing: Easing.out(Easing.exp) }),
        -1,
        true,
      );
    } else {
      scale.value = withDelay(
        300,
        withRepeat(
          withTiming(1.1, { duration: 300, easing: Easing.out(Easing.exp) }),
          -1,
          true,
        ),
      );
    }
  });

  useEffect(() => {
    run();
    bounce();
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
    transform: [{ rotate: angle.value + "deg" }, { scale: scale.value }],
    opacity: 0.4,
    borderRadius: 3,
    backgroundColor: Colors.UI.backdrop,
    position: "absolute",
  }));

  return <AnimatedView style={animatedView} />;
}
