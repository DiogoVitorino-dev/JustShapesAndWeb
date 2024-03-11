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
  const styleArray: StyleProp<ViewStyle> = [styles.default];
  const contentStyleArray: StyleProp<ViewStyle> = [
    { ...insets },
    styles.default,
    style,
  ];

  if (transparent) {
    styleArray.push(styles.transparent);
    contentStyleArray.push(styles.transparent);
  }

  return (
    <DefaultView style={styleArray}>
      <DefaultView {...others} style={contentStyleArray}>
        {children}
      </DefaultView>
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
