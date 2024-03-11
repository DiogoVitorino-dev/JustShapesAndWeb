import { Sound } from "expo-av/build/Audio";
import React, { createContext, useContext, useEffect } from "react";

import { useAudioSystem } from "@/audio";
import {
  PlaybackFunctions,
  PlaybackProps,
  PlaybackStatus,
} from "@/audio/audio.types";
import { useAppSelector } from "@/hooks";
import { SettingsSelectors } from "@/store/reducers/settings/settingsSelectors";

export interface MusicContext extends PlaybackFunctions, PlaybackProps {}

const Context = createContext<MusicContext>({
  status: PlaybackStatus.IDLE,
  player: new Sound(),
  pause: async () => {},
  loadAndPlay: async () => {},
  setProgress: async () => {},
  getProgress: async () => -1,
  play: async () => {},
  setVolume: async () => {},
});

export const useMusicContext = () => useContext(Context);

interface ProviderProps {
  children: React.JSX.Element | React.JSX.Element[];
}

export default function MusicProvider({ children }: ProviderProps) {
  const value = useAudioSystem();

  const musicVolume = useAppSelector(
    SettingsSelectors.selectAudioSettings,
  ).musicVolume;

  useEffect(() => {
    value.setVolume(musicVolume);
  }, [musicVolume]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
