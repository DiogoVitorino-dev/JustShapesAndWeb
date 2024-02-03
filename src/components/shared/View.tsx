import React from "react";
import { View as DefaultView, StyleSheet, ViewProps } from "react-native";
import Animated, { AnimatedProps } from "react-native-reanimated";

import Colors from "@/constants/Colors";

interface CustomViewProps {
  transparent?: boolean;
}

type StyledViewProps<T> = T & CustomViewProps;

export const AnimatedView = ({
  style,
  transparent,
  ...others
}: StyledViewProps<AnimatedProps<ViewProps>>) => {
  const styleArray = [styles.default, style];

  if (transparent) {
    styleArray.push(styles.transparent);
  }

  return <Animated.View {...others} style={styleArray} />;
};

export const View = ({
  style,
  transparent,
  ...others
}: StyledViewProps<ViewProps>) => {
  const styleArray = [styles.default, style];

  if (transparent) {
    styleArray.push(styles.transparent);
  }

  return <DefaultView {...others} style={styleArray} />;
};

const styles = StyleSheet.create({
  default: {
    backgroundColor: Colors.UI.background,
  },
  transparent: { backgroundColor: "transparent" },
});
