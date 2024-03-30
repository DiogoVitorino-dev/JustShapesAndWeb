import { ViewProps } from "react-native";
import { AnimatedProps } from "react-native-reanimated";

import { AnimatedStyleApp } from "@/constants/commonTypes";

export interface AnimatedEffectProps {
  view?: Omit<AnimatedProps<ViewProps>, "style" | "children">;
  children?: ViewProps["children"];
  style?: AnimatedStyleApp;
}

export interface RunnableAnimation {
  start: boolean;
  onFinish?: () => void;
}
