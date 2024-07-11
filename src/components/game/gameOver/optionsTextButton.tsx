import React from "react";
import {
  StyleSheet,
  Pressable,
  GestureResponderEvent,
  MouseEvent,
} from "react-native";
import Animated, {
  Easing,
  SharedValue,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { useSoundContext } from "@/audio/sound";
import { StyledTextProps, Text } from "@/components/shared";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type AnimatedPressableProps = React.ComponentProps<typeof AnimatedPressable>;

interface OptionsTextButtonProps extends Omit<AnimatedPressableProps, "key"> {
  duration?: number;
  styleText?: Pick<StyledTextProps, "style">["style"];
  children?: Pick<StyledTextProps, "children">["children"];
}

type Event = MouseEvent | GestureResponderEvent;
type Callback<E extends Event> = ((event: E) => void) | undefined | null;

type CallListenerParams<E extends Event> = {
  event: E;
  fn?: Callback<E> | SharedValue<Callback<E>>;
};

export default function OptionsTextButton({
  duration = 1000,
  styleText,
  children,
  onPress,
  onHoverIn,
  onHoverOut,
  style,
  ...props
}: OptionsTextButtonProps) {
  const { playSound } = useSoundContext();

  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  const runningPress = useSharedValue(false);

  const hoverAudio = () => runOnJS(playSound)("hover");
  const pressAudio = () => runOnJS(playSound)("open-menu");

  const startPressAnimation = async () => {
    "worklet";
    runningPress.value = true;

    scale.value = withSequence(
      withTiming(0.5, {
        duration: duration / 2,
        easing: Easing.out(Easing.ease),
      }),
      withSpring(1, { stiffness: 300 }),
    );

    rotate.value = withDelay(
      duration / 2,
      withSequence(
        withTiming(45, { duration: 50 }),
        withSpring(0, { stiffness: 500 }, (fin) => {
          if (fin) {
            runningPress.value = false;
          }
        }),
      ),
    );
  };

  const handlePress = (event: GestureResponderEvent) => {
    "worklet";

    startPressAnimation();
    pressAudio();

    callListener({ event, fn: onPress });
  };

  const handleHoverIn = (event: MouseEvent) => {
    "worklet";

    if (!runningPress.value) {
      scale.value = withTiming(1.1, {
        duration: 100,
        easing: Easing.in(Easing.ease),
      });

      hoverAudio();
    }

    callListener({ event, fn: onHoverIn });
  };

  const handleHoverOut = (event: MouseEvent) => {
    "worklet";

    if (!runningPress.value) {
      scale.value = withTiming(1, {
        duration: 100,
        easing: Easing.out(Easing.ease),
      });
    }

    callListener({ event, fn: onHoverOut });
  };

  function callListener<E extends Event>({ event, fn }: CallListenerParams<E>) {
    if (fn) {
      if ("value" in fn) {
        if (fn.value) {
          fn.value(event);
        }
      } else {
        runOnJS(fn)(event);
      }
    }
  }

  const animatedOption = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: rotate.value + "deg" }],
  }));

  return (
    <AnimatedPressable
      style={[animatedOption, style]}
      onPress={handlePress}
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      {...props}
    >
      <Text style={[styles.text, styleText]} selectable={false}>
        {children}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 86,
    textAlign: "center",
  },
});
