import { useEffect } from "react";

export enum MouseKeys {
  LEFT_BUTTON = "LMB",
  RIGHT_BUTTON = "RMB",
  MIDDLE_BUTTON = "MMB",
}

export type KeyListener = (
  callback: (pressing: boolean, key: string) => void,
  keys: string[],
) => { removeListener: () => void };

export type ListenKey = () => Promise<string | null>;

// Internal
type ListenerCallback<EventType> = (
  pressing: boolean,
  event: EventType,
) => void;

interface ListenerOptions<KeyType = never> extends AddEventListenerOptions {
  key?: KeyType;
}

type Listener<EventType, KeyType> = (
  callback: ListenerCallback<EventType>,
  options?: ListenerOptions<KeyType>,
) => { removeListener: () => void };

const keyboardListener: Listener<KeyboardEvent, string> = (
  callback,
  options,
) => {
  const handleEvent = (event: KeyboardEvent) => {
    if (!options?.key) {
      // Any key
      return true;

      // Specific key
    } else if (options.key.toLowerCase() === event.key.toLowerCase()) {
      return true;
    }

    return false;
  };

  const onKeydownEvent = (event: KeyboardEvent) =>
    handleEvent(event) ? callback(true, event) : undefined;

  const onKeyupEvent = (event: KeyboardEvent) =>
    handleEvent(event) ? callback(false, event) : undefined;

  window.addEventListener("keydown", onKeydownEvent, options);
  window.addEventListener("keyup", onKeyupEvent, options);

  return {
    removeListener: () => {
      window.removeEventListener("keydown", onKeydownEvent, options);
      window.removeEventListener("keyup", onKeyupEvent, options);
    },
  };
};

const mouseListener: Listener<MouseEvent, MouseKeys> = (callback, options) => {
  const handleEvent = (event: MouseEvent) => {
    // Any key
    if (!options?.key) {
      return true;
    }

    // Specific key
    switch (options?.key) {
      case MouseKeys.LEFT_BUTTON:
        return event.button === 0;

      case MouseKeys.RIGHT_BUTTON:
        return event.button === 1;

      case MouseKeys.MIDDLE_BUTTON:
        return event.button === 2;

      default:
        return false;
    }
  };

  const onMousedownEvent = (event: MouseEvent) =>
    handleEvent(event) ? callback(true, event) : undefined;

  const onMouseupEvent = (event: MouseEvent) =>
    handleEvent(event) ? callback(false, event) : undefined;

  window.addEventListener("mousedown", onMousedownEvent, options);
  window.addEventListener("mouseup", onMouseupEvent, options);

  return {
    removeListener: () => {
      window.removeEventListener("mousedown", onMousedownEvent, options);
      window.removeEventListener("mouseup", onMouseupEvent, options);
    },
  };
};

// Publics
export const useKeyListener: KeyListener = (callback, keys) => {
  const removeListenersList: (() => void)[] = [];

  useEffect(() => {
    keys.forEach((key) => {
      if (key) {
        switch (key) {
          case MouseKeys.LEFT_BUTTON:
          case MouseKeys.RIGHT_BUTTON:
          case MouseKeys.MIDDLE_BUTTON:
            removeListenersList.push(
              mouseListener((pressing) => callback(pressing, key), { key })
                .removeListener,
            );
            break;

          default:
            removeListenersList.push(
              keyboardListener((pressing) => callback(pressing, key), {
                key,
              }).removeListener,
            );
            break;
        }
      }
    });

    return () => removeListenersList.forEach((remove) => remove());
  }, [callback, keys]);
  return {
    removeListener: () => {
      removeListenersList.forEach((remove) => remove());
    },
  };
};

export const listenKey: ListenKey = () =>
  new Promise((resolve) => {
    const options: ListenerOptions = { capture: true };

    const keyboard = keyboardListener((_, ev) => {
      removeListeners();

      if (ev.key !== "Escape") {
        resolve(ev.key.toLowerCase());
      }
      resolve(null);
    }, options);

    const mouse = mouseListener((_, ev) => {
      removeListeners();

      switch (ev.button) {
        case 0:
          resolve(MouseKeys.LEFT_BUTTON);
          break;

        case 1:
          resolve(MouseKeys.RIGHT_BUTTON);
          break;

        case 2:
          resolve(MouseKeys.MIDDLE_BUTTON);
          break;

        default:
          resolve(null);
      }
    }, options);

    function removeListeners() {
      mouse.removeListener();
      keyboard.removeListener();
    }
  });
