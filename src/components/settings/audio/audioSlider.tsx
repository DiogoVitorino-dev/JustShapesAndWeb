import Slider, { SliderProps } from "@react-native-community/slider";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  measure,
  useAnimatedRef,
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

  const heightTrack = useSharedValue(0);
  const minimumTrackWidth = useSharedValue(0);
  const maximumTrackWidth = useSharedValue(0);

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
      heightTrack.value = dimensions.height;
    }
  };

  useEffect(() => {
    getSizes();
  }, [value, maxImgRef]);

  return (
    <View style={[styles.container, style]}>
      <Animated.Image
        ref={maxImgRef}
        source={maximumTrack}
        style={[styles.image, styles.maximize]}
      />

      <Animated.Image
        source={miniumTrack}
        style={[styles.image, styles.maximize]}
      />

      <Slider
        value={value}
        thumbImage={thumb}
        maximumValue={maximumValue}
        minimumValue={minimumValue}
        onValueChange={onValueChange}
        thumbTintColor="#00000000"
        maximumTrackTintColor="transparent"
        minimumTrackTintColor="transparent"
        tapToSeek
        style={[styles.slider]}
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
