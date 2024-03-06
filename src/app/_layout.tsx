import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";

import MusicProvider from "@/audio/music";
import SoundProvider from "@/audio/sound";
import HeadphoneHint from "@/components/menu/headphoneHint";
import { store } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { SettingsActions } from "@/store/reducers/settings/settingsActions";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on modal keeps a back button present.
  initialRouteName: "(testing)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.

export default function RootLayout() {
  const [animationFinished, setAnimationFinished] = useState(false);
  const [loaded, error] = useFonts({
    Megrim: require("@/assets/fonts/Megrim.ttf"),
    MajorMonoDisplay: require("@/assets/fonts/MajorMonoDisplay.ttf"),
    Manjari: require("@/assets/fonts/Manjari.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && animationFinished) {
      SplashScreen.hideAsync();
    }
  }, [loaded, animationFinished]);

  if (!loaded || !animationFinished) {
    return (
      <GestureHandlerRootView style={{ height: "100%", width: "100%" }}>
        <HeadphoneHint onAnimationFinished={() => setAnimationFinished(true)} />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <RootLayoutNav />
      </Provider>
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();

  const initializedSettings = useAppSelector(
    (state) => state.settings.initialized,
  );

  useEffect(() => {
    if (!initializedSettings) {
      dispatch(SettingsActions.initialize());
    }
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <MusicProvider>
        <SoundProvider>
          <Stack
            screenOptions={{
              statusBarStyle: "inverted",
              statusBarTranslucent: true,
              headerShown: false,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(testing)" />
          </Stack>
        </SoundProvider>
      </MusicProvider>
    </ThemeProvider>
  );
}
