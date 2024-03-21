import { Stack } from "expo-router";
import { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";
import { AnimatedStyle, SharedValue } from "react-native-reanimated";

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export type Diameter = number;

export type Angle = number;

export type AnimatedPosition = SharedValue<Position>;
export type AnimatedSize = SharedValue<Size>;
export type AnimatedAngle = SharedValue<Angle>;

export type AnimatedStyleApp = StyleProp<
  AnimatedStyle<StyleProp<ViewStyle | TextStyle | ImageStyle>>
>;

export type StackScreenOptions = Pick<
  React.ComponentProps<typeof Stack>,
  "screenOptions"
>["screenOptions"];
