import { ThemeProvider, DefaultTheme } from "@react-navigation/native";
import { render, RenderOptions } from "@testing-library/react-native";
import { ReactElement } from "react";
import { Provider } from "react-redux";

import { store } from "@/store";

const customRender = (ui: ReactElement, options?: RenderOptions) =>
  render(
    <Provider store={store}>
      <ThemeProvider value={DefaultTheme}>{ui}</ThemeProvider>
    </Provider>,
    { ...options },
  );

export * from "@testing-library/react-native";
export { customRender as render };
