import * as Audio from "./audioSettings";
import * as Keyboard from "./keyboardSettings";

export interface Settings {
  keyboard: Keyboard.KeyboardSettings;
  audio: Audio.AudioSettings;
}

export const DefaultSettings: Settings = {
  audio: Audio.DefaultAudioSetting,
  keyboard: Keyboard.DefaultKeyboardSettings,
};
