/**
 * @jest-environment jsdom
 */

import { useState } from "react";

import { act, renderHook } from "../testsUtils";

import { ListenersUtils } from "@/utils/listenersUtils";
import { MouseKeys } from "@/utils/listenersUtils/webListeners";

describe("testing useKeyListener - Web Listeners Utils tests", () => {
  const { useKeyListener } = ListenersUtils.web;
  let keys = ["a", "B"];
  const callbackMock = jest.fn((pressing, key) => ({
    pressing,
    key,
  }));

  afterEach(() => {
    keys = ["a", "B"];
    callbackMock.mockClear();
  });

  it("Should call a callback on press keys", () => {
    renderHook(() => useKeyListener(callbackMock, keys));

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: keys[0] }));
    });

    expect(callbackMock).toHaveBeenCalledWith(true, keys[0]);

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: keys[1] }));
    });

    expect(callbackMock).toHaveBeenLastCalledWith(true, keys[1]);
    expect(callbackMock).toHaveBeenCalledTimes(2);
  });

  it("Should call a callback on release keys", () => {
    renderHook(() => useKeyListener(callbackMock, keys));

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keyup", { key: keys[0] }));
    });

    expect(callbackMock).toHaveBeenCalledWith(false, keys[0]);

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keyup", { key: keys[1] }));
    });

    expect(callbackMock).toHaveBeenLastCalledWith(false, keys[1]);
    expect(callbackMock).toHaveBeenCalledTimes(2);
  });

  it("Should call a callback on press mouse buttons", () => {
    keys = [
      MouseKeys.LEFT_BUTTON,
      MouseKeys.RIGHT_BUTTON,
      MouseKeys.MIDDLE_BUTTON,
    ];

    renderHook(() => useKeyListener(callbackMock, keys));

    act(() => {
      window.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));
    });

    expect(callbackMock).toHaveBeenCalledWith(true, keys[0]);

    act(() => {
      window.dispatchEvent(new MouseEvent("mousedown", { button: 1 }));
    });

    expect(callbackMock).toHaveBeenNthCalledWith(2, true, keys[1]);

    act(() => {
      window.dispatchEvent(new MouseEvent("mousedown", { button: 2 }));
    });

    expect(callbackMock).toHaveBeenLastCalledWith(true, keys[2]);
    expect(callbackMock).toHaveBeenCalledTimes(3);
  });

  it("Should call a callback when a key value changes", async () => {
    const newState = ["C", "d"];

    const { result } = renderHook(() => useState(keys));

    const Listener = renderHook(() =>
      useKeyListener(callbackMock, result.current[0]),
    );

    await act(() => {
      result.current[1](newState);
      Listener.rerender({});
    });

    await act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: newState[1] }));
    });
    expect(callbackMock).toHaveBeenCalledWith(true, newState[1]);

    await act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: keys[1] }));
    });
    expect(callbackMock).not.toHaveBeenLastCalledWith(true, keys[1]);
  });

  it("Shouldn't call a callback when removed the listener", async () => {
    const { result } = renderHook(() => useKeyListener(callbackMock, keys));

    await act(() => {
      result.current.removeListener();
    });

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: keys[0] }));
    });

    expect(callbackMock).not.toHaveBeenCalled();
  });
});

describe("testing listenKey - Web Listeners Utils tests", () => {
  const { listenKey, MouseKeys } = ListenersUtils.web;

  it("Should return a pressed key", async () => {
    const key = listenKey();

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    expect(await key).toEqual("a");
  });

  it("Should return a pressed mouse button", () => {
    listenKey().then((key) => expect(key).toEqual(MouseKeys.LEFT_BUTTON));
    window.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    listenKey().then((key) => expect(key).toEqual(MouseKeys.RIGHT_BUTTON));
    window.dispatchEvent(new MouseEvent("mousedown", { button: 1 }));

    listenKey().then((key) => expect(key).toEqual(MouseKeys.MIDDLE_BUTTON));
    window.dispatchEvent(new MouseEvent("mousedown", { button: 2 }));
  });

  it("Should cancel the listener", async () => {
    const key = listenKey();
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(await key).toBeNull();
  });
});
