import React, { useMemo, useState } from "react";
import Animated, {
  SharedValue,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
} from "react-native-reanimated";

import Particle, { ParticleConfig } from "./particle";

import { Position } from "@/constants/commonTypes";
import { PlayerData } from "@/models/player";
import { MathUtils } from "@/utils/mathUtils";

export interface PlayerMovementAnimation {
  data: Readonly<SharedValue<Required<PlayerData>>>;
  particle?: Omit<ParticleConfig, keyof Position>;
}

export function PlayerMovementEffect({
  data,
  particle,
}: PlayerMovementAnimation) {
  const particleSize = data.value.width / 3;
  const particleDistance = data.value.width * 2;
  const areaHeight = data.value.height;

  const [start, setStart] = useState(false);

  const animatedArea = useAnimatedStyle(() => ({
    position: "absolute",
  }));

  useAnimatedReaction(
    () => `${data.value.x} ${data.value.y}`,
    (curr, prev) => {
      if (prev && prev !== curr) {
        runOnJS(setStart)(true);
      } else {
        runOnJS(setStart)(false);
      }
    },
  );

  const createParticles = useMemo(() => {
    const { random } = MathUtils;
    const particles: React.JSX.Element[] = [];
    const quantity = areaHeight / particleSize;

    for (let index = 0; index < quantity; index++) {
      particles.push(
        <Particle
          start={start}
          size={random(particleSize / 3, particleSize)}
          distance={random(10, particleDistance)}
          duration={random(100, 600)}
          {...particle}
          key={`particles${index}`}
        />,
      );
    }

    return particles;
  }, [start]);

  return <Animated.View style={animatedArea}>{createParticles}</Animated.View>;
}
