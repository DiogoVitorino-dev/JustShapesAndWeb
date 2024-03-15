/**
 * @jest-environment jsdom
 */

import { ListenersUtils } from "@/utils/listenersUtils";

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
