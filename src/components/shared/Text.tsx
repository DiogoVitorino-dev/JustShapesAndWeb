import React from "react";
import { Text as NativeText, StyleSheet, TextProps } from "react-native";

import Colors from "@/constants/Colors";

interface StyledTextProp extends TextProps {}

const DefaultText = ({ children, style, ...others }: StyledTextProp) => (
  <NativeText {...others} style={[styles.default, style]}>
    {children}
  </NativeText>
);

export const TextLogo = ({ style, ...others }: StyledTextProp) =>
  DefaultText({ style: [style, styles.fontMegrim], ...others });

export const TextTitle = ({ style, ...others }: StyledTextProp) =>
  DefaultText({ style: [style, styles.fontMajor], ...others });

export const Text = ({ style, ...others }: StyledTextProp) =>
  DefaultText({ style: [style, styles.fontManjari], ...others });

const styles = StyleSheet.create({
  default: {
    fontSize: 22,
    color: Colors.UI.text,
  },
  fontMegrim: { fontFamily: "Megrim" },
  fontManjari: { fontFamily: "Manjari" },
  fontMajor: { fontFamily: "MajorMonoDisplay" },
});
