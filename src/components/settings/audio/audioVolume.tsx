import React, { useEffect, useState } from "react";
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
  value,
  layoutAnimation,
  style,
  onValueChange,
}: AudioVolumeProps) {
  const [valueState, setValue] = useState(0);

  const handleValueChange = (newValue: number) => {
    setValue(newValue);

    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  useEffect(() => {
    if (value) {
      setValue(value);
    }
  }, [value]);

  return (
    <Animated.View layout={layoutAnimation} style={[styles.container, style]}>
      <View style={styles.containerText}>
        <Text selectable={false} style={styles.title}>
          {title}
        </Text>
        <Text selectable={false} secondary>
          {valueState.toFixed(1)}
        </Text>
      </View>
      <AudioSlider value={valueState} onValueChange={handleValueChange} />
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
