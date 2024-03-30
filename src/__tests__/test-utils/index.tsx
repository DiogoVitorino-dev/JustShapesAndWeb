import {
  ThemeProvider,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { render, RenderOptions } from "@testing-library/react-native";
import { ReactElement } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";

import CollisionSystemProvider from "@/scripts/collision/collisionSystemProvider";
import { store } from "@/store";

export type Wrapper = (params: { children: ReactElement }) => React.ReactNode;

const customRender = (ui: ReactElement, options?: RenderOptions) =>
  render(
    <NavigationContainer>
      <Provider store={store}>
        <ThemeProvider value={DefaultTheme}>
          <SafeAreaProvider>
            <CollisionSystemProvider>{ui}</CollisionSystemProvider>
          </SafeAreaProvider>
        </ThemeProvider>
      </Provider>
    </NavigationContainer>,
    { ...options },
  );

export { customRender as render };
