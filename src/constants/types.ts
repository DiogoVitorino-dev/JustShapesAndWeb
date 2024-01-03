import { ImageStyle, TextStyle, ViewStyle } from "react-native";
import { AnimatedStyleProp, SharedValue } from "react-native-reanimated";

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export type Angle = number;

export type AnimatedPosition = SharedValue<Position>;
export type AnimatedSize = SharedValue<Size>;
export type AnimatedAngle = SharedValue<Angle>;

export type AnimatedStyleApp = AnimatedStyleProp<
  ViewStyle | ImageStyle | TextStyle
>;
