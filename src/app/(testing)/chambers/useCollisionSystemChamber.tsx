import React, { useEffect } from "react";
import { Button, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { View } from "@/components/shared";
import Colors from "@/constants/Colors";
import { AnalogicDirectional } from "@/controllers/mobile/directional";
import { useCollisionSystem } from "@/hooks";
import Rectangle, { RectangleData } from "@/models/geometric/rectangle";
import { CollidableRectangle } from "@/scripts/collision/collisionDetector";

export default function UseCollisionSystemChamber() {
  const bg = useSharedValue(Colors.entity.player);
  const { addTarget, collided } = useCollisionSystem();

  const target = useSharedValue<CollidableRectangle>({
    x: 100,
    y: 100,
    angle: 0,
    width: 50,
    height: 50,
    collidable: { enabled: true },
  });

  const animatedTarget = useAnimatedStyle(() => ({
    width: target.value.width,
    height: target.value.height,
    top: target.value.y,
    left: target.value.x,
    backgroundColor: bg.value,
    transform: [{ rotate: `${target.value.angle || 0}deg` }],
  }));

  const objectPos = useSharedValue({ x: 200, y: 100 });
  const object = useDerivedValue<RectangleData>(() => ({
    ...objectPos.value,
    width: 50,
    height: 50,
    collidable: { enabled: true },
  }));

  const triggerCollision = () => {
    objectPos.value = withRepeat(
      withTiming({ ...objectPos.value, x: 120 }, { duration: 500 }),
      -1,
      true,
    );
  };

  useEffect(() => {
    bg.value = collided ? "indigo" : Colors.entity.player;
  }, [collided]);

  useEffect(() => {
    const remove = addTarget(target);
    return () => {
      remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <Button title="trigger collision" onPress={triggerCollision} />
      </View>
      <Animated.View style={[styles.target, animatedTarget]} />
      <Rectangle data={object} style={[styles.object]} />
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
