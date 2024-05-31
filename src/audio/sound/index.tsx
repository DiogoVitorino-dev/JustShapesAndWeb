import { useAssets } from "expo-asset";
import React, { createContext, useContext, useEffect } from "react";

import { useAudioSystem } from "@/audio";
import { AudioFunctions, AudioTrack } from "@/audio/audio.types";
import { useAppSelector } from "@/hooks";
import { SettingsSelectors } from "@/store/reducers/settings/settingsSelectors";

// The property key MUST have the same name as the file (without the type)
// Example:  jumpSound: require("example/sound/jumpSound.mp3")
const menuAssets = {
  "close-menu": require("@/assets/audio/sounds/menu/close-menu.mp3"),
  "close-nested-menu": require("@/assets/audio/sounds/menu/close-nested-menu.mp3"),
  "open-menu": require("@/assets/audio/sounds/menu/open-menu.mp3"),
  "open-nested-menu": require("@/assets/audio/sounds/menu/open-nested-menu.mp3"),
  hover: require("@/assets/audio/sounds/menu/hover.mp3"),
  error: require("@/assets/audio/sounds/menu/error.mp3"),
  start: require("@/assets/audio/sounds/menu/start.mp3"),
  volume: require("@/assets/audio/sounds/menu/volume.mp3"),
};

const gameAssets = {
  hit: require("@/assets/audio/sounds/player/hit.mp3"),
};

export type SoundList = keyof typeof menuAssets | keyof typeof gameAssets;

export interface SoundContext extends AudioFunctions {
  playSound: (name: SoundList) => Promise<void>;
}

const Context = createContext<SoundContext>({
  playSound: async () => {},
  pause: async () => {},
  setProgress: async () => {},
  getProgress: async () => -1,
  play: async () => {},
  setVolume: async () => {},
  add: async () => {},
  getCurrentIndex: () => -1,
  getCurrentTrack: () => undefined,
  getTrack: () => undefined,
  getPlaylist: () => [],
  remove: async () => {},
  skip: async () => {},
  stop: async () => {},
});

export const useSoundContext = () => useContext(Context);

interface ProviderProps {
  children: React.JSX.Element | React.JSX.Element[];
}

export default function SoundProvider({ children }: ProviderProps) {
  const value = useAudioSystem();
  const [assets] = useAssets([
    ...Object.values(menuAssets),
    ...Object.values(gameAssets),
  ]);

  const soundVolume = useAppSelector(
    SettingsSelectors.selectAudioSettings,
  ).soundVolume;

  useEffect(() => {
    if (assets) {
      const tracks = assets.map<AudioTrack>((asset) => {
        return {
          title: asset.name.substring(0, asset.name.lastIndexOf(".")),
          asset,
        };
      });

      value.add(tracks);
    }
  }, [assets]);

  useEffect(() => {
    value.setVolume(soundVolume);
  }, [soundVolume]);

  const playSound: SoundContext["playSound"] = async (name) => {
    const index = value
      .getPlaylist()
      .findIndex((track) => track.title === name);

    if (index !== -1) await value.skip(index);
  };

  return (
    <Context.Provider value={{ ...value, playSound }}>
      {children}
    </Context.Provider>
  );
}
