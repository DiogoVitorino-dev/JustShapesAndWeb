import React, { useEffect } from "react";
import {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { AnimatedStyledTextProps, AnimatedText } from "@/components/shared";
import Colors from "@/constants/Colors";
import { DisplayOptions } from "@/constants/commonTypes";
import { useAppSelector } from "@/hooks";
import { StagesSelectors } from "@/store/reducers/stages/stagesSelectors";
import { SubstagesSelectors } from "@/store/reducers/substages/substagesSelectors";

interface CheckpointReachedProps {
  style?: AnimatedStyledTextProps["style"];
}

export default function CheckpointReached({ style }: CheckpointReachedProps) {
  const duration = 5000;
  const entryExitDuration = duration / 6;
  const delay = duration - entryExitDuration * 2;

  const display = useSharedValue<DisplayOptions>("none");
  const colorNumber = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  const checkpoint = useAppSelector(StagesSelectors.selectCheckpoint);
  const firstSubstage = useAppSelector(SubstagesSelectors.selectFirstSubstage);

  const startAnimation = () => {
    display.value = "flex";

    opacity.value = withTiming(1, { duration: entryExitDuration });

    scale.value = withSpring(1, {
      duration: entryExitDuration,
      stiffness: 200,
      velocity: 2,
    });

    colorNumber.value = withDelay(
      entryExitDuration,
      withTiming(1, { duration: entryExitDuration / 4 }),
    );

    rotate.value = withDelay(
      entryExitDuration,
      withSequence(
        withTiming(45, { duration: 50 }),
        withSpring(0, { stiffness: 500 }),
      ),
    );
  };

  const endAnimation = () => {
    opacity.value = withTiming(0, { duration: entryExitDuration });

    colorNumber.value = withDelay(
      entryExitDuration,
      withTiming(1, { duration: 0 }),
    );

    scale.value = withDelay(
      entryExitDuration,
      withTiming(0.5, { duration: 0 }, (fin) => {
        if (fin) {
          display.value = "none";
        }
      }),
    );
  };

  useEffect(() => {
    if (checkpoint && firstSubstage) {
      if (checkpoint !== firstSubstage.id) {
        startAnimation();
        setTimeout(endAnimation, delay);
      }
    }
  }, [checkpoint, firstSubstage]);

  const animatedStyle = useAnimatedStyle(() => ({
    display: display.value,
    color: interpolateColor(
      colorNumber.value,
      [0, 1],
      [Colors.game.checkpoint.start, Colors.game.checkpoint.end],
    ),
    opacity: opacity.value,
    fontSize: 36,
    position: "absolute",
    margin: 36,
    alignSelf:"center",
    transform: [{ rotate: rotate.value + "deg" }, { scale: scale.value }],
  }));

  return (
    <AnimatedText.Title style={[animatedStyle, style]}>
      Checkpoint
    </AnimatedText.Title>
  );
}
