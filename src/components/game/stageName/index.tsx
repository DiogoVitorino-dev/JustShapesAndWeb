import React, { useEffect, useMemo, useState } from "react";
import { ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import Character, { CharacterProps } from "./character";

import { DisplayOptions } from "@/constants/commonTypes";
import { useAppSelector } from "@/hooks";
import { StageStatus } from "@/store/reducers/stages/stagesReducer";
import { StagesSelectors } from "@/store/reducers/stages/stagesSelectors";
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
  const name = useAppSelector(StagesSelectors.selectName);

  const allSubstages = useAppSelector(SubstagesSelectors.selectAllSubstages);
  const substage = useAppSelector(StagesSelectors.selectSubstage);
  const status = useAppSelector(StagesSelectors.selectStatus);

  const display = useSharedValue<DisplayOptions>("none");

  useEffect(() => {
    switch (status) {
      case StageStatus.Playing:
        if (substage === allSubstages[0]?.id) {
          setShouldStart(true);
        }
        break;
    }
  }, [allSubstages, substage, status]);

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
    const AnimatedName: React.JSX.Element[] = [];

    for (let index = 0; index < name.length; index++) {
      AnimatedName.push(
        <Character
          {...props}
          start={start || shouldStart}
          onFinish={index === 0 ? handleFinish : undefined}
          index={index}
          key={`letter_${index}`}
        >
          {name[index]}
        </Character>,
      );
    }

    return AnimatedName;
  }, [shouldStart, name, start]);

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
