import { AVPlaybackSource } from "expo-av";
import { Sound } from "expo-av/build/Audio";

export enum PlaybackStatus {
  IDLE = 0,
  LOADED = 1,
  BUFFERING = 2,
  PLAYING = 3,
  FINISHED = 4,
}

export type PlaybackPlay = () => Promise<void>;
export type PlaybackPause = () => Promise<void>;
export type PlaybackLoadAndPlay = (
  source: AVPlaybackSource,
  autoplay?: boolean,
) => Promise<void>;
export type PlaybackGetProgress = () => Promise<number>;

/**
 * @param progress The current position of playback in milliseconds.
 */
export type PlaybackSetProgress = (progress: number) => Promise<void>;

/**
 * @param volume A number between 0.0 (silence) and 1.0 (maximum volume).
 */
export type PlaybackSetVolume = (volume: number) => Promise<void>;

export interface PlaybackProps {
  status: PlaybackStatus;
  player: Sound;
  error?: Error;
}

export interface PlaybackFunctions {
  play: PlaybackPlay;
  pause: PlaybackPause;
  loadAndPlay: PlaybackLoadAndPlay;
  setProgress: PlaybackSetProgress;
  setVolume: PlaybackSetVolume;
  getProgress: PlaybackGetProgress;
}
