import { Stack } from "expo-router";
import React from "react";
import Animated, { SharedValue } from "react-native-reanimated";

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

type AnimatedViewOptions = Extract<
  keyof typeof Animated,
  "FlatList" | "Image" | "ScrollView" | "Text" | "View"
>;

export type AnimatedProps<T extends AnimatedViewOptions> = React.ComponentProps<
  (typeof Animated)[T]
>;

export type StackScreenOptions = Pick<
  React.ComponentProps<typeof Stack>,
  "screenOptions"
>["screenOptions"];

export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export type DisplayOptions = "flex" | "none";
