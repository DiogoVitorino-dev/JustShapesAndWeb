import React from "react";
import {
  View as DefaultView,
  StyleProp,
  StyleSheet,
  ViewProps,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/Colors";

interface SafeAreaViewProps extends ViewProps {
  transparent?: boolean;
}

export const SafeArea = ({
  style,
  transparent,
  children,
  ...others
}: SafeAreaViewProps) => {
  const insets = useSafeAreaInsets();
  const styleArray: StyleProp<ViewStyle> = [styles.default, style];
  const contentStyleArray: StyleProp<ViewStyle> = [
    { ...insets },
    styles.default,
  ];

  if (transparent) {
    styleArray.push(styles.transparent);
    contentStyleArray.push(styles.transparent);
  }

  return (
    <DefaultView {...others} style={styleArray}>
      <DefaultView style={contentStyleArray}>{children}</DefaultView>
    </DefaultView>
  );
};

const styles = StyleSheet.create({
  default: {
    backgroundColor: Colors.UI.background,
    flex: 1,
  },

  transparent: { backgroundColor: "transparent" },
});
