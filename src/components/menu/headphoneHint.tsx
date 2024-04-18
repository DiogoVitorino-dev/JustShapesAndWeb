import React, { useEffect } from "react";
import { Platform, StyleSheet } from "react-native";
import Animated, {
  runOnJS,
  runOnUI,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  Easing,
  withTiming,
  cancelAnimation,
} from "react-native-reanimated";

import { AnimatedText, Icon } from "../shared";

import Colors from "@/constants/Colors";
import Strings from "@/constants/Strings";
import { AreaButton } from "@/controllers/mobile/buttons";
import { ListenersUtils } from "@/utils/listenersUtils";

interface InitialLoadingProps {
  onAnimationFinished?: () => void;
}

export default function HeadphoneHint({
  onAnimationFinished,
}: InitialLoadingProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacityText = useSharedValue(0);
  const translateYText = useDerivedValue(() => translateY.value * -1);
  const scale = useSharedValue(1);

  const handlerOnAnimationFinished = (delayToFinish: number) => {
    "worklet";
    opacity.value = withDelay(delayToFinish, withTiming(0, { duration: 500 }));
    opacityText.value = withDelay(
      delayToFinish,
      withTiming(0, { duration: 500 }, (fin) =>
        fin && onAnimationFinished ? runOnJS(onAnimationFinished)() : undefined,
      ),
    );
  };

  const skipAnimationOnWeb = () => {
    let remove: undefined | (() => void);
    if (Platform.OS === "web") {
      remove = ListenersUtils.web.listenKey(skipAnimation).removeListener;
    }
    return { remove };
  };

  const skipAnimationOnMobile = () => {
    if (Platform.OS === "android" || Platform.OS === "ios")
      return (
        <AreaButton
          onPress={skipAnimation}
          indicatorSize={0}
          style={styles.mobileButton}
        />
      );
  };

  useEffect(() => {
    runOnUI(() => {
      "worklet";
      opacity.value = withTiming(1, { duration: 1000 });
      scale.value = withDelay(
        1000,
        withRepeat(
          withTiming(1.1, { duration: 300, easing: Easing.out(Easing.exp) }),
          -1,
          true,
        ),
      );

      opacityText.value = withDelay(1500, withTiming(1, { duration: 50 }));
      translateY.value = withDelay(
        1500,
        withTiming(-10, { duration: 100 }, (fin) =>
          fin ? handlerOnAnimationFinished(3000) : undefined,
        ),
      );
    })();

    const { remove } = skipAnimationOnWeb();

    return () => {
      if (remove) {
        remove();
      }
    };
  }, []);

  const skipAnimation = () => {
    "worklet";
    cancelAnimation(opacity);
    cancelAnimation(translateY);
    cancelAnimation(opacityText);
    cancelAnimation(translateYText);
    cancelAnimation(scale);
    handlerOnAnimationFinished(0);
  };

  return (
    <Animated.View style={styles.container}>
      <Animated.View
        style={{ transform: [{ scale }, { translateY }], opacity }}
      >
        <Icon name="headset" color={Colors.UI.text} size={36} />
      </Animated.View>
      <AnimatedText.Text
        style={{
          opacity: opacityText,
          transform: [{ translateY: translateYText }],
        }}
      >
        {Strings.headphoneHint}
      </AnimatedText.Text>
      {skipAnimationOnMobile()}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mobileButton: {
    width: "100%",
  },
});
