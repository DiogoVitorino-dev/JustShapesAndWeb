import React, { useCallback } from "react";
import { useWindowDimensions } from "react-native";

import { AnimatedAttacks } from "@/animations/attacks";
import { RectangleSmashProps } from "@/animations/attacks/rectangleSmash";
import { View } from "@/components/shared";
import { Position } from "@/constants/commonTypes";

type CascadeSide = "left" | "right";

interface CascadeProps extends Omit<RectangleSmashProps, "x" | "y"> {
  side?: CascadeSide;
  quantity?: number;
  timeBetweenAttacks?: number;
  area?: number;
}

export default function Cascade({
  size = 50,
  smashTo = "vertical",
  side = "right",
  quantity = 5,
  delay = 0,
  timeBetweenAttacks = 100,
  area = 300,
  onFinish,
  ...props
}: CascadeProps) {
  const { width, height } = useWindowDimensions();

  const adjustPosition = useCallback(() => {
    const pos: Position[] = [];

    const autoGap = (area - size) / (quantity - 1);

    if (autoGap < 0) {
      size -= autoGap;
    }

    let x = 0;
    let y = 0;

    if (side === "left") {
      for (let index = 0; index < quantity; index++) {
        switch (smashTo) {
          case "vertical":
            x += !index ? 0 : autoGap;
            break;

          case "horizontal":
            y += !index ? 0 : autoGap;
            break;
        }
        pos.push({ x, y });
      }
    } else {
      x = smashTo === "horizontal" ? 0 : width;
      y = smashTo === "vertical" ? 0 : height;

      for (let index = 1; index <= quantity; index++) {
        switch (smashTo) {
          case "vertical":
            x -= !index ? 0 : autoGap;
            break;

          case "horizontal":
            y -= !index ? 0 : autoGap;
            break;
        }

        pos.push({ x, y });
      }
    }

    return pos;
  }, [width, height, size, quantity, smashTo, area]);

  const position: Position[] = adjustPosition();

  const views: React.JSX.Element[] = [];

  for (let index = 1; index <= quantity; index++) {
    const { x, y } = position[index - 1];

    views.push(
      <AnimatedAttacks.RectangleSmash
        size={size}
        delay={delay + timeBetweenAttacks * index}
        x={x}
        y={y}
        smashTo={smashTo}
        onFinish={index === quantity ? onFinish : undefined}
        key={"cascade_" + index}
        {...props}
      />,
    );
  }

  return <View style={{ position: "absolute" }}>{views}</View>;
}
