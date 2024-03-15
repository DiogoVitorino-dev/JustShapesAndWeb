import { useEffect } from "react";

import { ListenersUtils } from "@/utils/listenersUtils";
import { MouseKeys } from "@/utils/listenersUtils/webListeners";

type ListenerRemove = () => void;

export type KeyListener = (
  callback: (pressing: boolean, key: string) => void,
  keys: (string | undefined)[],
) => { removeListener: ListenerRemove };

export const useKeyListener: KeyListener = (callback, keys) => {
  const removeListeners: ListenerRemove[] = [];
  const { keyboardListener, mouseListener } = ListenersUtils.web;

  const setListener = (key: string) => {
    switch (key) {
      case MouseKeys.LEFT_BUTTON:
      case MouseKeys.RIGHT_BUTTON:
      case MouseKeys.MIDDLE_BUTTON:
        removeListeners.push(
          mouseListener((pressing) => callback(pressing, key), {
            key,
          }).removeListener,
        );

        break;

      default:
        removeListeners.push(
          keyboardListener((pressing) => callback(pressing, key), {
            key,
          }).removeListener,
        );
        break;
    }
  };

  useEffect(() => {
    keys.forEach((key) => (key ? setListener(key) : null));
    return () => removeListeners.forEach((remove) => remove());
  }, [callback, keys]);

  return {
    removeListener: () => {
      removeListeners.forEach((remove) => remove());
    },
  };
};
