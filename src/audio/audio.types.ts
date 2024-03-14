import { Asset } from "expo-asset";

export enum AudioStatus {
  IDLE = "idle",
  READY = "ready",
  BUFFERING = "buffering",
  PLAYING = "playing",
  FINISHED = "finished",
}

export type AudioTrack = Asset;

export type AudioPlaylist = AudioTrack[];

export type AudioPlay = (track?: Asset) => Promise<void>;
export type AudioPause = () => Promise<void>;
export type AudioLoad = (assets: Asset[]) => Promise<void>;
export type AudioGetProgress = () => Promise<number>;

/**
 * @param progress The current position of Audio in milliseconds.
 */
export type AudioSetProgress = (progress: number) => Promise<void>;

/**
 * @param volume A number between 0.0 (silence) and 100.0 (maximum volume).
 */
export type AudioSetVolume = (volume: number) => void;

export interface AudioProps {
  status: AudioStatus;
  track?: AudioTrack;
  playlist: AudioPlaylist;
}

export interface AudioFunctions {
  play: AudioPlay;
  pause: AudioPause;
  load: AudioLoad;
  setProgress: AudioSetProgress;
  setVolume: AudioSetVolume;
  getProgress: AudioGetProgress;
}
