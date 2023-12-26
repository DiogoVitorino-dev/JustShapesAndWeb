import React from "react";
import { View, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  useAnimatedReaction,
  withTiming,
} from "react-native-reanimated";

import { JoystickData, JoystickProp } from "..";

import { AnglesUtils } from "@/scripts/utils/angleUtils";

interface AnalogicProp extends JoystickProp {}

export default function AnalogicJoystick({
  size = 100,
  velocity = 10,
  onMove,
  containerStyle,
}: AnalogicProp) {
  const radius = size / 2;
  const pointerSize = size / 2.5;
  const pos = useSharedValue({ x: 0, y: 0 });

  const normalizeData = ({ angle, x, y }: JoystickData): JoystickData => {
    "worklet";

    // adjusting to velocity range
    x = interpolate(x, [radius * -1, radius], [velocity * -1, velocity]);
    y = interpolate(y, [radius * -1, radius], [velocity * -1, velocity]);

    return { angle, x, y };
  };

  const updatePointerPosition = (x: number, y: number) => {
    "worklet";
    pos.value = { x, y };
  };

  const pan = Gesture.Pan()
    .onBegin(({ x, y }) => {
      updatePointerPosition(x - radius, y - radius);
    })

    .onUpdate(({ x, y }) => {
      const posX = x - radius;
      const posY = y - radius;

      // Distance from center to the edge of the area
      const distance = Math.sqrt(Math.pow(posX, 2) + Math.pow(posY, 2));

      // Limits the pointer to the edge of the area
      if (distance >= radius) {
        const factor = radius / distance;
        updatePointerPosition(posX * factor, posY * factor);
      } else {
        updatePointerPosition(posX, posY);
      }
    })

    .onFinalize(() => {
      updatePointerPosition(0, 0);
    })
    .withTestId("joystickAnalogicPan");

  const pointerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(pos.value.x, {
          duration: 20,
          easing: Easing.out(Easing.ease),
        }),
      },
      {
        translateY: withTiming(pos.value.y, {
          duration: 20,
          easing: Easing.out(Easing.ease),
        }),
      },
    ],
  }));

  useAnimatedReaction(
    (): JoystickData => {
      const angle = AnglesUtils.calculateAngle(pos.value.x, pos.value.y);
      return normalizeData({
        angle,
        x: pos.value.x,
        y: pos.value.y,
      });
    },
    (currentValue, previousValue) => {
      if (currentValue !== previousValue && onMove) {
        onMove(currentValue);
      }
    },
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <GestureDetector gesture={pan}>
        <View
          testID="pan"
          style={[
            { width: size, height: size, borderRadius: radius },
            styles.area,
          ]}
        >
          <Animated.View
            style={[
              {
                width: pointerSize,
                height: pointerSize,
                borderRadius: radius,
              },
              styles.pointer,
              pointerAnimatedStyle,
            ]}
          />
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "30%",
    height: "50%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "indigo",
  },

  area: {
    backgroundColor: "tomato",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },

  pointer: {
    backgroundColor: "cyan",
  },
});
