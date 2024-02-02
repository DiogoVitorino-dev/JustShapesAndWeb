import React from "react";
import { Text as DefaultText, StyleSheet, TextProps } from "react-native";

interface StyledTextProp extends TextProps {}

const StyledText = ({ children, style, ...others }: StyledTextProp) => (
  <DefaultText {...others} style={[styles.default, style]}>
    {children}
  </DefaultText>
);

export const TextLogo = ({ style, ...others }: StyledTextProp) =>
  StyledText({ style: [style, styles.fontMegrim], ...others });

export const TextTitle = ({ style, ...others }: StyledTextProp) =>
  StyledText({ style: [style, styles.fontMajor], ...others });

export const Text = ({ style, ...others }: StyledTextProp) =>
  StyledText({ style: [style, styles.fontManjari], ...others });

const styles = StyleSheet.create({
  default: {
    fontSize: 22,
    color: "white",
  },
  fontMegrim: { fontFamily: "Megrim" },
  fontManjari: { fontFamily: "Manjari" },
  fontMajor: { fontFamily: "MajorMonoDisplay" },
});
