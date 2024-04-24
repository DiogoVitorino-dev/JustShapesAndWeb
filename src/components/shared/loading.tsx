import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { AnimatedText } from "./Text";

import Colors from "@/constants/Colors";
import { Position } from "@/constants/commonTypes";
import { MathUtils } from "@/utils/mathUtils";

interface ParticleProps extends Position {
  visibleDuration: number;
  size?: number;
}

const Particle = ({ x, y, size = 10, visibleDuration }: ParticleProps) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: visibleDuration }),
      -1,
      true,
    );
  }, []);

  return (
    <Animated.View
      style={{
        opacity,
        width: size,
        height: size,
        top: y,
        left: x,
        position: "absolute",
        backgroundColor: Colors.loading.particle,
      }}
    />
  );
};

export function Loading() {
  const opacity = useSharedValue(1);
  const window = useWindowDimensions();

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.5, { duration: 500 }), -1, true);
  }, []);

  const createSquares = useCallback(() => {
    const { random } = MathUtils;
    const squares: React.JSX.Element[] = [];
    const quantity = window.width / 20;

    for (let index = 0; index < quantity; index++) {
      squares.push(
        <Particle
          size={random(3, 10)}
          visibleDuration={random(500, 2000)}
          x={random(0, window.width)}
          y={random(0, window.height)}
          key={`loadingSquare${index}`}
        />,
      );
    }

    return squares;
  }, [window]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <LinearGradient
      style={[styles.container]}
      colors={[Colors.loading.gradientStart, Colors.loading.gradientEnd]}
    >
      {createSquares()}
      <AnimatedText.Title style={[styles.text, animatedStyle]}>
        Loading
      </AnimatedText.Title>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },

  text: {
    fontSize: 32,
  },
});
