import { ViewProps } from "react-native";

import { AnimatedProps } from "@/constants/commonTypes";

export interface AnimatedEffectProps {
  view?: Omit<AnimatedProps<"View">, "style" | "children">;
  children?: ViewProps["children"];
  style?: AnimatedProps<"View">["style"];
}

export interface RunnableAnimation {
  start: boolean;
  onFinish?: () => void;
}
