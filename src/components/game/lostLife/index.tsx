import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { AnimatedEffects } from "@/animations/effects";
import { AnimatedText } from "@/components/shared";
import Colors from "@/constants/Colors";
import { DisplayOptions } from "@/constants/commonTypes";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { PlayerSelectors } from "@/store/reducers/player/playerSelectors";
import { StageActions } from "@/store/reducers/stage/stageActions";
import { StageStatus } from "@/store/reducers/stage/stageReducer";
import { ColorUtils } from "@/utils/colorUtils";

export default function LostLife() {
  const currentLife = useAppSelector(PlayerSelectors.selectLife);

  const [shake, setShake] = useState(false);
  const [life, setLife] = useState(currentLife);

  const display = useSharedValue<DisplayOptions>("none");
  const opacity = useSharedValue(0);
  const color = useSharedValue(0);
  const backgroundColor = useSharedValue("transparent");

  const dispatch = useAppDispatch();

  const stopStageRuntime = () => {
    dispatch(StageActions.statusUpdated(StageStatus.Failed));
  };

  const restart = () => {
    dispatch(StageActions.restartedFromCheckpoint());
  };

  const shakeDelayed = (delay: number) =>
    setTimeout(() => setShake(true), delay);

  const lifeDelayed = (life: number, delay: number) => {
    setTimeout(() => setLife(life), delay);
  };

  const startAnimation = (newLife: number) => {
    display.value = "flex";
    const bgTransparency = ColorUtils.addTransparency(
      Colors.game.lostLife.background,
      70,
    );

    backgroundColor.value = withTiming(bgTransparency, {
      duration: 200,
    });

    opacity.value = withTiming(1, { duration: 200 });

    runOnJS(shakeDelayed)(500);

    color.value = withDelay(
      1500,
      withSequence(
        withTiming(1, { duration: 400 }),
        withTiming(0, { duration: 400 }),
      ),
    );

    runOnJS(lifeDelayed)(newLife, 1600);
  };

  const endAnimation = () => {
    "worklet";
    backgroundColor.value = withTiming("transparent", { duration: 200 });

    opacity.value = withTiming(0, { duration: 200 }, (fin) => {
      if (fin) {
        display.value = "none";
      }
    });
  };

  useEffect(() => {
    if (life > currentLife && currentLife > 0) {
      startAnimation(currentLife);
      stopStageRuntime();

      setTimeout(() => {
        endAnimation();
        restart();
      }, 3500);
    } else if (currentLife > 1 && life === 1) {
      setLife(currentLife);
    }
  }, [currentLife, life]);

  const animatedStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      color.value,
      [0, 1],
      [Colors.game.lostLife.text, Colors.game.lostLife.textLosing],
    ),
    opacity: opacity.value,
  }));

  const animatedContainer = useAnimatedStyle(() => ({
    display: display.value,
    backgroundColor: backgroundColor.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedContainer]}>
      <AnimatedEffects.Shake start={shake} duration={1000}>
        <AnimatedText.Text style={[animatedStyle, styles.text]}>
          {life}
        </AnimatedText.Text>
      </AnimatedEffects.Shake>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 86,
  },
});
