import { FontAwesome } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import {
  getOrientationAsync,
  supportsOrientationLockAsync,
  OrientationLock,
  Orientation,
  lockPlatformAsync,
  WebOrientationLock,
} from "expo-screen-orientation";
import { useState, useEffect } from "react";

import { Loading } from "../shared";

import { useMusicContext } from "@/audio/music";
import { useSoundContext } from "@/audio/sound";
import { useAppSelector } from "@/hooks";
import { store } from "@/store";
import { SettingsActions } from "@/store/reducers/settings/settingsActions";
import { SettingsSelectors } from "@/store/reducers/settings/settingsSelectors";

interface InitialLoadingProps {
  onFullyLoaded: () => void | undefined;
}

export default function InitialLoading({ onFullyLoaded }: InitialLoadingProps) {
  const [adjustedOrientation, setAdjustedOrientation] = useState(false);
  const [fontLoaded, fontError] = useFonts({
    Megrim: require("@/assets/fonts/Megrim.ttf"),
    MajorMonoDisplay: require("@/assets/fonts/MajorMonoDisplay.ttf"),
    Manjari: require("@/assets/fonts/Manjari.ttf"),
    ...FontAwesome.font,
  });

  const music = useMusicContext();
  const sound = useSoundContext();

  const screenOrientation = async () => {
    try {
      const current = await getOrientationAsync();
      const supported = await supportsOrientationLockAsync(
        OrientationLock.LANDSCAPE,
      );

      if (
        supported &&
        current !== Orientation.LANDSCAPE_LEFT &&
        current !== Orientation.LANDSCAPE_RIGHT
      ) {
        await lockPlatformAsync({
          screenOrientationConstantAndroid: 0,
          screenOrientationLockWeb: WebOrientationLock.LANDSCAPE,
          screenOrientationArrayIOS: [
            Orientation.LANDSCAPE_LEFT,
            Orientation.LANDSCAPE_RIGHT,
          ],
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAdjustedOrientation(true);
    }
  };

  useEffect(() => {
    screenOrientation();
    store.dispatch(SettingsActions.initialize());
  }, []);

  const settingsLoaded = useAppSelector(SettingsSelectors.selectInitialized);

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  useEffect(() => {
    if (
      fontLoaded &&
      settingsLoaded &&
      music.loaded &&
      sound.loaded &&
      adjustedOrientation
    )
      onFullyLoaded();
  }, [fontLoaded, settingsLoaded, music, sound, adjustedOrientation]);

  return <Loading />;
}
