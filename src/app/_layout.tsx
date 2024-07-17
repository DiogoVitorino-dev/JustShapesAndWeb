import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
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
  const [fontLoaded, fontError] = useFonts({
    Megrim: require("@/assets/fonts/Megrim.ttf"),
    MajorMonoDisplay: require("@/assets/fonts/MajorMonoDisplay.ttf"),
    Manjari: require("@/assets/fonts/Manjari.ttf"),
    ...FontAwesome.font,
  });

  const music = useMusicContext();
  const sound = useSoundContext();

  useEffect(() => {
    store.dispatch(SettingsActions.initialize());
  }, []);

  const settingsLoaded = useAppSelector(SettingsSelectors.selectInitialized);

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  useEffect(() => {
    if (fontLoaded && settingsLoaded && music.loaded && sound.loaded)
      onFullyLoaded();
  }, [fontLoaded, settingsLoaded, music, sound]);

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

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="settings" />
        {__DEV__ ? <Stack.Screen name="(testing)" /> : null}
      </Stack>
    </ThemeProvider>
  );
}
