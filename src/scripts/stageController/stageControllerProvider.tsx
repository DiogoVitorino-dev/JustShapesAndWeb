import React, { createContext, useEffect, useMemo, useRef } from "react";

import { useStageTimer } from "./useStageTimer";

import { MusicContext, useMusicContext } from "@/audio/music";
import CheckpointReached from "@/components/game/checkpointReached";
import ControllablePlayer from "@/components/game/controllablePlayer";
import GameOver from "@/components/game/gameOver";
import LostLife from "@/components/game/lostLife";
import StageName from "@/components/game/stageName";
import Thanks from "@/components/game/thanks";
import { Loading } from "@/components/shared";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { PlayerActions } from "@/store/reducers/player/playerActions";
import { StageActions } from "@/store/reducers/stage/stageActions";
import { StageStatus } from "@/store/reducers/stage/stageReducer";
import { StageSelectors } from "@/store/reducers/stage/stageSelectors";
import { SubstageActions } from "@/store/reducers/substages/substagesActions";
import { Substage } from "@/store/reducers/substages/substagesReducer";
import { SubstagesSelectors } from "@/store/reducers/substages/substagesSelectors";
import { TimerUtils } from "@/utils/timerUtils";

type MusicList = Parameters<MusicContext["playMusic"]>[0];

type StageControllerLoad = (
  stage: string,
  substages: Substage[],
  music?: MusicList,
) => void;

type StageControllerUnload = () => void;
type StageControllerSelectSubstage = (id: number) => void;

interface StageController {
  /**
   * @DocMissing
   */
  load: StageControllerLoad;

  /**
   * @DocMissing
   */
  unload: StageControllerUnload;

  /**
   * @DocMissing
   */
  selectSubstage: StageControllerSelectSubstage;
}

export const StageControllerContext = createContext<StageController>({
  load: () => {},
  unload: () => {},
  selectSubstage: () => {},
});

enum TimerID {
  STAGE,
}

interface ProviderProps {
  children?: React.JSX.Element | React.JSX.Element[];
}

export default function StageControllerProvider({ children }: ProviderProps) {
  const { pause, stop, play, setProgress, playMusic, getCurrentTrack } =
    useMusicContext();
  const music = useRef<MusicList>();

  const timerController = useStageTimer();

  const dispatch = useAppDispatch();
  const substage = useAppSelector(StageSelectors.selectSubstage);
  const allSubstages = useAppSelector(SubstagesSelectors.selectAllSubstages);
  const status = useAppSelector(StageSelectors.selectStatus);

  const load: StageControllerLoad = (stage, substages, newMusic) => {
    music.current = newMusic;

    const first = substages.reduce(
      (prev, curr) => Math.min(prev, curr.id),
      Number.MAX_SAFE_INTEGER,
    );

    dispatch(SubstageActions.loaded({ stage, substages }));

    dispatch(StageActions.loaded({ name: stage, initialSubstage: first }));
  };

  const unload: StageControllerUnload = async () => {
    dispatch(SubstageActions.unloaded());
    dispatch(StageActions.unloaded());
    dispatch(PlayerActions.restored());
    await stop(500);
  };

  const selectSubstage: StageControllerSelectSubstage = async (id) => {
    const selected = allSubstages.find((item) => item.id === id);

    if (selected && music.current) {
      await playMusic(music.current);
      await setProgress(selected.musicStartTime);

      timerController.pauseTimer();
      dispatch(StageActions.chosenSubstage(id));
    }
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
      let callback = () => {
        dispatch(StageActions.statusUpdated(StageStatus.Completed));
      };

      if (next) {
        callback = () => {
          dispatch(StageActions.chosenSubstage(next.id));
        };
      }

      timerController.upsertTimer(
        setTimer(callback, current.duration),
        TimerID.STAGE,
      );
    }
  };

  const stageProgressControl = () => {
    if (substage !== undefined && status === StageStatus.Playing) {
      switchingSubstages();
    }
  };

  const musicControl = async () => {
    switch (status) {
      case StageStatus.Playing:
        if (music.current && music.current !== getCurrentTrack()?.title)
          await playMusic(music.current);

        await play(500);
        break;

      case StageStatus.Paused:
        await pause(1000);
        break;

      case StageStatus.Failed:
      case StageStatus.Completed:
        await stop(3000);
        break;
    }
  };

  const timerControl = () => {
    switch (status) {
      case StageStatus.Failed:
      case StageStatus.Completed:
        timerController.removeTimer(TimerID.STAGE);
        break;

      case StageStatus.Paused:
        timerController.pauseTimer(TimerID.STAGE);
        break;

      case StageStatus.Playing:
        timerController.resumeTimer(TimerID.STAGE);
        break;
    }
  };

  useEffect(() => {
    stageProgressControl();
  }, [status, substage]);

  useEffect(() => {
    timerControl();
    musicControl();
  }, [status]);

  useEffect(
    () => () => {
      unload();
    },
    [],
  );

  const value = useMemo(
    () => ({ unload, load, selectSubstage }),
    [unload, load, selectSubstage],
  );

  return (
    <StageControllerContext.Provider value={value}>
      {children}
      <ControllablePlayer />
      <StageName onFinish={start} />
      <CheckpointReached />
      <LostLife />
      <GameOver />
      <Thanks />
      {!substage ? <Loading /> : null}
    </StageControllerContext.Provider>
  );
}
