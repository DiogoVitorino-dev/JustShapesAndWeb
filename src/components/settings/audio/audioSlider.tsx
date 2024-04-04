import Slider, { SliderProps } from "@react-native-community/slider";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  measure,
  runOnUI,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { View } from "@/components/shared";
import { MathUtils } from "@/utils/mathUtils";

const maximumTrack = require("@/assets/images/max-track.png");
const miniumTrack = require("@/assets/images/min-track.png");
const thumb = require("@/assets/images/thumb.png");

export interface AudioSliderProps extends SliderProps {}

export const SLIDER_MARGIN = 16;

export default function AudioSlider({
  onValueChange,
  value = 0,
  maximumValue = 100,
  minimumValue = 0,
  style,
  ...props
}: AudioSliderProps) {
  const maxImgRef = useAnimatedRef();
  const { interpolate } = MathUtils;

  const minimumTrackWidth = useSharedValue(0);
  const maximumTrackWidth = useSharedValue(0);

  const containerMinimumTrackStyle = useAnimatedStyle(() => ({
    width: minimumTrackWidth.value,
    height: "100%",
    position: "absolute",
    overflow: "hidden",
  }));

  const minimumTrackStyle = useAnimatedStyle(() => ({
    width: maximumTrackWidth.value,
    height: "100%",
  }));

  const getSizes = () => {
    const dimensions = measure(maxImgRef);
    if (dimensions) {
      const newWidth = interpolate(
        value,
        {
          min: minimumValue,
          max: maximumValue,
        },
        { min: 0, max: dimensions.width },
      );
      minimumTrackWidth.value = newWidth;
      maximumTrackWidth.value = dimensions.width;
    }
  };

  useEffect(() => {
    runOnUI(getSizes)();
  }, [value, maxImgRef]);

  return (
    <View style={[styles.container, style]}>
      <Animated.Image
        ref={maxImgRef}
        source={maximumTrack}
        style={[styles.image, styles.maximize]}
      />
      <Animated.View style={containerMinimumTrackStyle}>
        <Animated.Image source={miniumTrack} style={minimumTrackStyle} />
      </Animated.View>

      <Slider
        value={value}
        thumbImage={thumb}
        maximumValue={maximumValue}
        minimumValue={minimumValue}
        onValueChange={onValueChange}
        thumbTintColor="transparent"
        maximumTrackTintColor="transparent"
        minimumTrackTintColor="transparent"
        tapToSeek
        style={[styles.maximize, styles.slider]}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minWidth: 90,
    overflow: "hidden",
  },
  maximize: {
    width: "100%",
    height: "100%",
  },

  cut: {
    minWidth: "100%",
    minHeight: "100%",
  },

  slider: {
    zIndex: 10,
  },

  image: {
    position: "absolute",
    overflow: "hidden",
  },
});
