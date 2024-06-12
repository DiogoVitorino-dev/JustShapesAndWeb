import { useEffect, useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import {
  interpolateColor,
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
import Colors from "@/constants/Colors";
import Controller from "@/controllers";
import { ControlData } from "@/controllers/controllers.type";
import { useAppDispatch, useAppSelector, useCollisionSystem } from "@/hooks";
import Player, { PlayerData } from "@/models/player";
import { MovableObject } from "@/scripts/movement/movement.type";
import useJump from "@/scripts/movement/useJump";
import { useMovementSystem } from "@/scripts/movement/useMovementSystem";
import { useStageTimer } from "@/scripts/stageController/useStageTimer";
import { PlayerActions } from "@/store/reducers/player/playerActions";
import { PlayerStatus } from "@/store/reducers/player/playerReducer";
import { PlayerSelectors } from "@/store/reducers/player/playerSelectors";
import { TimerUtils } from "@/utils/timerUtils";

export default function ControllablePlayer() {
  const { width, height } = useWindowDimensions();
  const { playSound } = useSoundContext();
  const { collided } = useCollisionSystem();
  const opacity = useSharedValue(1);
  const jump = useSharedValue(false);
  const angle = useSharedValue(0);

  const [color, setColor] = useState("");

  const { upsertTimer } = useStageTimer();

  const dispatch = useAppDispatch();

  const status = useAppSelector(PlayerSelectors.selectStatus);
  const maxHealth = useAppSelector(PlayerSelectors.selectMaxHealth);
  const health = useAppSelector(PlayerSelectors.selectHealth);

  const movement = useSharedValue<MovableObject>({
    x: width / 4,
    y: height / 2,
    speedX: 0,
    speedY: 0,
    size: 20,
  });

  useMovementSystem(movement);

  const collisionEffect = () => {
    playSound("hit");
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 150 }),
        withTiming(1, { duration: 150 }),
      ),
      2,
      true,
    );
  };

  const damage = () => {
    const { setTimer } = TimerUtils;
    dispatch(PlayerActions.hurt({ health: 1 }));
    dispatch(PlayerActions.invulnerable(true));
    upsertTimer(
      setTimer(() => dispatch(PlayerActions.invulnerable(false)), 2000),
      1,
    );
  };

  const move = (data: ControlData) => {
    "worklet";

    switch (status) {
      case PlayerStatus.Dead:
        movement.value = {
          ...movement.value,
          speedX: 0,
          speedY: 0,
        };
        angle.value = 0;
        jump.value = false;
        break;

      default:
        movement.value = {
          ...movement.value,
          speedX: data.x,
          speedY: data.y,
        };

        angle.value = data.angle;
        jump.value = data.jumping;
        break;
    }
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
      damage();
    }
  }, [collided]);

  useEffect(() => {
    setColor(
      interpolateColor(
        health,
        [1, maxHealth],
        [Colors.entity.enemy, Colors.entity.player],
      ),
    );
  }, [health, maxHealth]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <AnimatedEffects.Shake start={collided} impact={{ frequency: 4 }}>
        <Player data={player} style={animatedStyle} color={color} />
      </AnimatedEffects.Shake>
      <Controller onMove={move} velocity={3} />
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
