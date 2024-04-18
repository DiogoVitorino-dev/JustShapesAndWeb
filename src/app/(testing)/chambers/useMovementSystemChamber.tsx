import React from "react";
import { Button, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

import { View } from "@/components/shared";
import Colors from "@/constants/Colors";
import { Position } from "@/constants/commonTypes";
import { MovableObject } from "@/scripts/movement/movement.type";
import { useMovementSystem } from "@/scripts/movement/useMovementSystem";

export default function UseMovementSystemChamber() {
  const mov = useSharedValue<MovableObject>({
    speedX: 4,
    speedY: 0,
    x: 100,
    y: 100,
    size: { width: 50, height: 50 },
  });

  const pos = useDerivedValue<Position>(() => ({
    x: mov.value.x,
    y: mov.value.y,
  }));

  const animatedObject = useAnimatedStyle(() => ({
    top: pos.value.y,
    left: pos.value.x,
  }));

  const triggerMovement = () => {
    mov.value.speedX = 3;
  };

  useMovementSystem(mov);
  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <Button title="Move object" onPress={triggerMovement} />
      </View>
      <Animated.View style={[styles.object, animatedObject]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controls: {
    width: 100,
    flex: 1,
  },
  target: {
    backgroundColor: Colors.entity.player,
    width: 50,
    height: 50,
    position: "absolute",
  },
  object: {
    backgroundColor: Colors.entity.enemy,
    width: 50,
    height: 50,
    position: "absolute",
  },
});
