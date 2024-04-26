import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import Character, { CharacterProps } from "./character";

import { AnimatedStyleApp, DisplayOptions } from "@/constants/commonTypes";
import { useAppSelector } from "@/hooks";
import { StageStatus } from "@/store/reducers/stages/stagesReducer";
import { StagesSelectors } from "@/store/reducers/stages/stagesSelectors";
import { SubstagesSelectors } from "@/store/reducers/substages/substagesSelectors";

type ForwardCharacterProps = Pick<CharacterProps, "duration" | "onFinish">;

export interface StageNameProps extends ForwardCharacterProps {
  style?: AnimatedStyleApp;
}

export default function StageName({
  style,
  onFinish,
  ...props
}: StageNameProps) {
  const [shouldStart, setShouldStart] = useState(false);

  const name = useAppSelector(StagesSelectors.selectName);
  const status = useAppSelector(StagesSelectors.selectStatus);
  const firstSubstage = useAppSelector(SubstagesSelectors.selectFirstSubstage);
  const substage = useAppSelector(StagesSelectors.selectSubstage);

  const display = useSharedValue<DisplayOptions>("none");

  useEffect(() => {
    if (substage === firstSubstage?.id && status === StageStatus.Idle) {
      setShouldStart(true);
    }
  }, [firstSubstage, substage, status]);

  useEffect(() => {
    if (shouldStart) {
      display.value = "flex";
    } else {
      display.value = "none";
    }
  }, [shouldStart]);

  const handleFinish = () => {
    if (shouldStart) {
      setShouldStart(false);
    }

    if (onFinish) {
      onFinish();
    }
  };

  const Characters = useMemo(() => {
    const AnimatedName: React.JSX.Element[] = [];

    for (let index = 0; index < name.length; index++) {
      AnimatedName.push(
        <Character
          {...props}
          start={shouldStart}
          onFinish={index === 0 ? handleFinish : undefined}
          index={index}
          key={`letter_${index}`}
        >
          {name[index]}
        </Character>,
      );
    }

    return AnimatedName;
  }, [shouldStart, name]);

  const animatedContainer = useAnimatedStyle(() => ({
    display: display.value,
  }));

  return (
    <Animated.View style={[animatedContainer, styles.container, style]}>
      <Text style={[styles.text]}>{Characters}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    position: "absolute",
    flexDirection: "row",
  },

  text: {
    margin: 36,
  },
});
