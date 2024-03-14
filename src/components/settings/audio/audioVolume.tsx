import React, { useEffect, useState } from "react";
import { StyleSheet, ViewStyle, useWindowDimensions } from "react-native";

import AudioSlider, { AudioSliderProps, SLIDER_MARGIN } from "./audioSlider";

import { AnimatedView, Text, View } from "@/components/shared";

type ForwardSliderProps = Pick<AudioSliderProps, "onValueChange" | "value">;

interface AudioVolumeProps extends ForwardSliderProps {
  title: string;
  layoutAnimation?: React.ComponentProps<typeof AnimatedView>["layout"];
  style?: ViewStyle;
}

export default function AudioVolume({
  title,
  value,
  layoutAnimation,
  style,
  onValueChange,
}: AudioVolumeProps) {
  const { width } = useWindowDimensions();
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
    <AnimatedView
      layout={layoutAnimation}
      style={[{ width: width / 2 }, styles.container, style]}
    >
      <View transparent style={styles.containerText}>
        <Text>{title}</Text>
        <Text secondary>{valueState}</Text>
      </View>
      <AudioSlider
        style={{ width: width / 2 }}
        value={valueState}
        onValueChange={handleValueChange}
      />
    </AnimatedView>
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
    paddingHorizontal: SLIDER_MARGIN,
    justifyContent: "space-between",
  },
});
