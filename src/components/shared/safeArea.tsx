import React, { forwardRef } from "react";
import { View, StyleSheet, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/Colors";

interface SafeAreaViewProps extends ViewProps {
  background?: boolean;
}

export const SafeArea = forwardRef<View, SafeAreaViewProps>(
  ({ style, background, children, ...others }: SafeAreaViewProps, ref) => {
    const insets = useSafeAreaInsets();

    return (
      <View
        style={[background ? styles.background : undefined, styles.container]}
      >
        <View {...others} ref={ref} style={[{ ...insets }, style]}>
          {children}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  background: {
    backgroundColor: Colors.UI.background,
  },
});
