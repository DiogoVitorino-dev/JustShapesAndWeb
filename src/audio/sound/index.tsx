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

const menuAssets = {
  closeMenu: require("@/assets/audio/sounds/menu/close-menu.mp3"),
  closeNestedMenu: require("@/assets/audio/sounds/menu/close-nested-menu.mp3"),
  error: require("@/assets/audio/sounds/menu/error.mp3"),
  hover: require("@/assets/audio/sounds/menu/hover.mp3"),
  openMenu: require("@/assets/audio/sounds/menu/open-menu.mp3"),
  openNestedMenu: require("@/assets/audio/sounds/menu/open-nested-menu.mp3"),
  start: require("@/assets/audio/sounds/menu/start.mp3"),
  volume: require("@/assets/audio/sounds/menu/volume.mp3"),
};

export type SoundList = keyof typeof menuAssets;

type SoundPlaybackFunctions = Omit<PlaybackFunctions, "play">;

export interface SoundContext extends SoundPlaybackFunctions, PlaybackProps {
  play: (name: SoundList) => Promise<void>;
}

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

  const soundVolume = useAppSelector(
    SettingsSelectors.selectAudioSettings,
  ).soundVolume;

  useEffect(() => {
    value.setVolume(soundVolume);
  }, [soundVolume]);

  const handlePlay = async (name: SoundList) => {
    if (Object.hasOwn(menuAssets, name)) {
      value.loadAndPlay(menuAssets[name]);
    }
  };

  return (
    <Context.Provider value={{ ...value, play: handlePlay }}>
      {children}
    </Context.Provider>
  );
}
