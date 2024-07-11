import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import { AnimatedProps } from "@/constants/commonTypes";
import { useAppSelector } from "@/hooks";
import { useStageController } from "@/hooks/useStageController";
import { StageStatus } from "@/store/reducers/stage/stageReducer";
import { StageSelectors } from "@/store/reducers/stage/stageSelectors";

type SceneOnStart = () => void | Promise<void>;
type SceneOnPause = () => void | Promise<void>;
type SceneOnComplete = () => void | Promise<void>;
type SceneOnFail = () => void | Promise<void>;
type SceneOnFinalize = () => void;

export interface SceneProps
  extends Pick<AnimatedProps<"View">, "children" | "style"> {
  onStart?: SceneOnStart;
  onFinalize?: SceneOnFinalize;
  onPause?: SceneOnPause;
  onFail?: SceneOnFail;
  onStageEnd?: SceneOnComplete;
}

export default function Scene({
  onStart,
  onFinalize,
  onStageEnd,
  onFail,
  onPause,

  style,
  ...props
}: SceneProps) {
  const status = useAppSelector(StageSelectors.selectStatus);
  const { substageColor } = useStageController();

  useEffect(() => {
    switch (status) {
      case StageStatus.Playing:
        if (onStart) onStart();
        break;

      case StageStatus.Completed:
        if (onStageEnd) onStageEnd();
        break;

      case StageStatus.Paused:
        if (onPause) onPause();
        break;

      case StageStatus.Failed:
        if (onFail) onFail();
        break;
    }
  }, [status]);

  useEffect(() => {
    return () => {
      if (onFinalize) onFinalize();
    };
  }, []);

  return (
    <Animated.View
      style={[styles.container, { backgroundColor: substageColor }, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
});
