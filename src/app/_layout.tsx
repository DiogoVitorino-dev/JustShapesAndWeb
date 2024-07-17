import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import {
  OrientationLock,
  getOrientationAsync,
  supportsOrientationLockAsync,
  Orientation,
  lockPlatformAsync,
  WebOrientationLock,
} from "expo-screen-orientation";
import React, { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";

import MusicProvider, { useMusicContext } from "@/audio/music";
import SoundProvider, { useSoundContext } from "@/audio/sound";
import HeadphoneHint from "@/components/menu/headphoneHint";
import { Loading } from "@/components/shared";
import Colors from "@/constants/Colors";
import { useAppSelector } from "@/hooks";
import CollisionSystemProvider from "@/scripts/collision/collisionSystemProvider";
import { store } from "@/store";
import { SettingsActions } from "@/store/reducers/settings/settingsActions";
import { SettingsSelectors } from "@/store/reducers/settings/settingsSelectors";
import { MathUtils } from "@/utils/mathUtils";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const defaultStackScreenOptions: React.ComponentProps<
  typeof Stack
>["screenOptions"] = {
  headerStyle: { backgroundColor: Colors.UI.backdrop },
  headerTintColor: Colors.UI.text,
  headerTitleAlign: "center",
  headerTitleStyle: { fontFamily: "Manjari" },
  statusBarStyle: "inverted",
  statusBarTranslucent: true,
};

interface InitialLoadingProps {
  onFullyLoaded: () => void | undefined;
}

const InitialLoading = ({ onFullyLoaded }: InitialLoadingProps) => {
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
};

export default function RootLayout() {
  const [animationFinished, setAnimationFinished] = useState(false);
  const [gameLoaded, setGameLoaded] = useState(false);

  return (
    <GestureHandlerRootView style={{ height: "100%", width: "100%" }}>
      <Provider store={store}>
        <MusicProvider>
          <SoundProvider>
            <CollisionSystemProvider>
              {animationFinished && gameLoaded ? (
                <RootLayoutNav />
              ) : (
                <>
                  <HeadphoneHint
                    onAnimationFinished={() => setAnimationFinished(true)}
                  />
                  <InitialLoading onFullyLoaded={() => setGameLoaded(true)} />
                </>
              )}
            </CollisionSystemProvider>
          </SoundProvider>
        </MusicProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  const { playMusic } = useMusicContext();

  const playMenuMusic = () => {
    const selector = Math.floor(MathUtils.random(0, 3));

    switch (selector) {
      case 0:
        playMusic("amaksi-chipmunk-games");
        break;
      case 1:
        playMusic("nickpanek620-chiptune-score-theme-for-video-games");
        break;
      default:
        playMusic("stormAIMusician-firestorm");
        break;
    }
  };

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" listeners={{ focus: playMenuMusic }} />
        <Stack.Screen name="settings" />
        {__DEV__ ? <Stack.Screen name="(testing)" /> : null}
      </Stack>
    </ThemeProvider>
  );
}
