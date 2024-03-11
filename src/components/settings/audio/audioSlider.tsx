import Slider, { SliderProps } from "@react-native-community/slider";
import React, { useEffect, useState } from "react";
import { ImageBackground, LayoutChangeEvent, StyleSheet } from "react-native";

import { View } from "@/components/shared";
import { Size } from "@/constants/commonTypes";
import { MathUtils } from "@/utils/mathUtils";

const maximumTrack = require("@/assets/images/max-track.png");
const miniumTrack = require("@/assets/images/min-track.png");
const thumb = require("@/assets/images/thumb.png");

export interface AudioSliderProps extends SliderProps {}

export const SLIDER_MARGIN = 16;
const THUMB_OVERFLOW = 15;

export default function AudioSlider({
  onValueChange,
  value = 0,
  ...props
}: AudioSliderProps) {
  const [size, setSize] = useState<Size>();
  const [valueState, setValueState] = useState<number>(0);

  const handleLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    const { height, width } = nativeEvent.layout;

    setSize({ width: width - SLIDER_MARGIN * 2, height });
  };

  const handleOnValueChange = (newValue: number) => {
    setValueState(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  useEffect(() => {
    setValueState(value);
  }, [value]);

  return (
    <View
      transparent
      style={[
        styles.thumbFix,
        { height: size?.height ? size.height + THUMB_OVERFLOW : undefined },
      ]}
    >
      <ImageBackground
        source={maximumTrack}
        imageStyle={[
          {
            width: size?.width,
            height: size?.height,
          },
          styles.image,
        ]}
      >
        <ImageBackground
          style={[
            {
              width: MathUtils.interpolate(
                valueState,
                { min: 0, max: 100 },
                { min: 0, max: size?.width || 0 },
              ),
              height: size?.height,
            },
            styles.image,
            styles.miniumTrackImage,
          ]}
          source={miniumTrack}
          imageStyle={{ height: size?.height, width: size?.width }}
        />

        <Slider
          onLayout={handleLayout}
          value={valueState}
          thumbImage={thumb}
          maximumValue={100}
          minimumValue={0}
          step={10}
          onValueChange={handleOnValueChange}
          maximumTrackTintColor="transparent"
          minimumTrackTintColor="transparent"
          thumbTintColor="transparent"
          tapToSeek
          {...props}
        />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    marginLeft: SLIDER_MARGIN,
  },

  thumbFix: {
    overflow: "hidden",
    justifyContent: "center",
  },

  miniumTrackImage: {
    position: "absolute",
    overflow: "hidden",
  },
});
