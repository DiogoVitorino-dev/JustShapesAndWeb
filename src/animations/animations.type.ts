import { ViewProps } from "react-native";
import { AnimatedProps } from "react-native-reanimated";

import { AnimatedStyleApp } from "@/constants/commonTypes";

export interface AnimationEffectProps {
  view?: Omit<AnimatedProps<ViewProps>, "style" | "children">;
  children?: AnimatedProps<ViewProps>["children"];
  style?: AnimatedStyleApp;
}

export interface RunnableAnimation {
  start: boolean;
  onFinish?: () => void;
}
