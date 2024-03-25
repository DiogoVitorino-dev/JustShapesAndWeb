import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";

import MusicProvider from "@/audio/music";
import SoundProvider from "@/audio/sound";
import HeadphoneHint from "@/components/menu/headphoneHint";
import Colors from "@/constants/Colors";
import CollisionSystemProvider from "@/scripts/collision/collisionSystemProvider";
import { store } from "@/store";
import { SettingsActions } from "@/store/reducers/settings/settingsActions";

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

export default function RootLayout() {
  const [animationFinished, setAnimationFinished] = useState(false);
  const [loaded, error] = useFonts({
    Megrim: require("@/assets/fonts/Megrim.ttf"),
    MajorMonoDisplay: require("@/assets/fonts/MajorMonoDisplay.ttf"),
    Manjari: require("@/assets/fonts/Manjari.ttf"),
    ...FontAwesome.font,
  });

  const initializedSettings = store.getState().settings.initialized;

  useEffect(() => {
    store.dispatch(SettingsActions.initialize());
  }, []);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && animationFinished && initializedSettings) {
      SplashScreen.hideAsync();
    }
  }, [loaded, animationFinished, initializedSettings]);

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
        <MusicProvider>
          <SoundProvider>
            <CollisionSystemProvider>
              <RootLayoutNav />
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
