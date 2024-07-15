import React from "react";
import { useWindowDimensions } from "react-native";

import { AnimatedAttacks } from "@/animations/attacks";
import { GrenadeProps } from "@/animations/attacks/grenade";
import { View } from "@/components/shared";
import { MathUtils } from "@/utils/mathUtils";

interface RainProps
  extends Omit<GrenadeProps, "distance" | "x" | "y" | "delay"> {
  timeBetweenExplosions?: number;
}

export function Rain({
  duration = 100,
  fragments = 5,
  size = 20,
  timeBetweenExplosions = 200,
  ...props
}: RainProps) {
  const { random } = MathUtils;
  const { width, height } = useWindowDimensions();

  const distance = height * 2;

  return (
    <View style={{ width, height, position: "absolute" }}>
      <AnimatedAttacks.Grenade
        {...props}
        distance={distance}
        duration={duration}
        fragments={fragments}
        size={size}
        rotate={random(0, 360)}
      />

      <AnimatedAttacks.Grenade
        {...props}
        distance={distance}
        duration={duration}
        fragments={fragments}
        size={size}
        delay={timeBetweenExplosions}
        rotate={random(0, 360)}
        x={width / 2.5}
      />

      <AnimatedAttacks.Grenade
        {...props}
        distance={distance}
        duration={duration}
        fragments={fragments}
        size={size}
        delay={timeBetweenExplosions * 2}
        rotate={random(0, 360)}
        x={width / 1.5}
      />

      <AnimatedAttacks.Grenade
        {...props}
        distance={distance}
        duration={duration}
        fragments={fragments}
        size={size}
        delay={timeBetweenExplosions * 3}
        rotate={random(0, 360)}
        x={width}
      />

      <AnimatedAttacks.Grenade
        {...props}
        distance={distance}
        duration={duration}
        fragments={fragments}
        size={size}
        delay={timeBetweenExplosions * 4}
        rotate={random(0, 360)}
        y={height}
      />

      <AnimatedAttacks.Grenade
        {...props}
        distance={distance}
        duration={duration}
        fragments={fragments}
        size={size}
        delay={timeBetweenExplosions * 5}
        rotate={random(0, 360)}
        x={width / 2.5}
        y={height}
      />

      <AnimatedAttacks.Grenade
        {...props}
        distance={distance}
        duration={duration}
        fragments={fragments}
        size={size}
        delay={timeBetweenExplosions * 6}
        rotate={random(0, 360)}
        x={width / 1.5}
        y={height}
      />

      <AnimatedAttacks.Grenade
        {...props}
        distance={distance}
        duration={duration}
        fragments={fragments}
        size={size}
        delay={timeBetweenExplosions * 7}
        rotate={random(0, 360)}
        x={width}
        y={height}
      />
    </View>
  );
}
