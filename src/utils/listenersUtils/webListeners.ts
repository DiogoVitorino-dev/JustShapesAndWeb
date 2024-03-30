export enum MouseKeys {
  LEFT_BUTTON = "LMB",
  RIGHT_BUTTON = "RMB",
  MIDDLE_BUTTON = "MMB",
}

export type ListenKey = (callback: (key: string | null) => void) => {
  removeListener: () => void;
};

export type ListenerCallback<EventType> = (
  pressing: boolean,
  event: EventType,
) => void;

export interface ListenerOptions<KeyType = never>
  extends AddEventListenerOptions {
  key?: KeyType;
}

type Listener<EventType, KeyType> = (
  callback: ListenerCallback<EventType>,
  options?: ListenerOptions<KeyType>,
) => { removeListener: () => void };

export const keyboardListener: Listener<KeyboardEvent, string> = (
  callback,
  options,
) => {
  const handleEvent = (event: KeyboardEvent) => {
    // Specific key

    if (options?.key) {
      return options.key.toLowerCase() === event.key.toLowerCase();
    }
    // Any key
    return true;
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

export const mouseListener: Listener<MouseEvent, MouseKeys> = (
  callback,
  options,
) => {
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

export const listenKey: ListenKey = (callback) => {
  const options: ListenerOptions = { capture: true };

  const keyboard = keyboardListener((_, ev) => {
    removeListeners();

    if (ev.key !== "Escape") {
      callback(ev.key.toLowerCase());
    }
    callback(null);
  }, options);

  const mouse = mouseListener((_, ev) => {
    removeListeners();

    switch (ev.button) {
      case 0:
        callback(MouseKeys.LEFT_BUTTON);
        break;

      case 1:
        callback(MouseKeys.RIGHT_BUTTON);
        break;

      case 2:
        callback(MouseKeys.MIDDLE_BUTTON);
        break;

      default:
        callback(null);
    }
  }, options);

  function removeListeners() {
    mouse.removeListener();
    keyboard.removeListener();
  }

  return { removeListener: removeListeners };
};
