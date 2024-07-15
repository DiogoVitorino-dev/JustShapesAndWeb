import React, { useState } from "react";
import { useWindowDimensions } from "react-native";

import MirroredWall from "./mirroredWall";

import Scene from "@/components/game/scene";
import { useStageTimer } from "@/scripts/stageController/useStageTimer";
import { Substage } from "@/store/reducers/substages/substagesReducer";
import { TimerUtils } from "@/utils/timerUtils";

export const substage_4: Substage = {
  id: 4,
  duration: 7895,
};

export default function Ani_4() {
  const { setTimer } = TimerUtils;
  const { addTimer, removeTimer } = useStageTimer();
  const { width, height } = useWindowDimensions();

  const [wall, setWall] = useState<boolean[]>([]);

  const wallDecreasingDelay = [
    585, 585, 585, 585, 585, 585, 585, 400, 400, 400, 400, 400, 400, 400, 400,
  ];

  const wallPrepare = 500;
  const wallAttackDuration = 9000;
  const wallHideDuration = 500;

  const wallSizeVertical = width / 20;
  const wallSizeHorizontal = height / 20;

  const setupWalls = () => {
    wallDecreasingDelay.reduce((time, delay, index) => {
      addTimer(
        setTimer(
          () =>
            setWall((prev) => {
              prev[index] = true;
              return [...prev];
            }),
          time,
        ),
      );

      return time + delay;
    }, 0);
  };

  const handleStart = async () => {
    setupWalls();
  };

  const handleFinalize = () => {
    setWall((prev) => prev.map(() => false));
    removeTimer();
  };

  return (
    <Scene
      data={substage_4}
      onStart={handleStart}
      onFail={handleFinalize}
      onFinalize={handleFinalize}
    >
      <MirroredWall
        start={wall[0]}
        smashTo="vertical"
        size={wallSizeVertical}
        prepareDuration={wallPrepare}
        hideDuration={wallHideDuration}
        attackDuration={wallAttackDuration}
      />

      <MirroredWall
        start={wall[1]}
        smashTo="vertical"
        size={wallSizeVertical}
        prepareDuration={wallPrepare}
        hideDuration={wallHideDuration}
        attackDuration={wallAttackDuration}
        x={wallSizeVertical}
      />

      <MirroredWall
        start={wall[2]}
        smashTo="vertical"
        size={wallSizeVertical}
        prepareDuration={wallPrepare}
        hideDuration={wallHideDuration}
        attackDuration={wallAttackDuration}
        x={wallSizeVertical * 2}
      />

      <MirroredWall
        start={wall[3]}
        smashTo="vertical"
        size={wallSizeVertical}
        prepareDuration={wallPrepare}
        hideDuration={wallHideDuration}
        attackDuration={wallAttackDuration}
        x={wallSizeVertical * 3}
      />

      <MirroredWall
        start={wall[4]}
        smashTo="vertical"
        size={wallSizeVertical}
        prepareDuration={wallPrepare}
        hideDuration={wallHideDuration}
        attackDuration={wallAttackDuration}
        x={wallSizeVertical * 4}
      />

      <MirroredWall
        start={wall[5]}
        smashTo="vertical"
        size={wallSizeVertical}
        prepareDuration={wallPrepare}
        hideDuration={wallHideDuration}
        attackDuration={wallAttackDuration}
        x={wallSizeVertical * 5}
      />

      <MirroredWall
        start={wall[6]}
        smashTo="vertical"
        size={wallSizeVertical}
        prepareDuration={wallPrepare}
        hideDuration={wallHideDuration}
        attackDuration={wallAttackDuration}
        x={wallSizeVertical * 6}
      />
      <MirroredWall
        start={wall[7]}
        smashTo="vertical"
        size={wallSizeVertical}
        prepareDuration={wallPrepare}
        hideDuration={wallHideDuration}
        attackDuration={wallAttackDuration}
        x={wallSizeVertical * 7}
      />
      <MirroredWall
        start={wall[8]}
        smashTo="horizontal"
        size={wallSizeHorizontal}
        prepareDuration={wallPrepare}
        hideDuration={wallHideDuration}
        attackDuration={wallAttackDuration}
      />

      <MirroredWall
        start={wall[9]}
        smashTo="horizontal"
        size={wallSizeHorizontal}
        prepareDuration={wallPrepare}
        hideDuration={wallHideDuration}
        y={wallSizeHorizontal}
        attackDuration={wallAttackDuration}
      />

      <MirroredWall
        start={wall[10]}
        smashTo="horizontal"
        size={wallSizeHorizontal}
        prepareDuration={wallPrepare}
        hideDuration={wallHideDuration}
        attackDuration={wallAttackDuration}
        y={wallSizeHorizontal * 2}
      />

      <MirroredWall
        start={wall[11]}
        smashTo="horizontal"
        size={wallSizeHorizontal}
        prepareDuration={wallPrepare}
        hideDuration={wallHideDuration}
        attackDuration={wallAttackDuration}
        y={wallSizeHorizontal * 3}
      />

      <MirroredWall
        start={wall[12]}
        smashTo="horizontal"
        size={wallSizeHorizontal}
        prepareDuration={wallPrepare}
        hideDuration={wallHideDuration}
        attackDuration={wallAttackDuration}
        y={wallSizeHorizontal * 3}
      />

      <MirroredWall
        start={wall[13]}
        smashTo="horizontal"
        size={wallSizeHorizontal}
        prepareDuration={wallPrepare}
        hideDuration={wallHideDuration}
        attackDuration={wallAttackDuration}
        y={wallSizeHorizontal * 4}
      />

      <MirroredWall
        start={wall[14]}
        smashTo="horizontal"
        size={wallSizeHorizontal}
        prepareDuration={wallPrepare}
        hideDuration={wallHideDuration}
        attackDuration={wallAttackDuration}
        y={wallSizeHorizontal * 5}
      />
      <MirroredWall
        start={wall[15]}
        smashTo="horizontal"
        size={wallSizeHorizontal}
        prepareDuration={wallPrepare}
        hideDuration={wallHideDuration}
        attackDuration={wallAttackDuration}
        y={wallSizeHorizontal * 6}
      />

      <MirroredWall
        start={wall[16]}
        smashTo="horizontal"
        size={wallSizeHorizontal}
        prepareDuration={wallPrepare}
        hideDuration={wallHideDuration}
        attackDuration={wallAttackDuration}
        y={wallSizeHorizontal * 7}
      />
    </Scene>
  );
}
