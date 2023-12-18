import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  useAnimatedReaction,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

export interface JoyStickData {
  x: number;
  y: number;
  angle: number;
}

interface JoyStickProp {
  size?: number;
  velocity?: number;
  onMove?: (data: JoyStickData) => void;
  style?: ViewStyle;
}

function shiftAngle(angle: number, amount: number) {
  "worklet";
  if (angle === 0) return 0;
  return (angle + amount) % 360;
}

function calculateAngle(x: number, y: number) {
  "worklet";
  let angle = Math.atan2(y, x); // calculating angle
  angle = angle * (180 / Math.PI); // convert radian to degree
  angle = shiftAngle(angle, 360); // convert to positives degrees

  return angle;
}

export default function Joystick({
  size = 100,
  velocity = 10,
  onMove,
  style,
}: JoyStickProp) {
  const radius = size / 2;
  const pointerSize = size / 2.5;
  const pos = useSharedValue({ x: 0, y: 0 });

  const normalizeData = ({ angle, x, y }: JoyStickData): JoyStickData => {
    "worklet";

    // adjusting to velocity range
    x = interpolate(x, [radius * -1, radius], [velocity * -1, velocity]);
    y = interpolate(y, [radius * -1, radius], [velocity * -1, velocity]);
    angle = shiftAngle(angle, 90); // Adjust the initial angle point upwards

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
    .withTestId("joystickPan");

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
      const angle = calculateAngle(pos.value.x, pos.value.y);
      return normalizeData({ angle, x: pos.value.x, y: pos.value.y });
    },
    (currentValue, previousValue) => {
      if (currentValue !== previousValue && onMove) {
        runOnJS(onMove)(currentValue);
      }
    },
  );

  return (
    <View style={[styles.container, style]}>
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
    backgroundColor: "indigo",
    position: "absolute",
  },

  area: {
    backgroundColor: "tomato",
    alignItems: "center",
    justifyContent: "center",
  },

  pointer: {
    backgroundColor: "cyan",
  },
});
