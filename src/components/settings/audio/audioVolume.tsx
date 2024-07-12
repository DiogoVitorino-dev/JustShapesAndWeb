import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

import AudioSlider, { AudioSliderProps } from "./audioSlider";

import { Text, View } from "@/components/shared";

type ForwardSliderProps = Pick<AudioSliderProps, "onValueChange" | "value">;

interface AudioVolumeProps extends ForwardSliderProps {
  title: string;
  layoutAnimation?: React.ComponentProps<typeof Animated.View>["layout"];
  style?: ViewStyle;
}

export default function AudioVolume({
  title,
  value = 0,
  layoutAnimation,
  style,
  onValueChange,
}: AudioVolumeProps) {
  return (
    <Animated.View layout={layoutAnimation} style={[styles.container, style]}>
      <View style={styles.containerText}>
        <Text selectable={false} style={styles.title}>
          {title}
        </Text>
        <Text selectable={false} secondary>
          {value.toFixed(1)}
        </Text>
      </View>
      <AudioSlider value={value} onValueChange={onValueChange} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "space-around",
  },
  containerText: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    justifyContent: "space-between",
  },

  title: {
    marginHorizontal: 3,
  },
});
