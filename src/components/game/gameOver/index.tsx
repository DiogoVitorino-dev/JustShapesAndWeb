import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import Options from "./options";

import Colors from "@/constants/Colors";
import { DisplayOptions } from "@/constants/commonTypes";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { PlayerActions } from "@/store/reducers/player/playerActions";
import { PlayerStatus } from "@/store/reducers/player/playerReducer";
import { PlayerSelectors } from "@/store/reducers/player/playerSelectors";
import { StageActions } from "@/store/reducers/stage/stageActions";
import { StageStatus } from "@/store/reducers/stage/stageReducer";
import { SubstagesSelectors } from "@/store/reducers/substages/substagesSelectors";

export default function GameOver() {
  const entryDuration = 3000;
  const exitDuration = 500;

  const background = useSharedValue(0);
  const display = useSharedValue<DisplayOptions>("none");

  const status = useAppSelector(PlayerSelectors.selectStatus);

  const firstStage = useAppSelector(SubstagesSelectors.selectFirstSubstage);

  const router = useRouter();

  const dispatch = useAppDispatch();

  const animatedBackground = useAnimatedStyle(() => ({
    display: display.value,
    backgroundColor: interpolateColor(
      background.value,
      [0, 1],
      ["transparent", Colors.game.gameOver.background],
    ),
    opacity: background.value,
  }));

  const handleContinue = async () => {
    if (firstStage) {
      dispatch(StageActions.checkpointReached(firstStage.id));
      dispatch(StageActions.chosenSubstage(firstStage.id));
      dispatch(PlayerActions.restored());
    } else {
      handleOver();
    }
  };

  const handleOver = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const startAnimation = () => {
    "worklet";
    display.value = "flex";
    background.value = withTiming(1, { duration: entryDuration });
  };

  const endAnimation = (onFinish?: () => void) => {
    "worklet";
    background.value = withTiming(0, { duration: exitDuration });
    display.value = withDelay(
      exitDuration,
      withTiming("none", { duration: 0 }, (fin) => {
        if (fin && onFinish) {
          runOnJS(onFinish)();
        }
      }),
    );
  };

  useEffect(() => {
    switch (status) {
      case PlayerStatus.Dead:
        dispatch(StageActions.statusUpdated(StageStatus.Failed));
        startAnimation();
        break;
    }
  }, [status]);

  return (
    <Animated.View style={[styles.background, animatedBackground]}>
      <Options
        onPressContinue={() => endAnimation(handleContinue)}
        onPressOver={() => endAnimation(handleOver)}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {},
});
