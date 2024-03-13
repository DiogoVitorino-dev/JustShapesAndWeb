import { useAssets } from "expo-asset";
import React, { createContext, useContext, useEffect } from "react";

import { useAudioSystem } from "@/audio";
import { AudioFunctions, AudioProps, AudioStatus } from "@/audio/audio.types";
import { useAppSelector } from "@/hooks";
import { SettingsSelectors } from "@/store/reducers/settings/settingsSelectors";

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

export type SoundList = keyof typeof menuAssets;

type SoundAudioFunctions = Omit<AudioFunctions, "play">;

export interface SoundContext extends SoundAudioFunctions, AudioProps {
  play: (name: SoundList) => Promise<void>;
}

const Context = createContext<SoundContext>({
  status: AudioStatus.IDLE,
  playlist: [],
  pause: async () => {},
  load: async () => {},
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
  const [assets] = useAssets(Object.values(menuAssets));

  useEffect(() => {
    if (assets) {
      value.load(assets);
    }
  }, [assets]);

  const soundVolume = useAppSelector(
    SettingsSelectors.selectAudioSettings,
  ).soundVolume;

  useEffect(() => {
    value.setVolume(soundVolume);
  }, [soundVolume]);

  const handlePlay = async (name: SoundList) => {
    if (assets && Object.hasOwn(menuAssets, name)) {
      value.play(
        assets.find((data) => data.name.replace(/\.[^/.]+$/, "") === name),
      );
    }
  };

  return (
    <Context.Provider value={{ ...value, play: handlePlay }}>
      {children}
    </Context.Provider>
  );
}
