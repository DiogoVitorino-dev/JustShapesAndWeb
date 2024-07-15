import React, { useState } from "react";
import { useWindowDimensions } from "react-native";

import { AnimatedAttacks } from "@/animations/attacks";
import { AnimatedEffects } from "@/animations/effects";
import Scene from "@/components/game/scene";
import { Substage } from "@/store/reducers/substages/substagesReducer";

export const substage_2: Substage = {
  id: 2,
  duration: 7600,
};

export default function Ani_2() {
  const { width, height } = useWindowDimensions();

  const [beam, setBeam] = useState(false);
  const [grenade, setGrenade] = useState(false);
  const [flash, setFlash] = useState(false);

  const handleStart = () => {
    setFlash(true);
    setGrenade(true);
    setBeam(true);
  };

  const handleFail = () => {
    setGrenade(false);
    setFlash(false);
    setBeam(false);
  };

  return (
    <AnimatedEffects.Flash
      start={flash}
      numbersOfReps={8}
      delayOfReps={800}
      duration={300}
      style={{ width: "100%", height: "100%", position: "absolute" }}
    >
      <Scene onStart={handleStart} onFail={handleFail}>
        <AnimatedAttacks.Grenade
          start={grenade}
          duration={2000}
          distance={height * 2}
          numbersOfReps={4}
          y={height / 2}
          x={width - 100}
        />

        <AnimatedAttacks.Grenade
          start={grenade}
          duration={2000}
          delay={1000}
          distance={height * 2}
          numbersOfReps={4}
          x={100}
          y={height / 2}
        />

        <AnimatedAttacks.Beam start={beam} size={100} />
        <AnimatedAttacks.Beam start={beam} delay={500} size={100} y={height} />
        <AnimatedAttacks.Beam
          start={beam}
          delay={1500}
          size={150}
          x={width / 1.4}
          direction="vertical"
        />
        <AnimatedAttacks.Beam
          start={beam}
          delay={2000}
          size={150}
          x={width / 6}
          direction="vertical"
        />
        <AnimatedAttacks.Beam
          start={beam}
          delay={2500}
          size={100}
          length={width + 200}
          x={-100}
          y={height / 2}
          direction="vertical"
        />
        <AnimatedAttacks.Beam
          start={beam}
          delay={3500}
          size={100}
          length={width + 200}
          x={-100}
          y={height / 2}
          direction="vertical"
        />
        <AnimatedAttacks.Beam
          start={beam}
          delay={4000}
          size={height / 3}
          y={(height - 200) / 2}
        />
      </Scene>
    </AnimatedEffects.Flash>
  );
}
