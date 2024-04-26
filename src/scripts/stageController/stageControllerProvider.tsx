import React, { createContext, useEffect, useMemo, useState } from "react";

import { MusicContext, useMusicContext } from "@/audio/music";
import CheckpointReached from "@/components/game/checkpointReached";
import ControllablePlayer from "@/components/game/controllablePlayer";
import GameOver from "@/components/game/gameOver";
import LostLife from "@/components/game/lostLife";
import StageName from "@/components/game/stageName";
import { Loading } from "@/components/shared";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { PlayerActions } from "@/store/reducers/player/playerActions";
import { StageActions } from "@/store/reducers/stages/stagesActions";
import { StageStatus } from "@/store/reducers/stages/stagesReducer";
import { StagesSelectors } from "@/store/reducers/stages/stagesSelectors";
import { SubstageActions } from "@/store/reducers/substages/substagesActions";
import { Substage } from "@/store/reducers/substages/substagesReducer";
import { SubstagesSelectors } from "@/store/reducers/substages/substagesSelectors";
import { Timer, TimerUtils } from "@/utils/timerUtils";

type MusicList = Parameters<MusicContext["play"]>[0];

type StageControllerLoad = (
  stage: string,
  substages: Substage[],
  music: MusicList,
) => Promise<void>;

type StageControllerUnload = () => Promise<void>;

interface StageController {
  /**
   * @DocMissing
   */
  load: StageControllerLoad;

  /**
   * @DocMissing
   */
  unload: StageControllerUnload;
}

export const StageControllerContext = createContext<StageController>({
  load: async () => {},
  unload: async () => {},
});

interface ProviderProps {
  children: React.JSX.Element | React.JSX.Element[];
}

export default function StageControllerProvider({ children }: ProviderProps) {
  const dispatch = useAppDispatch();
  const { track, pause, play, setProgress } = useMusicContext();

  const [music, setMusic] = useState<MusicList>();
  const [timerController, setTimerController] = useState<Timer>();

  const substage = useAppSelector(StagesSelectors.selectSubstage);
  const allSubstages = useAppSelector(SubstagesSelectors.selectAllSubstages);
  const status = useAppSelector(StagesSelectors.selectStatus);

  const load: StageControllerLoad = async (stage, substages, music) => {
    const first = substages.reduce(
      (prev, curr) => Math.min(prev, curr.id),
      Number.MAX_SAFE_INTEGER,
    );

    dispatch(SubstageActions.loaded({ stage, substages }));

    dispatch(StageActions.loaded({ name: stage, initialSubstage: first }));

    setMusic(music);
  };

  const unload: StageControllerUnload = async () => {
    dispatch(SubstageActions.unloaded());
    dispatch(StageActions.unloaded());
    dispatch(PlayerActions.restored());
    setMusic(undefined);
    timerController?.clear();
    await pause();
  };

  const start = () => {
    dispatch(StageActions.statusUpdated(StageStatus.Playing));
  };

  const switchingSubstages = async () => {
    const { setTimer } = TimerUtils;
    const currentIndex = allSubstages.findIndex(({ id }) => id === substage);

    const current = allSubstages[currentIndex];
    const next = allSubstages[currentIndex + 1];

    if (current) {
      await setProgress(current.musicStartTime);

      let callback = () => {
        dispatch(StageActions.statusUpdated(StageStatus.Completed));
      };

      if (next) {
        callback = () => {
          dispatch(StageActions.chosenSubstage(next.id));
        };
      }
      setTimerController(setTimer(callback, current.duration));
    }
  };

  const stageProgressControl = () => {
    if (substage !== undefined && status === StageStatus.Playing) {
      switchingSubstages();
    }
  };

  const musicControl = async () => {
    switch (status) {
      case StageStatus.Idle:
      case StageStatus.Failed:
        await pause(3000);
        break;

      case StageStatus.Paused:
        await pause(1000);
        break;

      case StageStatus.Playing:
        if (!track) {
          await play(music);
        } else {
          await play();
        }
        break;
    }
  };

  const timerControl = () => {
    switch (status) {
      case StageStatus.Idle:
      case StageStatus.Failed:
        timerController?.clear();
        break;

      case StageStatus.Paused:
        timerController?.stop();
        break;

      case StageStatus.Playing:
        timerController?.resume();
        break;
    }
  };

  useEffect(() => {
    stageProgressControl();
  }, [substage, status]);

  useEffect(() => {
    timerControl();
  }, [status, timerController]);

  useEffect(() => {
    musicControl();
  }, [status, track, music, pause, play]);

  const value = useMemo(() => ({ unload, load }), [unload, load]);

  return (
    <StageControllerContext.Provider value={value}>
      {children}
      <ControllablePlayer />
      <StageName onFinish={start} />
      <CheckpointReached />
      <LostLife />
      <GameOver />
      {!substage ? <Loading /> : null}
    </StageControllerContext.Provider>
  );
}