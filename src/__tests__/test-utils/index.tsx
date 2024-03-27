import { ThemeProvider, DefaultTheme } from "@react-navigation/native";
import { render, RenderOptions } from "@testing-library/react-native";
import { ReactElement } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";

import { store } from "@/store";

const customRender = (ui: ReactElement, options?: RenderOptions) =>
  render(
    <Provider store={store}>
      <ThemeProvider value={DefaultTheme}>
        <SafeAreaProvider>{ui}</SafeAreaProvider>
      </ThemeProvider>
    </Provider>,
    { ...options },
  );

export { customRender as render };
