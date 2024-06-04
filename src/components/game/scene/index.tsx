import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import { AnimatedProps } from "@/constants/commonTypes";
import { useAppSelector } from "@/hooks";
import { StageStatus } from "@/store/reducers/stage/stageReducer";
import { StageSelectors } from "@/store/reducers/stage/stageSelectors";
import { Substage } from "@/store/reducers/substages/substagesReducer";

type SceneOnStart = () => void | Promise<void>;
type SceneOnPause = () => void | Promise<void>;
type SceneOnComplete = () => void | Promise<void>;
type SceneOnFail = () => void | Promise<void>;
type SceneOnFinalize = () => void;

export interface SceneProps
  extends Pick<AnimatedProps<"View">, "children" | "style"> {
  data: Substage;
  onStart?: SceneOnStart;
  onFinalize?: SceneOnFinalize;
  onPause?: SceneOnPause;
  onFail?: SceneOnFail;
  onStageEnd?: SceneOnComplete;
}

export default function Scene({
  data: { id },
  onStart,
  onFinalize,
  onStageEnd,
  onFail,
  onPause,
  style,
  ...props
}: SceneProps) {
  const [inScene, setInScene] = useState(false);
  const current = useAppSelector(StageSelectors.selectSubstage);
  const status = useAppSelector(StageSelectors.selectStatus);

  useEffect(() => {
    if (current === id) {
      switch (status) {
        case StageStatus.Playing:
          setInScene(true);
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

        default:
          break;
      }
    } else {
      setInScene(false);
    }
  }, [current, status]);

  useEffect(() => {
    if (inScene && onStart) {
      onStart();
    } else if (onFinalize) {
      onFinalize();
    }

    return () => {
      if (inScene && onFinalize) {
        onFinalize();
      }
    };
  }, [inScene]);

  return <Animated.View style={[styles.container, style]} {...props} />;
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
});
