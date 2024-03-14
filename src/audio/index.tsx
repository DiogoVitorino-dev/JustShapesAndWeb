import { Audio } from "expo-av";
import { useEffect, useMemo, useState } from "react";

import {
  AudioStatus,
  AudioGetProgress,
  AudioPause,
  AudioPlay,
  AudioSetProgress,
  AudioSetVolume,
  AudioTrack,
} from "./audio.types";

import { MathUtils } from "@/utils/mathUtils";

export function useAudioSystem() {
  const [sound, setSound] = useState(new Audio.Sound());
  const [volumeTrack, setVolumeTrack] = useState(0.5);
  const [status, setStatus] = useState<AudioStatus>(AudioStatus.IDLE);
  const [track, setTrack] = useState<AudioTrack | undefined>();

  const pause: AudioPause = async () => {
    switch (status) {
      case AudioStatus.PLAYING:
        await sound.pauseAsync();
        break;
    }
  };

  const play: AudioPlay = async (newTrack) => {
    if (newTrack) {
      const { sound } = await Audio.Sound.createAsync(newTrack, {
        shouldPlay: true,
        volume: volumeTrack,
      });
      setSound(sound);
      setTrack(newTrack);
    } else if (
      status !== AudioStatus.BUFFERING &&
      status !== AudioStatus.IDLE
    ) {
      await sound.playAsync();
    }
  };

  const setProgress: AudioSetProgress = async (progress) => {
    switch (status) {
      case AudioStatus.READY:
      case AudioStatus.PLAYING:
        await sound.setPositionAsync(progress);
        break;
    }
  };

  const setVolume: AudioSetVolume = (volume) => {
    setVolumeTrack(
      MathUtils.interpolate(volume, { min: 0, max: 100 }, { min: 0, max: 1 }),
    );
  };

  const getProgress: AudioGetProgress = async () => {
    const currentStatus = await sound.getStatusAsync();
    if (currentStatus.isLoaded) {
      return currentStatus.positionMillis;
    }

    return -1;
  };

  const setListener = (sound: Audio.Sound) => {
    sound.setOnPlaybackStatusUpdate(statusListener(sound));
  };

  const statusListener = (sound: Audio.Sound) =>
    (sound._onPlaybackStatusUpdate = (status) => {
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

  useEffect(() => {
    setListener(sound);
  }, [sound]);

  return useMemo(
    () => ({
      status,
      track,
      play,
      pause,
      setProgress,
      setVolume,
      getProgress,
    }),
    [status, track],
  );
}
