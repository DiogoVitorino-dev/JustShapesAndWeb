import { StyleProp, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

export interface Position {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export type AnimatedViewStyle = StyleProp<
  Animated.AnimateStyle<StyleProp<ViewStyle>>
>;
