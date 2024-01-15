import { Sound } from "expo-av/build/Audio";
import React, { createContext, useContext } from "react";

import { useAudioSystem } from "@/audio";
import {
  PlaybackFunctions,
  PlaybackProps,
  PlaybackStatus,
} from "@/audio/audio.types";

export interface SoundContext extends PlaybackFunctions, PlaybackProps {}

const Context = createContext<SoundContext>({
  status: PlaybackStatus.IDLE,
  player: new Sound(),
  pause: async () => {},
  loadAndPlay: async () => {},
  setProgress: async () => {},
  getProgress: async () => -1,
  play: async () => {},
  setVolume: async () => {},
});

export const useSoundContext = () => useContext(Context);

interface ProviderProps {
  children: React.JSX.Element | React.JSX.Element[];
}

export default function SoundProvider({ children }: ProviderProps) {
  const value = useAudioSystem();

  return <Context.Provider value={value}>{children}</Context.Provider>;
}