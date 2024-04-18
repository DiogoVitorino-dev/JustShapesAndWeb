import { useEffect } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { AnimatedEffects } from "@/animations/effects";
import { useSoundContext } from "@/audio/sound";
import { View } from "@/components/shared";
import Controller from "@/controllers";
import { ControlData } from "@/controllers/controllers.type";
import { useCollisionSystem } from "@/hooks";
import Player, { PlayerData } from "@/models/player";
import { MovableObject } from "@/scripts/movement/movement.type";
import useJump from "@/scripts/movement/useJump";
import { useMovementSystem } from "@/scripts/movement/useMovementSystem";

export default function ControllablePlayer() {
  const { width, height } = useWindowDimensions();
  const { play } = useSoundContext();
  const { collided } = useCollisionSystem();
  const opacity = useSharedValue(1);
  const jump = useSharedValue(false);
  const angle = useSharedValue(0);
  const movement = useSharedValue<MovableObject>({
    x: width / 4,
    y: height / 2,
    speedX: 0,
    speedY: 0,
    size: 20,
  });

  useMovementSystem(movement);

  const collisionEffect = () => {
    play("hit");
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 150 }),
        withTiming(1, { duration: 150 }),
      ),
      2,
      true,
    );
  };

  const move = (data: ControlData) => {
    "worklet";

    movement.value = {
      ...movement.value,
      speedX: data.x,
      speedY: data.y,
    };
    angle.value = data.angle;
    jump.value = data.jumping;
  };

  const isJumping = useJump(jump, movement);

  const player = useDerivedValue<PlayerData>(() => ({
    angle: angle.value,
    width: 20,
    height: 20,
    collidable: { enabled: true, ignore: isJumping.value },
    x: movement.value.x,
    y: movement.value.y,
  }));

  useEffect(() => {
    if (collided) {
      collisionEffect();
    }
  }, [collided]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View style={styles.container}>
      <AnimatedEffects.Shake start={collided} impact={{ frequency: 4 }}>
        <Player data={player} style={animatedStyle} />
      </AnimatedEffects.Shake>
      <Controller onMove={move} velocity={2} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
});
