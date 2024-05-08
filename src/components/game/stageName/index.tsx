import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import { BouncingText, BouncingTextProps } from "@/components/shared";
import { useAppSelector } from "@/hooks";
import { StageStatus } from "@/store/reducers/stage/stageReducer";
import { StageSelectors } from "@/store/reducers/stage/stageSelectors";
import { SubstagesSelectors } from "@/store/reducers/substages/substagesSelectors";

export interface StageNameProps extends Omit<BouncingTextProps, "start"> {}

export default function StageName({
  containerStyle,
  style,
  onFinish,
  ...props
}: StageNameProps) {
  const [start, setStart] = useState(false);

  const name = useAppSelector(StageSelectors.selectName);
  const status = useAppSelector(StageSelectors.selectStatus);
  const firstSubstage = useAppSelector(SubstagesSelectors.selectFirstSubstage);
  const substage = useAppSelector(StageSelectors.selectSubstage);

  useEffect(() => {
    if (substage === firstSubstage?.id && status === StageStatus.Idle) {
      setStart(true);
    }
  }, [firstSubstage, substage, status]);

  const handleFinish = () => {
    setStart(false);

    if (onFinish) {
      onFinish();
    }
  };

  return (
    <BouncingText
      {...props}
      start={start}
      style={
        typeof style === "function"
          ? (index) => [styles.text, style(index)]
          : [styles.text, style]
      }
      onFinish={handleFinish}
      containerStyle={[styles.container, containerStyle]}
    >
      {name}
    </BouncingText>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 36,
    position: "absolute",
  },

  text: {
    fontSize: 46,
  },
});
