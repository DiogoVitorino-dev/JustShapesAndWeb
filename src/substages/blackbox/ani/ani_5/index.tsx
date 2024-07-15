import React, { useState } from "react";
import { useWindowDimensions } from "react-native";

import Cascade from "./cascate";

import { AnimatedAttacks } from "@/animations/attacks";
import { AnimatedEffects } from "@/animations/effects";
import Scene from "@/components/game/scene";
import { Substage } from "@/store/reducers/substages/substagesReducer";
import { MathUtils } from "@/utils/mathUtils";

export const substage_5: Substage = {
  id: 5,
  duration: 17714,
};

export default function Ani_5() {
  const { percentage } = MathUtils;

  const { width, height } = useWindowDimensions();

  const grenadeSize = percentage(3, width);
  const grenadeMargin = percentage(5, width);

  const cascadeVerticalArea = percentage(50, width);
  const cascadeHorizontalArea = percentage(50, height);

  const [shake, setShake] = useState(false);
  const [cascade, setCascade] = useState(false);
  const [grenades, setGrenades] = useState(false);
  const [flash, setFlash] = useState(false);

  const handleStart = () => {
    setCascade(true);
    setShake(true);
    setFlash(true);
    setGrenades(true);
  };

  const handleFinalize = () => {
    setFlash(false);
    setShake(false);
    setCascade(false);
    setGrenades(false);
  };

  return (
    <Scene
      data={substage_5}
      onStart={handleStart}
      onFail={handleFinalize}
      onFinalize={handleFinalize}
    >
      <AnimatedEffects.Shake
        start={shake}
        duration={30000}
        amount={5}
        impact={{ frequency: 0.9, horizontal: "none", vertical: "end" }}
        style={{ width: "100%", height: "100%", position: "absolute" }}
      >
        <AnimatedEffects.Flash
          start={flash}
          numbersOfReps={-1}
          delayOfReps={500}
          intensity={5}
          duration={300}
          style={{ width: "100%", height: "100%", position: "absolute" }}
        >
          <Cascade
            start={cascade}
            delay={1000}
            side="right"
            smashTo="vertical"
            area={cascadeVerticalArea}
          />
          <Cascade
            start={cascade}
            delay={3000}
            side="left"
            smashTo="vertical"
            area={cascadeVerticalArea}
          />
          <Cascade
            start={cascade}
            delay={5000}
            side="right"
            smashTo="horizontal"
            area={cascadeHorizontalArea}
          />
          <Cascade
            start={cascade}
            delay={7000}
            side="left"
            smashTo="horizontal"
            area={cascadeHorizontalArea}
          />

          <Cascade
            start={cascade}
            delay={9000}
            attackDuration={2000}
            hideDuration={1000}
            side="left"
            smashTo="horizontal"
            area={height}
          />
          <Cascade
            start={cascade}
            attackDuration={2000}
            hideDuration={1000}
            delay={9000}
            side="left"
            smashTo="vertical"
            area={width}
          />

          <AnimatedAttacks.Grenade
            start={grenades}
            size={grenadeSize}
            distance={width}
            numbersOfReps={-1}
            fragments={9}
            duration={2000}
            x={grenadeMargin}
            y={grenadeMargin}
          />

          <AnimatedAttacks.Grenade
            start={grenades}
            size={grenadeSize}
            distance={width}
            delay={1000}
            numbersOfReps={-1}
            duration={2000}
            fragments={9}
            x={width - grenadeMargin}
            y={height - grenadeMargin}
          />
        </AnimatedEffects.Flash>
      </AnimatedEffects.Shake>
    </Scene>
  );
}
