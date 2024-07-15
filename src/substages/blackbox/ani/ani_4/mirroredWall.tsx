import React from "react";
import { useWindowDimensions } from "react-native";

import { AnimatedAttacks } from "@/animations/attacks";
import { RectangleSmashProps } from "@/animations/attacks/rectangleSmash";
import { AnimatedEffects } from "@/animations/effects";

interface MirroredWallProps extends RectangleSmashProps {}

export default function MirroredWall({
  x = 0,
  y = 0,
  initialLength = 0,
  smashTo = "horizontal",
  size = 80,
  onFinish,
  start,
  prepareDuration,
  ...props
}: MirroredWallProps) {
  const window = useWindowDimensions();
  const isHorizontal = smashTo === "horizontal";
  return (
    <AnimatedEffects.Shake
      start={start}
      duration={300}
      delay={prepareDuration}
      amount={20}
      impact={{
        horizontal: isHorizontal ? "all" : "none",
        vertical: isHorizontal ? "none" : "end",
      }}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
    >
      <AnimatedAttacks.RectangleSmash
        {...props}
        start={start}
        x={x}
        y={y}
        initialLength={initialLength}
        size={size}
        prepareDuration={prepareDuration}
        smashTo={smashTo}
      />
      <AnimatedAttacks.RectangleSmash
        {...props}
        start={start}
        x={smashTo === "vertical" ? window.width - x - size : x}
        y={smashTo === "horizontal" ? window.height - y - size : y}
        initialLength={initialLength}
        size={size}
        prepareDuration={prepareDuration}
        onFinish={onFinish}
        smashTo={smashTo}
      />
    </AnimatedEffects.Shake>
  );
}
