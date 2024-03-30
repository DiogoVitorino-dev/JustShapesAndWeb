/**
 * @jest-environment jsdom
 */

import { ListenersUtils } from "@/utils/listenersUtils";
import { ListenerCallback } from "@/utils/listenersUtils/webListeners";

describe("testing keyboardListener - Web Listeners Utils tests", () => {
  const { keyboardListener } = ListenersUtils.web;
  const callback = jest.fn<void, Parameters<ListenerCallback<KeyboardEvent>>>(
    (pressed, event) => {},
  );

  afterEach(() => callback.mockClear());

  it("Should return multiple key presses", async () => {
    const { removeListener } = keyboardListener(callback);

    let event = new KeyboardEvent("keydown", { key: "a" });
    window.dispatchEvent(event);
    expect(callback).toHaveBeenCalledWith(true, event);

    event = new KeyboardEvent("keydown", { key: "p" });
    window.dispatchEvent(event);
    expect(callback).toHaveBeenLastCalledWith(true, event);

    removeListener();
  });

  it("Should return the specified keypress", async () => {
    const { removeListener } = keyboardListener(callback, { key: "k" });

    let event = new KeyboardEvent("keydown", { key: "a" });
    window.dispatchEvent(event);
    expect(callback).not.toHaveBeenCalled();

    event = new KeyboardEvent("keydown", { key: "k" });
    window.dispatchEvent(event);
    expect(callback).toHaveBeenLastCalledWith(true, event);

    removeListener();
  });

  it.each([
    { key: "k", dispatchKey: "K" },
    { key: "K", dispatchKey: "k" },
    { key: "K", dispatchKey: "K" },
  ])(
    "$# - Should return the specified keypress (Uppercase)",
    async ({ dispatchKey, key }) => {
      const { removeListener } = keyboardListener(callback, { key });

      const event = new KeyboardEvent("keydown", { key: dispatchKey });
      window.dispatchEvent(event);
      expect(callback).toHaveBeenCalledWith(true, event);

      removeListener();
    },
  );

  it("Should cancel the listener", async () => {
    keyboardListener(callback).removeListener();

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "u" }));
    expect(callback).not.toHaveBeenCalled();
  });
});

describe("testing mouseListener - Web Listeners Utils tests", () => {
  const { mouseListener, MouseKeys } = ListenersUtils.web;
  const callback = jest.fn<void, Parameters<ListenerCallback<MouseEvent>>>(
    (key, event) => {},
  );

  afterEach(() => callback.mockClear());

  it.each([
    [MouseKeys.LEFT_BUTTON, 0],
    [MouseKeys.RIGHT_BUTTON, 1],
    [MouseKeys.MIDDLE_BUTTON, 2],
  ])("Should return a pressed mouse button (%s)", (expectedKey, button) => {
    const { removeListener } = mouseListener(callback);

    const event = new MouseEvent("mousedown", { button });
    window.dispatchEvent(event);
    expect(callback).toHaveBeenCalledWith(true, event);

    removeListener();
  });

  it("Should cancel the listener", async () => {
    mouseListener(callback).removeListener();

    window.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));
    expect(callback).not.toHaveBeenCalledWith();
  });
});

describe("testing listenKey - Web Listeners Utils tests", () => {
  const { listenKey, MouseKeys } = ListenersUtils.web;
  const callback = jest.fn((key) => {});

  afterEach(() => callback.mockClear());

  it("Should return a pressed key", async () => {
    listenKey(callback);

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    expect(callback).toHaveBeenCalledWith("a");
  });

  it.each([
    [0, MouseKeys.LEFT_BUTTON],
    [1, MouseKeys.RIGHT_BUTTON],
    [2, MouseKeys.MIDDLE_BUTTON],
  ])("Should return a pressed mouse button", (button, expectedKey) => {
    listenKey(callback);

    window.dispatchEvent(new MouseEvent("mousedown", { button }));
    expect(callback).toHaveBeenCalledWith(expectedKey);
  });

  it("Should cancel the listener", async () => {
    listenKey(callback);

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(callback).toHaveBeenCalledWith(null);
  });
});
