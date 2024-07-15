import React, { useState } from "react";
import { useWindowDimensions } from "react-native";

import SequenceBeams from "./firstPhase";

import { AnimatedAttacks } from "@/animations/attacks";
import Scene from "@/components/game/scene";
import Colors from "@/constants/Colors";
import { useAppDispatch } from "@/hooks";
import { useStageController } from "@/hooks/useStageController";
import { StageActions } from "@/store/reducers/stage/stageActions";
import { Substage } from "@/store/reducers/substages/substagesReducer";

export const substage_3: Substage = {
  id: 3,
  duration: 28000,
};

export default function Ani_3() {
  const dispatch = useAppDispatch();

  const { setSubstageColor } = useStageController();

  const { width, height } = useWindowDimensions();

  const grenadeFrags = 5;
  const grenadeMargin = 150;
  const grenadeDelayReps = 100;
  const grenadeDuration = 1500;

  const [beams, setBeams] = useState(false);
  const [grenades, setGrenades] = useState(false);

  const handleStart = () => {
    dispatch(StageActions.checkpointReached(substage_3.id));
    setGrenades(true);
    setBeams(true);
  };

  const handleFail = () => {
    setBeams(false);
    setGrenades(false);
    setSubstageColor(Colors.substage.ani.phase_1);
  };

  const updateSubstageColor = () =>
    setSubstageColor(Colors.substage.ani.phase_2);

  return (
    <Scene onStart={handleStart} onFail={handleFail}>
      <SequenceBeams start={beams} />
      <SequenceBeams start={beams} delay={6650} />
      <SequenceBeams
        start={beams}
        delay={6650 * 2}
        onFinish={updateSubstageColor}
      />

      <AnimatedAttacks.Grenade
        start={grenades}
        fragments={grenadeFrags}
        delayOfReps={grenadeDelayReps}
        distance={width}
        delay={6650}
        duration={grenadeDuration}
        numbersOfReps={-1}
        y={height / 1.3}
        x={grenadeMargin}
      />

      <AnimatedAttacks.Grenade
        start={grenades}
        fragments={grenadeFrags}
        delayOfReps={grenadeDelayReps}
        distance={width}
        delay={6650 + 250}
        duration={grenadeDuration}
        numbersOfReps={-1}
        x={width - grenadeMargin}
        y={height / 2}
      />

      <AnimatedAttacks.Grenade
        y={height / 3}
        x={grenadeMargin}
        delay={6650 + 500}
        start={grenades}
        fragments={grenadeFrags}
        delayOfReps={grenadeDelayReps}
        numbersOfReps={-1}
        distance={width}
        duration={grenadeDuration}
      />
    </Scene>
  );
}
