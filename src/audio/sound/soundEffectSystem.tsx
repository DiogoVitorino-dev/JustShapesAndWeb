import { Sound } from "expo-av/build/Audio";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  PlaybackFunctions,
  PlaybackProps,
  PlaybackStatus,
  PlaybackGetProgress,
  PlaybackPause,
  PlaybackPlay,
  PlaybackSetProgress,
  PlaybackSetVolume,
  PlaybackLoadAndPlay,
} from "../audio.types";

export interface SoundEffects extends PlaybackFunctions, PlaybackProps {}

const SoundEffectsContext = createContext<SoundEffects>({
  status: PlaybackStatus.IDLE,
  player: new Sound(),
  pause: async () => {},
  loadAndPlay: async () => {},
  setProgress: async () => {},
  getProgress: async () => -1,
  play: async () => {},
  setVolume: async () => {},
});

export const useSoundEffects = () => useContext(SoundEffectsContext);

interface ProviderProps {
  children: React.JSX.Element | React.JSX.Element[];
}

export default function SoundEffectProvider({ children }: ProviderProps) {
  const [player] = useState<Sound>(new Sound());
  const [status, setStatus] = useState<PlaybackStatus>(0);
  const [error, setError] = useState<Error | undefined>();

  const loadAndPlay: PlaybackLoadAndPlay = async (source, autoplay = true) => {
    try {
      if (status !== PlaybackStatus.BUFFERING) {
        if (status !== PlaybackStatus.IDLE) {
          if (status === PlaybackStatus.PLAYING) {
            await player.stopAsync();
          }
          await player.unloadAsync();
        }

        await player.loadAsync(source);

        if (autoplay) {
          await player.playAsync();
        }
      }
    } catch (error: any) {
      setError(new Error(error.message));
    }
  };

  const pause: PlaybackPause = async () => {
    try {
      if (status === PlaybackStatus.PLAYING) {
        await player.pauseAsync();
      }
    } catch (error: any) {
      setError(new Error(error.message));
    }
  };

  const play: PlaybackPlay = async () => {
    try {
      switch (status) {
        case PlaybackStatus.LOADED:
        case PlaybackStatus.FINISHED:
          await player.playAsync();
          break;
      }
    } catch (error: any) {
      setError(new Error(error.message));
    }
  };

  const setProgress: PlaybackSetProgress = async (progress) => {
    try {
      if (status !== PlaybackStatus.IDLE) {
        await player.setPositionAsync(progress);
      }
    } catch (error: any) {
      setError(new Error(error.message));
    }
  };

  const setVolume: PlaybackSetVolume = async (volume) => {
    try {
      await player.setVolumeAsync(volume);
    } catch (error: any) {
      setError(new Error(error.message));
    }
  };

  const getProgress: PlaybackGetProgress = async () => {
    try {
      const currentStatus = await player.getStatusAsync();
      if (currentStatus.isLoaded) {
        return currentStatus.positionMillis;
      }
    } catch (error: any) {
      setError(new Error(error.message));
    }
    return -1;
  };

  const init = () => {
    player.setOnPlaybackStatusUpdate(statusListener(player));
    setStatus(PlaybackStatus.IDLE);
  };

  const statusListener = (player: Sound) =>
    (player._onPlaybackStatusUpdate = (playbackStatus) => {
      if (playbackStatus.isLoaded) {
        if (playbackStatus.isBuffering) {
          setStatus(PlaybackStatus.BUFFERING);
        } else if (playbackStatus.didJustFinish) {
          setStatus(PlaybackStatus.FINISHED);
        } else if (playbackStatus.isPlaying) {
          setStatus(PlaybackStatus.PLAYING);
        } else {
          setStatus(PlaybackStatus.LOADED);
        }
      } else {
        if (playbackStatus.error) {
          setError(new Error(playbackStatus.error));
        }
      }
    });

  useEffect(() => {
    init();
  }, []);

  const value = useMemo(
    () => ({
      player,
      status,
      error,
      play,
      pause,
      loadAndPlay,
      setProgress,
      setVolume,
      getProgress,
    }),
    [player, status, error],
  );
  return (
    <SoundEffectsContext.Provider value={value}>
      {children}
    </SoundEffectsContext.Provider>
  );
}
