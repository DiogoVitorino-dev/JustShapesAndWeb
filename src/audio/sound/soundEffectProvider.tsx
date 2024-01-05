import { Sound } from "expo-av/build/Audio";
import React, { createContext, useContext } from "react";

import { useAudioSystem } from "..";
import {
  PlaybackFunctions,
  PlaybackProps,
  PlaybackStatus,
} from "../audio.types";

export interface SoundEffectsContext extends PlaybackFunctions, PlaybackProps {}

const Context = createContext<SoundEffectsContext>({
  status: PlaybackStatus.IDLE,
  player: new Sound(),
  pause: async () => {},
  loadAndPlay: async () => {},
  setProgress: async () => {},
  getProgress: async () => -1,
  play: async () => {},
  setVolume: async () => {},
});

export const useSoundEffectsContext = () => useContext(Context);

interface ProviderProps {
  children: React.JSX.Element | React.JSX.Element[];
}

export default function SoundEffectProvider({ children }: ProviderProps) {
  const value = useAudioSystem();

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
