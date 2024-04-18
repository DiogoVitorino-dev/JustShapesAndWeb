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

import OptionsTextButton from "./optionsTextButton";

import { useSoundContext } from "@/audio/sound";
import { AnimatedText, View } from "@/components/shared";
import Colors from "@/constants/Colors";
import { AnimatedStyleApp, DisplayOptions } from "@/constants/commonTypes";
import { useAppSelector } from "@/hooks";
import { PlayerStatus } from "@/store/reducers/player/playerReducer";
import { PlayerSelectors } from "@/store/reducers/player/playerSelectors";

type OnPressOption = () => void;

interface OptionsProps {
  onPressContinue?: OnPressOption;
  onPressOver?: OnPressOption;
  delayPress?: number;
  style?: AnimatedStyleApp;
}

export default function Options({
  onPressContinue,
  onPressOver,
  delayPress = 4000,
  style,
}: OptionsProps) {
  const { play } = useSoundContext();
  const pressAnimationDuration = delayPress / 4;
  const delay = pressAnimationDuration + delayPress / 2.5;

  const displayContinue = useSharedValue<DisplayOptions>("flex");
  const displayOver = useSharedValue<DisplayOptions>("flex");

  const colorText = useSharedValue(Colors.game.gameOver.text);
  const colorValue = useSharedValue(0);

  const status = useAppSelector(PlayerSelectors.selectStatus);

  const changeTextColor = (color: string) => {
    "worklet";

    colorValue.addListener(0, (value) => {
      colorText.value = interpolateColor(
        value,
        [0, 1],
        [Colors.game.gameOver.text, color],
      );
    });

    colorValue.value = withDelay(575, withTiming(1, { duration: 50 }));
  };

  const callOnPress = runOnJS((onPress?: OnPressOption) => {
    if (onPress) {
      setTimeout(() => {
        onPress();
      }, delay);
    }
  });

  const handlePressOver = () => {
    "worklet";

    displayContinue.value = "none";
    changeTextColor(Colors.game.gameOver.textOver);
    pressAudio(true);
    callOnPress(onPressOver);
  };

  const handlePressContinue = () => {
    "worklet";

    displayOver.value = "none";
    changeTextColor(Colors.game.gameOver.textContinue);
    pressAudio(false);
    callOnPress(onPressContinue);
  };

  const pressAudio = runOnJS((isOver: boolean) =>
    isOver ? play("open-menu") : play("start"),
  );

  const reset = () => {
    displayContinue.value = "flex";
    displayOver.value = "flex";

    colorText.value = Colors.UI.text;
    colorValue.value = 0;
  };

  const animatedText = useAnimatedStyle(() => ({
    color: colorText.value,
  }));

  const animatedContinue = useAnimatedStyle(() => ({
    display: displayContinue.value,
  }));

  const animatedOver = useAnimatedStyle(() => ({
    display: displayOver.value,
  }));

  useEffect(() => {
    return () => {
      colorValue.removeListener(0);
    };
  }, []);

  useEffect(() => {
    if (status !== PlayerStatus.Dead) {
      reset();
    }
  }, [status]);

  return (
    <Animated.View style={[styles.container, style]}>
      <AnimatedText.Text style={[styles.text, animatedText]} selectable={false}>
        Game
      </AnimatedText.Text>

      <View transparent style={styles.options}>
        <OptionsTextButton
          style={animatedContinue}
          styleText={[styles.text, styles.textContinue]}
          onPress={handlePressContinue}
          duration={pressAnimationDuration}
          focusable
        >
          not
        </OptionsTextButton>

        <OptionsTextButton
          style={animatedOver}
          styleText={[styles.text, styles.textOver]}
          onPress={handlePressOver}
          duration={pressAnimationDuration}
        >
          is
        </OptionsTextButton>
      </View>

      <AnimatedText.Text style={[styles.text, animatedText]} selectable={false}>
        Over
      </AnimatedText.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  options: {
    flexDirection: "column",
    marginHorizontal: 32,
  },
  text: {
    fontSize: 86,
  },
  textContinue: {
    color: Colors.game.gameOver.textContinue,
  },
  textOver: {
    color: Colors.game.gameOver.textOver,
  },
});
