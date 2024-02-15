import React from "react";
import { Text as NativeText, StyleSheet, TextProps } from "react-native";
import Animated, { AnimatedProps } from "react-native-reanimated";

import Colors from "@/constants/Colors";

interface StyledTextProp extends TextProps {}

type Animatable<T extends object> = AnimatedProps<T>;

const DefaultText = ({ children, style, ...others }: StyledTextProp) => (
  <NativeText {...others} style={[styles.default, style]}>
    {children}
  </NativeText>
);

const DefaultAnimatedText = ({
  children,
  style,
  ...others
}: Animatable<StyledTextProp>) => (
  <Animated.Text {...others} style={[styles.default, style]}>
    {children}
  </Animated.Text>
);

const animatedLogo = ({ style, ...others }: Animatable<StyledTextProp>) =>
  DefaultAnimatedText({ style: [style, styles.fontManjari], ...others });

const animatedTitle = ({ style, ...others }: Animatable<StyledTextProp>) =>
  DefaultAnimatedText({ style: [style, styles.fontManjari], ...others });

const animatedText = ({ style, ...others }: Animatable<StyledTextProp>) =>
  DefaultAnimatedText({ style: [style, styles.fontManjari], ...others });

export const TextLogo = ({ style, ...others }: StyledTextProp) =>
  DefaultText({ style: [style, styles.fontMegrim], ...others });

export const TextTitle = ({ style, ...others }: StyledTextProp) =>
  DefaultText({ style: [style, styles.fontMajor], ...others });

export const Text = ({ style, ...others }: StyledTextProp) =>
  DefaultText({ style: [style, styles.fontManjari], ...others });

export const AnimatedText = {
  Logo: animatedLogo,
  Title: animatedTitle,
  Text: animatedText,
};

const styles = StyleSheet.create({
  default: {
    fontSize: 22,
    color: Colors.UI.text,
  },
  fontMegrim: { fontFamily: "Megrim" },
  fontManjari: { fontFamily: "Manjari", marginBottom: -3 },
  fontMajor: { fontFamily: "MajorMonoDisplay" },
});
