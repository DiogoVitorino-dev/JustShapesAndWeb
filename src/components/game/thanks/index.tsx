import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import Ring from "./ring";

import { BouncingText } from "@/components/shared";
import Colors from "@/constants/Colors";
import { DisplayOptions } from "@/constants/commonTypes";
import { useAndroidBlur, useAppSelector } from "@/hooks";
import { StageStatus } from "@/store/reducers/stage/stageReducer";
import { StageSelectors } from "@/store/reducers/stage/stageSelectors";
import { MathUtils } from "@/utils/mathUtils";

export default function Thanks() {
  const ringsQuantity = 8;
  const router = useRouter();

  const { width, height } = useWindowDimensions();
  const [start, setStart] = useState(false);
  const { experimentalBlurMethod } = useAndroidBlur();

  const display = useSharedValue<DisplayOptions>("none");
  const status = useAppSelector(StageSelectors.selectStatus);

  const backToMenu = () => router.replace("/(menu)");

  useEffect(() => {
    if (status === StageStatus.Completed) {
      display.value = "flex";
      setStart(true);
    }
  }, [status]);

  const ringAnimationFinish = () => {
    "worklet";
    setStart(false);
    display.value = "none";
  };

  const Rings = useMemo(() => {
    const { random } = MathUtils;
    const rings: React.JSX.Element[] = [];

    for (let index = 1; index <= ringsQuantity; index++) {
      rings.push(
        <Ring
          start={start}
          x={random(0, width)}
          y={random(0, height)}
          duration={1000 * index}
          size={random(100, 400)}
          onFinish={index === ringsQuantity ? ringAnimationFinish : undefined}
          key={`ring_${index}`}
        />,
      );
    }

    return rings;
  }, [start]);

  const animatedContainer = useAnimatedStyle(() => ({
    display: display.value,
  }));

  return (
    <Animated.View style={[animatedContainer, styles.container]}>
      <BlurView
        style={styles.container}
        blurReductionFactor={4}
        intensity={20}
        experimentalBlurMethod={experimentalBlurMethod}
      >
        {Rings}
        <BouncingText
          start={start}
          duration={ringsQuantity * 1000}
          type="title"
          style={(index) =>
            index <= 6 ? [styles.text, styles.textVariant] : styles.text
          }
          onFinish={backToMenu}
        >
          Thanks For Playing
        </BouncingText>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    fontSize: 56,
    color: Colors.game.thanks.text.primary,
  },
  textVariant: {
    color: Colors.game.thanks.text.variant_1,
  },
});
