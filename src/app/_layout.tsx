import { Stack } from "expo-router";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";

import MusicProvider from "@/audio/music";
import SoundProvider from "@/audio/sound";
import Colors from "@/constants/Colors";
import CollisionSystemProvider from "@/scripts/collision/collisionSystemProvider";
import { store } from "@/store";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

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
  return (
    <GestureHandlerRootView style={{ height: "100%", width: "100%" }}>
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
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(menu)" />
      <Stack.Screen name="settings" />
      {__DEV__ ? <Stack.Screen name="(testing)" /> : null}
    </Stack>
  );
}
