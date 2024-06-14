import React, { forwardRef } from "react";
import { View as DefaultView, StyleSheet, ViewProps } from "react-native";

import Colors from "@/constants/Colors";

interface CustomViewProps {
  background?: boolean;
}

export interface StyledViewProps extends ViewProps, CustomViewProps {}

export const View = forwardRef<DefaultView, StyledViewProps>(
  ({ style, background, ...props }, ref) => (
    <DefaultView
      ref={ref}
      style={[background ? styles.background : undefined, style]}
      {...props}
    />
  ),
);

const styles = StyleSheet.create({
  background: { backgroundColor: Colors.UI.background },
});
