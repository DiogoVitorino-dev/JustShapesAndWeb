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
  runOnJS,
} from "react-native-reanimated";

interface JoyStickData {
  x: number;
  y: number;
  angle: number;
}

interface JoyStickProp {
  size?: number;
  velocity?: number;
  onMove: (data: JoyStickData) => void;
}

const calculateAngle = (x: number, y: number) => {
  "worklet";
  let angle = Math.atan2(y, x); // calculating angle
  angle = angle * (180 / Math.PI); // convert radian to degree
  angle = (angle + 360) % 360; // convert to positives degrees
  return angle;
};

export default function Joystick({
  size = 100,
  velocity = 100,
  onMove,
}: JoyStickProp) {
  const radius = size / 2;
  const pos = useSharedValue({ x: 0, y: 0 });

  const normalizeData = ({ angle, x, y }: JoyStickData): JoyStickData => {
    "worklet";
    const distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

    x = interpolate(x, [distance * -1, distance], [velocity * -1, velocity]);
    y = interpolate(y, [distance * -1, distance], [velocity * -1, velocity]);

    return { angle, x, y };
  };

  const pan = Gesture.Pan()
    .onBegin((event) => {
      const posX = event.x - radius;
      const posY = event.y - radius;

      pos.value = { x: posX, y: posY };
    })

    .onUpdate((event) => {
      const posX = event.x - radius;
      const posY = event.y - radius;

      // Distance from center to the edge of the area
      const distance = Math.sqrt(Math.pow(posX, 2) + Math.pow(posY, 2));

      // Limits the pointer to the edge of the area
      if (distance >= radius) {
        const factor = radius / distance;
        pos.value = { x: posX * factor, y: posY * factor };
      } else {
        pos.value = { x: posX, y: posY };
      }
    })

    .onFinalize(() => {
      pos.value = { x: 0, y: 0 };
    })
    .withTestId("pan");

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
      if (currentValue !== previousValue) {
        runOnJS(onMove)(currentValue);
      }
    },
  );

  return (
    <View style={styles.container}>
      <GestureDetector gesture={pan}>
        <View
          testID="pan"
          style={[
            { width: size, height: size, borderRadius: size / 2 },
            styles.area,
          ]}
        >
          <Animated.View
            style={[
              { width: size / 2.5, height: size / 2.5, borderRadius: size / 2 },
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
    flex: 1,
    justifyContent: "center",
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
