import React from "react";
import { Text as NativeText, StyleSheet, TextProps } from "react-native";
import Animated, { AnimatedProps } from "react-native-reanimated";

import Colors from "@/constants/Colors";

interface CustomProps {
  secondary?: boolean;
}

export type StyledTextProps = TextProps & CustomProps;
export type AnimatedStyledTextProps = AnimatedProps<TextProps & CustomProps>;

const DefaultText = ({
  children,
  secondary,
  style,
  ...others
}: StyledTextProps) => (
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
}: AnimatedStyledTextProps) => (
  <Animated.Text
    {...others}
    style={[secondary ? styles.secondary : styles.primary, style]}
  >
    {children}
  </Animated.Text>
);

const animatedLogo = ({ style, ...others }: AnimatedStyledTextProps) =>
  DefaultAnimatedText({ style: [style, styles.fontMegrim], ...others });

const animatedTitle = ({ style, ...others }: AnimatedStyledTextProps) =>
  DefaultAnimatedText({ style: [style, styles.fontMajor], ...others });

const animatedText = ({ style, ...others }: AnimatedStyledTextProps) =>
  DefaultAnimatedText({ style: [style, styles.fontManjari], ...others });

export const TextLogo = ({ style, ...others }: StyledTextProps) =>
  DefaultText({ style: [style, styles.fontMegrim], ...others });

export const TextTitle = ({ style, ...others }: StyledTextProps) =>
  DefaultText({ style: [style, styles.fontMajor], ...others });

export const Text = ({ style, ...others }: StyledTextProps) =>
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
