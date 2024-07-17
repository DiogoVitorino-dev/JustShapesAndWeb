import { Asset } from "expo-asset";

export enum AudioState {
  IDLE = "IDLE",
  LOADING = "LOADING",
  READY = "READY",
  PAUSED = "PAUSED",
  STOPPED = "STOPPED",
  BUFFERING = "BUFFERING",
  PLAYING = "PLAYING",
  FINISHED = "FINISHED",
}

export type AudioTrack = { title?: string; asset: Asset };

export type AudioPlay = (fadeIn?: number) => Promise<void>;
export type AudioStop = (fadeOut?: number) => Promise<void>;
export type AudioSkip = (index: number) => Promise<void>;
export type AudioPause = (fadeOut?: number) => Promise<void>;

export type AudioGetTrack = (index: number) => AudioTrack | undefined;
export type AudioGetPlaylist = () => AudioTrack[];
export type AudioGetCurrentTrack = () => AudioTrack | undefined;
export type AudioGetCurrentIndex = () => number;
export type AudioGetProgress = () => Promise<number>;

export type AudioAdd = (tracks: AudioTrack[]) => Promise<void>;
export type AudioRemove = (indexes?: number[]) => Promise<void>;
export type AudioSetProgress = (progress: number) => Promise<void>;
export type AudioSetVolume = (volume: number) => Promise<void>;

export type CallbackTrackChanged = (track?: AudioTrack) => void;
export type AudioOnTrackChanged = (callback: CallbackTrackChanged) => void;

export interface AudioFunctions {
  /**
   * Plays or resumes the current track.
   * @param {number} fadeIn Sets the duration of the Fade in.
   */
  play: AudioPlay;

  /**
   * Pauses the current track.
   * @param {number} fadeOut Sets the duration of the Fade out.
   */
  pause: AudioPause;

  /**
   * Sets the progress at a specified time position on the current track.
   * @param {number} progress Progress to be set in milliseconds.
   */
  setProgress: AudioSetProgress;

  /**
   * Sets volume the player.
   * @param volume A number between 0.0 (silence) and 100.0 (maximum volume).
   */
  setVolume: AudioSetVolume;

  /**
   * Gets progress of the current track in milliseconds.
   * @returns {number} Progress in milliseconds or -1 if the track is not loaded.
   */
  getProgress: AudioGetProgress;

  /**
   * Gets the playlist.
   * @returns {AudioTrack[]} A list of `AudioTrack`.
   */
  getPlaylist: AudioGetPlaylist;

  /**
   * Stops the current track and sets the progress to the beginning.
   * @param {number} fadeOut Sets the duration of the Fade out.
   */
  stop: AudioStop;

  /**
   * Skips to a specified track index in the playlist.
   * @param {number} index Track index in playlist.
   */
  skip: AudioSkip;

  /**
   * Gets the specified track in the index.
   * @param {number} index Track index in playlist.
   * @returns {number} The specified track at index or `undefined` if not found.
   */
  getTrack: AudioGetTrack;

  /**
   * Gets the current track.
   * @param {number} index Track index in playlist.
   * @returns {number} `AudioTrack` of the current track or `undefined` if it doesn't have the current track.
   */
  getCurrentTrack: AudioGetCurrentTrack;

  /**
   * Gets index of the current track.
   * @returns {number} Index of the current track or -1 if it doesn't have the current track.
   */
  getCurrentIndex: AudioGetCurrentIndex;

  /**
   * Adds tracks to the playlist and loads them into a player.
   * @param {AudioTrack[]} tracks List of `AudioTrack` to be added to the playlist.
   */
  add: AudioAdd;

  /**
   * Removes specified tracks from the index list.
   * @param {number[]} indexes Index list of tracks to be removed from the playlist.
   * `NOTE` if omitted, the playlist will be cleared
   */
  remove: AudioRemove;

  /**
   * Appends an listener that will be invoked when the track is changed.
   * @param {CallbackTrackChanged} callback Sets the callback that will be invoked when when the track is changed.
   */
  onTrackChanged: AudioOnTrackChanged;
}
