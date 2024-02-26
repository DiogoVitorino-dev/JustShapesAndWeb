import React from "react";
import { StyleSheet, Pressable } from "react-native";
import Animated, {
  runOnUI,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { AnimatedView, TextTitle } from "../shared";

import Colors from "@/constants/Colors";
import { Size } from "@/constants/commonTypes";

interface ButtonMenuProps {
  onPress?: () => void;
  title?: string;
}

export default function ButtonMenu({ onPress, title }: ButtonMenuProps) {
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  const paddingRight = useSharedValue(30);

  const animatedStyle = useAnimatedStyle(() => ({
    paddingRight: paddingRight.value,
  }));

  const onHoverIn = () => {
    "worklet";
    paddingRight.value = withTiming(60, { duration: 90 });
  };

  const onHoverOut = () => {
    "worklet";
    paddingRight.value = withTiming(30, { duration: 30 });
  };

  return (
    <AnimatedPressable
      style={[styles.button, animatedStyle]}
      onHoverIn={onHoverIn}
      onHoverOut={onHoverOut}
    >
      <AnimatedView style={styles.content}>
        <TextTitle style={styles.text}>{title}</TextTitle>
      </AnimatedView>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width:"auto",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.UI.backdrop,
  },
  content: {
    width:"auto",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.UI.backdrop,
  },

  text: {
    fontSize: 36,
  },
});
