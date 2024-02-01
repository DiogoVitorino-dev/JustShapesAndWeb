import React from "react";
import { Text, StyleSheet, TextProps } from "react-native";

interface StyledTextProp extends TextProps {}

const StyledText = ({ children, style, ...others }: StyledTextProp) => (
  <Text {...others} style={[styles.default, style]}>
    {children}
  </Text>
);

export const MegrimText = ({ style, ...others }: StyledTextProp) =>
  StyledText({ style: [style, styles.fontMegrim], ...others });

export const MajorText = ({ style, ...others }: StyledTextProp) =>
  StyledText({ style: [style, styles.fontMajor], ...others });

export const ManjariText = ({ style, ...others }: StyledTextProp) =>
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
