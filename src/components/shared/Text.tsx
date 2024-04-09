import React from "react";
import { Text as NativeText, StyleSheet, TextProps } from "react-native";
import Animated, { AnimatedProps } from "react-native-reanimated";

import Colors from "@/constants/Colors";

interface StyledTextProp extends TextProps {
  secondary?: boolean;
}

type Animatable<T extends object> = AnimatedProps<T>;

const DefaultText = ({
  children,
  secondary,
  style,
  ...others
}: StyledTextProp) => (
  <NativeText
    {...others}
    style={[secondary ? styles.secondary : styles.primary, style]}
  >
    {children}
  </NativeText>
);

const DefaultAnimatedText = ({
  children,
  secondary,
  style,
  ...others
}: Animatable<StyledTextProp>) => (
  <Animated.Text
    {...others}
    style={[secondary ? styles.secondary : styles.primary, style]}
  >
    {children}
  </Animated.Text>
);

const animatedLogo = ({ style, ...others }: Animatable<StyledTextProp>) =>
  DefaultAnimatedText({ style: [style, styles.fontMegrim], ...others });

const animatedTitle = ({ style, ...others }: Animatable<StyledTextProp>) =>
  DefaultAnimatedText({ style: [style, styles.fontMajor], ...others });

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
  primary: {
    fontSize: 22,
    color: Colors.UI.text,
  },
  secondary: {
    fontSize: 18,
    color: Colors.UI.subtext,
  },
  fontMegrim: { fontFamily: "Megrim" },
  fontManjari: { fontFamily: "Manjari", marginBottom: -3 },
  fontMajor: { fontFamily: "MajorMonoDisplay" },
});
