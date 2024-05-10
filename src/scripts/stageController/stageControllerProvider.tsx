import React, {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useTimerController } from "./useTimerController";

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

type MusicList = Parameters<MusicContext["play"]>[0];

type StageControllerLoad = (
  stage: string,
  substages: Substage[],
  music?: MusicList,
) => void;

type StageControllerUnload = () => void;

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

type Cleanup = () => Promise<void> | void;

interface ProviderProps {
  children?: React.JSX.Element | React.JSX.Element[];
}

export default function StageControllerProvider({ children }: ProviderProps) {
  const dispatch = useAppDispatch();
  const { track, pause, play, setProgress } = useMusicContext();

  const [music, setMusic] = useState<MusicList>();
  const { setTimer, removeTimer } = useTimerController();

  const cleanup = useRef<Cleanup>();

  const substage = useAppSelector(StageSelectors.selectSubstage);
  const allSubstages = useAppSelector(SubstagesSelectors.selectAllSubstages);
  const status = useAppSelector(StageSelectors.selectStatus);

  const load: StageControllerLoad = (stage, substages, music) => {
    const first = substages.reduce(
      (prev, curr) => Math.min(prev, curr.id),
      Number.MAX_SAFE_INTEGER,
    );

    dispatch(SubstageActions.loaded({ stage, substages }));

    dispatch(StageActions.loaded({ name: stage, initialSubstage: first }));

    setMusic(music);
  };

  const unload: StageControllerUnload = () => {
    if (cleanup.current) {
      cleanup.current();
    }
    removeTimer();

    dispatch(SubstageActions.unloaded());
    dispatch(StageActions.unloaded());
    dispatch(PlayerActions.restored());
  };

  const start = () => {
    dispatch(StageActions.statusUpdated(StageStatus.Playing));
  };

  const switchingSubstages = async () => {
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

      setTimer(TimerUtils.setTimer(callback, current.duration));
    }
  };

  const stageProgressControl = () => {
    if (substage !== undefined && status === StageStatus.Playing) {
      switchingSubstages();
    }
  };

  const musicControl = async () => {
    switch (status) {
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

      default:
        await pause(3000);
        break;
    }
    cleanup.current = () => {
      pause();
      setProgress(0);
    };
  };

  useEffect(() => {
    stageProgressControl();
  }, [status, substage]);

  useEffect(() => {
    musicControl();
  }, [status, pause, play]);

  useEffect(
    () => () => {
      unload();
    },
    [],
  );

  const value = useMemo(() => ({ unload, load }), [unload, load]);

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
