import { useAssets } from "expo-asset";
import React, { createContext, useContext, useEffect, useState } from "react";

import { useAudioSystem } from "@/audio";
import { AudioFunctions, AudioTrack } from "@/audio/audio.types";
import { useAppSelector } from "@/hooks";
import { SettingsSelectors } from "@/store/reducers/settings/settingsSelectors";

// The property key MUST have the same name as the file (without the type)
// Example: introMusic: require("example/music/introMusic.mp3")
const gameAssets = {
  "blackbox-ani": require("@/assets/audio/music/blackbox-ani.mp3"),
};

export type MusicList = keyof typeof gameAssets;

export interface MusicContext extends AudioFunctions {
  playMusic: (list: MusicList) => Promise<void>;
  loaded: boolean;
}

const Context = createContext<MusicContext>({
  loaded: false,
  playMusic: async () => {},
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
  onTrackChanged: () => {},
});

export const useMusicContext = () => useContext(Context);

interface ProviderProps {
  children: React.JSX.Element | React.JSX.Element[];
}

export default function MusicProvider({ children }: ProviderProps) {
  const [loaded, setLoaded] = useState(false);
  const value = useAudioSystem();
  const [assets] = useAssets(Object.values(gameAssets));

  const musicVolume = useAppSelector(
    SettingsSelectors.selectAudioSettings,
  ).musicVolume;

  useEffect(() => {
    if (assets) {
      setLoaded(true);

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
    value.setVolume(musicVolume);
  }, [musicVolume]);

  const playMusic: MusicContext["playMusic"] = async (name) => {
    const index = value
      .getPlaylist()
      .findIndex((track) => track.title === name);

    if (index !== -1) await value.skip(index);
  };

  return (
    <Context.Provider value={{ ...value, loaded, playMusic }}>
      {children}
    </Context.Provider>
  );
}
