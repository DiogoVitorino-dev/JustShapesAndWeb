import React from "react";
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  useAnimatedReaction,
  withTiming,
} from "react-native-reanimated";

import { DirectionalProps, DirectionalData } from "..";

import { AnimatedView, View } from "@/components/shared";
import Colors from "@/constants/Colors";
import { AnglesUtils } from "@/utils/angleUtils";

interface AnalogicProp extends DirectionalProps {}

export function AnalogicDirectional({
  size = 100,
  velocity = 10,
  onMove,
  containerStyle,
}: AnalogicProp) {
  const radius = size / 2;
  const pointerSize = size / 2.5;
  const pos = useSharedValue({ x: 0, y: 0 });

  const normalizeData = ({ angle, x, y }: DirectionalData): DirectionalData => {
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
    .withTestId("directionalAnalogicPan");

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
    () => {
      return pos.value.x;
    },
    (currentValue, previousValue) => {
      if (currentValue !== previousValue && onMove) {
        const angle = AnglesUtils.getAngleFromPosition(pos.value.x, pos.value.y);

        const data = normalizeData({
          angle,
          x: pos.value.x,
          y: pos.value.y,
        });

        onMove(data);
      }
    },
  );

  return (
    <View style={[styles.container, containerStyle]} transparent>
      <GestureDetector gesture={pan}>
        <View
          testID="pan"
          style={[
            { width: size, height: size, borderRadius: radius },
            styles.area,
          ]}
        >
          <AnimatedView
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
  },

  area: {
    backgroundColor: Colors.control.buttonBackground,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    zIndex: 1000,
  },

  pointer: {
    backgroundColor: Colors.control.button,
  },
});
