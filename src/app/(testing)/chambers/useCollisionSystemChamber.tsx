import React from "react";
import { Button, StyleSheet } from "react-native";
import {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { AnimatedView, View } from "@/components/shared";
import Colors from "@/constants/Colors";
import { Position } from "@/constants/commonTypes";
import { AnimatedCollidableObject } from "@/scripts/collision/collision.types";
import useCollisionSystem from "@/scripts/collision/useCollisionSystem";
import { AnalogicDirectional } from "@/controllers/mobile/directional";

export default function UseCollisionSystemChamber() {
  const bg = useSharedValue(Colors.entity.player);
  const posOb = useSharedValue<Position>({ x: 200, y: 100 });

  const targetHitbox: AnimatedCollidableObject = useSharedValue({
    shape: "RECTANGLE",
    angle: 0,
    width: 50,
    height: 50,
    x: 100,
    y: 100,
  });

  const animatedTarget = useAnimatedStyle(() => ({
    top: targetHitbox.value.y,
    left: targetHitbox.value.x,
    backgroundColor: bg.value,
  }));

  const objectHitbox: AnimatedCollidableObject = useDerivedValue(() => ({
    shape: "RECTANGLE",
    angle: 0,
    width: 50,
    height: 50,
    x: posOb.value.x,
    y: posOb.value.y,
  }));

  const animatedObject = useAnimatedStyle(() => ({
    top: objectHitbox.value.y,
    left: objectHitbox.value.x,
  }));

  useCollisionSystem(
    (collided) => {
      bg.value = collided ? "indigo" : Colors.entity.player;
    },
    [targetHitbox],
    [objectHitbox],
  );
  const triggerCollision = () => {
    posOb.value = withRepeat(
      withTiming({ x: 120, y: 100 }, { duration: 200 }),
      -1,
      true,
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <Button title="trigger collision" onPress={triggerCollision} />
      </View>
      <AnimatedView style={[styles.target, animatedTarget]} />
      <AnimatedView style={[styles.object, animatedObject]} />
      <AnalogicDirectional />
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
