export interface GameCommands {
  up: string;
  left: string;
  down: string;
  right: string;
  jump: string;
}

export interface KeyboardKeys {
  primary: GameCommands;
  alternative: GameCommands;
}

export interface KeyboardSettings {
  keys: KeyboardKeys;
}

export const DefaultKeyboardSettings: KeyboardSettings = {
  keys: {
    primary: {
      up: "w",
      left: "a",
      down: "s",
      right: "d",
      jump: " ",
    },
    alternative: {
      up: "ArrowUp",
      left: "ArrowLeft",
      down: "ArrowDown",
      right: "ArrowRight",
      jump: "MOUSE_CLICK",
    },
  },
};
