import { MouseKeys } from "@/utils/listenersUtils/webListeners";

export enum GameCommands {
  UP,
  LEFT,
  DOWN,
  RIGHT,
  JUMP,
}

export interface KeyboardKeys {
  primary?: string | MouseKeys;
  alternative?: string | MouseKeys;
}

export interface KeyboardCommand extends KeyboardKeys {
  command: keyof typeof GameCommands;
}

export interface KeyboardSettings {
  keys: KeyboardCommand[];
}

export const DefaultKeyboardSettings: KeyboardSettings = {
  keys: [
    { command: "UP", primary: "w", alternative: "ArrowUp" },
    { command: "LEFT", primary: "a", alternative: "ArrowLeft" },
    { command: "DOWN", primary: "s", alternative: "ArrowDown" },
    { command: "RIGHT", primary: "d", alternative: "ArrowRight" },
    { command: "JUMP", primary: " ", alternative: MouseKeys.LEFT_BUTTON },
  ],
};
