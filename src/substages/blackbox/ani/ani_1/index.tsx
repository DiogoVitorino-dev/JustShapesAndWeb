import React, { useState } from "react";

import { Rain } from "./rain";

import Scene from "@/components/game/scene";
import { useStageTimer } from "@/scripts/stageController/useStageTimer";
import { Substage } from "@/store/reducers/substages/substagesReducer";
import { TimerUtils } from "@/utils/timerUtils";

export const substage_1: Substage = {
  id: 1,
  duration: 14700,
};

export default function Ani_1() {
  const { addTimer, removeTimer } = useStageTimer();

  const [grenade_1, setGrenade_1] = useState(false);
  const [grenade_2, setGrenade_2] = useState(false);
  const [grenade_3, setGrenade_3] = useState(false);
  const [grenade_4, setGrenade_4] = useState(false);
  const [grenade_5, setGrenade_5] = useState(false);

  const setupGrenades = () => {
    const { setTimer } = TimerUtils;

    addTimer(setTimer(() => setGrenade_1(true), 5000));
    addTimer(setTimer(() => setGrenade_2(true), 6000));
    addTimer(setTimer(() => setGrenade_3(true), 7000));
    addTimer(setTimer(() => setGrenade_4(true), 8000));
    addTimer(setTimer(() => setGrenade_5(true), 9000));
  };

  const handleStart = () => {
    setupGrenades();
  };

  const handleFail = () => {
    setGrenade_1(false);
    setGrenade_2(false);
    setGrenade_3(false);
    setGrenade_4(false);
    setGrenade_5(false);
    removeTimer();
  };

  const handleFinalize = () => {
    removeTimer();
  };

  return (
    <Scene
      onStart={handleStart}
      onFail={handleFail}
      onFinalize={handleFinalize}
    >
      <Rain start={grenade_1} fragments={1} duration={2000} />
      <Rain start={grenade_2} fragments={2} duration={2500} />
      <Rain start={grenade_3} fragments={3} duration={3000} />
      <Rain start={grenade_4} fragments={3} duration={4000} />
      <Rain start={grenade_5} fragments={3} duration={6000} />
    </Scene>
  );
}
