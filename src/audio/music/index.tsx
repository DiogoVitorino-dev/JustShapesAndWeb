import { useAssets } from "expo-asset";
import React, { createContext, useContext, useEffect } from "react";

import { useAudioSystem } from "@/audio";
import { AudioFunctions, AudioProps, AudioStatus } from "@/audio/audio.types";
import { useAppSelector } from "@/hooks";
import { SettingsSelectors } from "@/store/reducers/settings/settingsSelectors";

const gameAssets = {};

export type MusicList = keyof typeof gameAssets;

type MusicFunctions = Omit<AudioFunctions, "play">;

export interface MusicContext extends MusicFunctions, AudioProps {
  play: (name?: MusicList) => Promise<void>;
}

const Context = createContext<MusicContext>({
  status: AudioStatus.IDLE,
  pause: async () => {},
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
  const [assets] = useAssets(Object.values(gameAssets));

  const musicVolume = useAppSelector(
    SettingsSelectors.selectAudioSettings,
  ).musicVolume;

  useEffect(() => {
    value.setVolume(musicVolume);
  }, [musicVolume]);

  const handlePlay: Pick<MusicContext, "play">["play"] = async (name) => {
    if (assets && name && Object.hasOwn(gameAssets, name)) {
      await value.play(
        assets.find((data) => data.name.replace(/\.[^/.]+$/, "") === name),
      );
    } else {
      await value.play();
    }
  };

  return (
    <Context.Provider value={{ ...value, play: handlePlay }}>
      {children}
    </Context.Provider>
  );
}
