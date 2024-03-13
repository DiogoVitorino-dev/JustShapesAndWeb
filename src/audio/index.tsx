import { Sound } from "expo-av/build/Audio";
import { useEffect, useMemo, useState } from "react";

import {
  AudioStatus,
  AudioGetProgress,
  AudioPause,
  AudioPlay,
  AudioSetProgress,
  AudioSetVolume,
  AudioLoad,
  AudioPlaylist,
  AudioTrack,
} from "./audio.types";

import { MathUtils } from "@/utils/mathUtils";

export function useAudioSystem() {
  const [player] = useState<Sound>(new Sound());
  const [volumeTrack, setVolumeTrack] = useState(0.5);
  const [status, setStatus] = useState<AudioStatus>(AudioStatus.IDLE);
  const [playlist, setPlaylist] = useState<AudioPlaylist>([]);
  const [track, setTrack] = useState<AudioTrack | undefined>();

  const load: AudioLoad = async (audios) => {
    if (audios.length > 0) {
      setPlaylist(audios);
      await loadTrack(audios[0]);
    }
  };

  const pause: AudioPause = async () => {
    switch (status) {
      case AudioStatus.PLAYING:
        await player.pauseAsync();
        break;
    }
  };

  const play: AudioPlay = async (newTrack) => {
    if (newTrack) {
      if (newTrack.hash !== track?.hash) {
        await loadTrack(newTrack);
      } else {
        await player.setPositionAsync(0);
      }
    }

    await player.playAsync();
  };

  const setProgress: AudioSetProgress = async (progress) => {
    switch (status) {
      case AudioStatus.READY:
      case AudioStatus.PLAYING:
        await player.setPositionAsync(progress);
        break;
    }
  };

  const setVolume: AudioSetVolume = (volume) => {
    setVolumeTrack(
      MathUtils.interpolate(volume, { min: 0, max: 100 }, { min: 0, max: 1 }),
    );
  };

  const getProgress: AudioGetProgress = async () => {
    const currentStatus = await player.getStatusAsync();
    if (currentStatus.isLoaded) {
      return currentStatus.positionMillis;
    }

    return -1;
  };

  const init = () => {
    player.setOnPlaybackStatusUpdate(statusListener(player));
  };

  const statusListener = (player: Sound) =>
    (player._onPlaybackStatusUpdate = (status) => {
      if (status.isLoaded) {
        if (status.isBuffering) {
          setStatus(AudioStatus.BUFFERING);
        } else if (status.didJustFinish) {
          setStatus(AudioStatus.FINISHED);
        } else if (status.isPlaying) {
          setStatus(AudioStatus.PLAYING);
        } else {
          setStatus(AudioStatus.READY);
        }
      } else {
        setStatus(AudioStatus.IDLE);
      }
    });

  const loadTrack = async (newTrack: AudioTrack) => {
    if (status === AudioStatus.PLAYING) {
      await player.stopAsync();
    }
    if (status !== AudioStatus.IDLE) {
      await player.unloadAsync();
    }

    await player.loadAsync(newTrack, { volume: volumeTrack });
    setTrack(newTrack);
  };

  useEffect(() => {
    init();
  }, []);

  return useMemo(
    () => ({
      playlist,
      status,
      track,
      play,
      pause,
      load,
      setProgress,
      setVolume,
      getProgress,
    }),
    [track, status, playlist],
  );
}
