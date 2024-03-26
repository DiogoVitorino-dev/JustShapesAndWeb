import { Href, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  Pressable,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import {
  Easing,
  WithSpringConfig,
  WithTimingConfig,
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import ButtonMenuEffect from "./menuButtonEffect";
import { AnimatedView, TextTitle, View } from "../shared";

import { useSoundContext } from "@/audio/sound";
import Colors from "@/constants/Colors";

const opacityConfig: WithTimingConfig = {
  duration: 150,
  easing: Easing.out(Easing.exp),
};

const paddingConfig: WithSpringConfig = {
  duration: 1000,
};

interface ButtonMenuProps {
  href?: Href<string>;
  title?: string;
  index?: number;
  isStart?: boolean;
  style?: ViewStyle;
}

export default function ButtonMenu({
  title,
  style,
  href,
  isStart = false,
  index = 0,
}: ButtonMenuProps) {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const padding = ((width / 15) * (index + 1)) / 2.1 + width / 15;
  const paddingExpanded = padding * 2;
  const { play } = useSoundContext();

  const [disabled, setDisabled] = useState(false);
  const horizontalScale = useSharedValue(0);
  const opacity = useSharedValue(1);

  const animatedTextStyle = useAnimatedStyle(() => ({
    marginRight: horizontalScale.value,
  }));

  const animatedRootStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const startPaddingAnimation = runOnUI((toValue: number) => {
    "worklet";
    horizontalScale.value = withSpring(toValue, paddingConfig);
  });

  const entryAnimation = runOnUI(() => {
    "worklet";
    horizontalScale.value = withDelay(
      100 * index,
      withSpring(padding, paddingConfig),
    );
  });

  const exitAnimation = runOnUI(() => {
    "worklet";
    horizontalScale.value = withDelay(
      100 * index,
      withSpring(0, paddingConfig),
    );
  });

  useFocusEffect(
    useCallback(() => {
      entryAnimation();
      return () => {
        exitAnimation();
      };
    }, []),
  );

  const handleHoverIn = () => {
    "worklet";
    startPaddingAnimation(paddingExpanded);
  };

  const handleHoverOut = () => {
    "worklet";
    startPaddingAnimation(padding);
  };

  const handlePress = () => {
    "worklet";
    setDisabled(true);

    const callWhenAnimationFinished = () => {
      setDisabled(false);
      if (href) {
        router.push(href);
      }
    };

    if (horizontalScale.value === padding) {
      startPaddingAnimation(paddingExpanded);
    } else {
      startPaddingAnimation(padding);
    }

    opacity.value = withRepeat(
      withTiming(0.4, opacityConfig),
      4,
      true,
      (fin) => {
        if (fin) {
          callWhenAnimationFinished();
        }
      },
    );
  };

  const hoverAudio = async () => play("hover");
  const pressAudio = async () => (isStart ? play("start") : play("open-menu"));

  return (
    <AnimatedView transparent style={[styles.root, animatedRootStyle, style]}>
      <Pressable
        style={styles.button}
        onHoverIn={async () => {
          hoverAudio().finally(handleHoverIn);
        }}
        onHoverOut={handleHoverOut}
        onPress={async () => {
          pressAudio().finally(handlePress);
        }}
        disabled={disabled}
      >
        <AnimatedView transparent style={[styles.content, animatedTextStyle]}>
          <TextTitle style={styles.text}>{title}</TextTitle>
        </AnimatedView>
      </Pressable>
      <View transparent style={[styles.containerEffect]}>
        <ButtonMenuEffect
          fill={Colors.UI.text}
          fillBackdrop={Colors.UI.backdrop}
        />
      </View>
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  root: {
    maxWidth: "100%",
    flexDirection: "row",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    backgroundColor: Colors.UI.backdrop,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
  },

  containerEffect: {
    width: "20%",
    flexDirection: "row",
    height: "100%",
  },

  text: {
    fontSize: 36,
  },
});
