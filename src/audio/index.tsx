import { Audio } from "expo-av";
import { SoundObject } from "expo-av/build/Audio";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";

import {
  AudioGetTrack,
  AudioGetCurrentIndex,
  AudioGetCurrentTrack,
  AudioState,
  AudioAdd,
  AudioSkip,
  AudioRemove,
  AudioPause,
  AudioGetProgress,
  AudioStop,
  AudioPlay,
  AudioSetProgress,
  AudioSetVolume,
  AudioTrack,
  AudioFunctions,
  AudioGetPlaylist,
} from "./audio.types";

import { MathUtils } from "@/utils/mathUtils";

type PlaylistTrack = { track: AudioTrack; sound: Audio.Sound };

enum FadeType {
  "in",
  "out",
}
type Fade = (
  type: FadeType,
  duration: number,
  onFinish?: () => Promise<any | void> | void | any,
) => void;

export function useAudioSystem(): AudioFunctions {
  const playlist = useRef<PlaylistTrack[]>([]);
  const volume = useRef<number>(0.5);
  const state = useRef<AudioState>(AudioState.IDLE);
  const index = useRef<number>(-1);
  const fade = useRef(new Animated.Value(0)).current;

  const getTrack: AudioGetTrack = (index) => playlist.current[index]?.track;

  const getPlaylist: AudioGetPlaylist = () =>
    playlist.current.map((track) => ({ ...track.track }));

  const getCurrentTrack: AudioGetCurrentTrack = () =>
    playlist.current[index.current]?.track;

  const getCurrentIndex: AudioGetCurrentIndex = () => index.current;

  const skip: AudioSkip = async (newIndex, autoPlay = true) => {
    if (playlist.current.length - 1 >= newIndex && newIndex >= 0) {
      await stop();
      index.current = newIndex;
      setListener(getCurrentSound());
      if (autoPlay) {
        await play();
      }
    }
  };

  const add: AudioAdd = async (audios) => {
    state.current = AudioState.LOADING;

    const sounds = await Promise.all(
      audios.map<Promise<SoundObject>>((source) =>
        Audio.Sound.createAsync(source.asset, {
          shouldPlay: false,
          volume: volume.current,
        }),
      ),
    );

    const newTracks = sounds.map<PlaylistTrack>(({ sound }, index) => ({
      sound,
      track: audios[index],
    }));

    playlist.current = [...playlist.current, ...newTracks];

    if (index.current === -1) {
      index.current = 0;
      skip(0);
    }
  };

  const remove: AudioRemove = async (indexes) => {
    await stop();
    let newPlaylist = playlist.current;
    let newIndex = index.current;

    if (indexes?.length) {
      const length = playlist.current.length;

      newIndex = indexes.reduce((prev, curr) => {
        newPlaylist.splice(curr, 1);

        if (prev > length - 1) return 0; // Overflow

        if (prev === curr) return prev + 1; // Next Track

        return prev;
      }, index.current);
    } else {
      newPlaylist = [];
      newIndex = -1;
    }

    playlist.current = newPlaylist;
    index.current = newIndex;
  };

  const pause: AudioPause = async (duration = 300) => {
    const sound = getCurrentSound();
    if (state.current === AudioState.PLAYING && sound) {
      state.current = AudioState.PAUSED;
      startFade(FadeType.out, duration, async () => sound.pauseAsync());
    }
  };

  const stop: AudioStop = async (duration = 0) => {
    const sound = getCurrentSound();
    if (state.current === AudioState.PLAYING && sound) {
      state.current = AudioState.STOPPED;

      startFade(FadeType.out, duration, async () => {
        await sound.pauseAsync();
        await sound.setPositionAsync(0);
      });
    }
  };

  const play: AudioPlay = async (duration = 0) => {
    try {
      switch (state.current) {
        case AudioState.READY:
        case AudioState.STOPPED:
        case AudioState.PAUSED:
        case AudioState.FINISHED:
          startFade(FadeType.in, duration);
          await getCurrentSound()?.playAsync();

          break;
      }
    } catch (e) {
      console.error("Audio System/play -", e);
    }
  };

  const setProgress: AudioSetProgress = async (progress) => {
    switch (state.current) {
      case AudioState.READY:
      case AudioState.PAUSED:
      case AudioState.STOPPED:
      case AudioState.PLAYING:
      case AudioState.FINISHED:
        await getCurrentSound()?.setPositionAsync(progress);
        break;
    }
  };

  const setVolume: AudioSetVolume = async (newVolume) => {
    if (newVolume > 100) newVolume = 100;
    if (newVolume < 0) newVolume = 0;

    newVolume = MathUtils.interpolate(
      newVolume,
      { min: 0, max: 100 },
      { min: 0, max: 1 },
    );

    volume.current = newVolume;
    await changeSoundVolume(newVolume);
  };

  const getProgress: AudioGetProgress = async () => {
    const status = await getCurrentSound()?.getStatusAsync();
    if (status && status.isLoaded) {
      return status.positionMillis;
    }

    return -1;
  };

  const getCurrentSound = (): Audio.Sound | undefined =>
    playlist.current[index.current]?.sound;

  const startFade: Fade = (type, duration, onFinish) => {
    fade.stopAnimation();

    const callback: Animated.EndCallback = async ({ finished }) => {
      if (finished) {
        if (onFinish) await onFinish();
        if (type === FadeType.out) fade.setValue(volume.current);
      }
    };

    fade.setValue(type === FadeType.in ? 0 : volume.current);

    Animated.timing(fade, {
      toValue: type === FadeType.out ? 0 : volume.current,
      duration,
      useNativeDriver: true,
    }).start(callback);
  };

  const setListener = (sound?: Audio.Sound) => {
    if (sound) {
      sound.setOnPlaybackStatusUpdate(statusListener(sound));
    }
  };

  const statusListener = (sound: Audio.Sound) =>
    (sound._onPlaybackStatusUpdate = (soundState) => {
      if (soundState.isLoaded) {
        if (soundState.isBuffering) {
          state.current = AudioState.BUFFERING;
        } else if (soundState.didJustFinish) {
          state.current = AudioState.FINISHED;
        } else if (soundState.isPlaying) {
          state.current = AudioState.PLAYING;
        } else if (
          state.current !== AudioState.STOPPED &&
          state.current !== AudioState.PAUSED
        ) {
          state.current = AudioState.READY;
        }
      } else {
        state.current = AudioState.IDLE;
      }
    });

  const changeSoundVolume = async (value: number) =>
    await getCurrentSound()?.setVolumeAsync(value);

  const prepareFade = () =>
    fade.addListener(({ value }) => changeSoundVolume(value));

  useEffect(() => {
    prepareFade();

    return () => {
      remove();
    };
  }, []);

  return {
    getPlaylist,
    play,
    pause,
    setProgress,
    setVolume,
    getProgress,
    add,
    getCurrentIndex,
    getCurrentTrack,
    getTrack,
    remove,
    skip,
    stop,
  };
}
