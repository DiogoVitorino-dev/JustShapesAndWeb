import React, { useEffect, useMemo, useState } from "react";
import { ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import Character, { CharacterProps } from "./character";

import { DisplayOptions } from "@/constants/commonTypes";
import { useAppSelector } from "@/hooks";
import { SubstageStatus } from "@/store/reducers/substages/substagesReducer";
import { SubstagesSelectors } from "@/store/reducers/substages/substagesSelectors";

export interface StageNameProps
  extends Omit<CharacterProps, "character" | "index" | "start"> {
  start?: boolean;
  style?: ViewStyle | ViewStyle[];
}

export default function StageName({
  start,
  style,
  onFinish,
  ...props
}: StageNameProps) {
  const [shouldStart, setShouldStart] = useState(false);
  const stage = useAppSelector(SubstagesSelectors.selectStageName);

  const currentSubstage = useAppSelector(SubstagesSelectors.selectCurrent);
  const allStages = useAppSelector(SubstagesSelectors.selectAllSubstages);
  const status = useAppSelector(SubstagesSelectors.selectStatus);

  const display = useSharedValue<DisplayOptions>("none");

  useEffect(() => {
    switch (status) {
      case SubstageStatus.Playing:
        if (currentSubstage?.id === allStages[0]?.id) {
          setShouldStart(true);
        }
        break;
    }
  }, [currentSubstage, allStages, status]);

  useEffect(() => {
    if (shouldStart || start) {
      display.value = "flex";
    } else {
      display.value = "none";
    }
  }, [shouldStart, start]);

  const handleFinish = () => {
    if (shouldStart) {
      setShouldStart(false);
    }

    if (onFinish) {
      onFinish();
    }
  };

  const Characters = useMemo(() => {
    const name: React.JSX.Element[] = [];

    for (let index = 0; index < stage.length; index++) {
      name.push(
        <Character
          {...props}
          start={start || shouldStart}
          onFinish={index === 0 ? handleFinish : undefined}
          index={index}
          key={`letter_${index}`}
        >
          {stage[index]}
        </Character>,
      );
    }

    return name;
  }, [shouldStart, stage, start]);

  const animatedContainer = useAnimatedStyle(() => ({
    display: display.value,
    width: "auto",
    flexDirection: "row",
  }));

  return (
    <Animated.View style={[animatedContainer, style]}>
      {Characters}
    </Animated.View>
  );
}
