import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { RenderOptions, render } from "@testing-library/react-native";
import React, { JSXElementConstructor, ReactElement } from "react";
import { Provider } from "react-redux";

import MusicProvider from "@/audio/music";
import SoundProvider from "@/audio/sound";
import { store } from "@/store";

type ReactChildren = ReactElement<any, string | JSXElementConstructor<any>>;

interface WrapperProps {
  children: ReactChildren;
}

const AllTheProviders = ({ children }: WrapperProps) => {
  return (
    <Provider store={store}>
      <ThemeProvider value={DefaultTheme}>
        <MusicProvider>
          <SoundProvider>{children}</SoundProvider>
        </MusicProvider>
      </ThemeProvider>
    </Provider>
  );
};

const customRender = (ui: ReactChildren, options?: RenderOptions) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react-native";

export { customRender as render };
