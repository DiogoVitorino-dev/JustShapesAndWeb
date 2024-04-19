import { Audio } from "expo-av";
import { useEffect, useMemo, useRef, useState } from "react";
import { Animated } from "react-native";

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
  const [track, setTrack] = useState<AudioTrack>();

  const fade = useRef(new Animated.Value(0)).current;

  const pause: AudioPause = async (duration = 300) => {
    const callback: Animated.EndCallback = async ({ finished }) => {
      if (status === AudioStatus.PLAYING && finished) {
        await sound.pauseAsync();
      }
    };

    fade.setValue(volumeTrack);

    Animated.timing(fade, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    }).start(callback);
  };

  const play: AudioPlay = async (newTrack) => {
    try {
      if (newTrack) {
        const { sound } = await Audio.Sound.createAsync(newTrack, {
          shouldPlay: true,
          volume: volumeTrack,
        });
        setSound(sound);
        setTrack(newTrack);
      } else if (
        status !== AudioStatus.BUFFERING &&
        status !== AudioStatus.PLAYING &&
        status !== AudioStatus.IDLE
      ) {
        await sound.playAsync();
      }
    } catch (e) {}
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

  const updateVolume = async (volume: number) => sound.setVolumeAsync(volume);

  const prepareFade = () => {
    if (fade.hasListeners()) {
      fade.removeAllListeners();
    }

    fade.addListener(({ value }) => {
      return updateVolume(value);
    });
  };

  useEffect(() => {
    setListener(sound);
    prepareFade();
  }, [sound]);

  useEffect(() => {
    switch (status) {
      case AudioStatus.READY:
      case AudioStatus.PLAYING:
      case AudioStatus.FINISHED:
        updateVolume(volumeTrack);
        break;
    }
  }, [volumeTrack, status]);

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
    [status, track, play, pause, setProgress, setVolume, getProgress],
  );
}
