import React from "react";
import { Platform, StyleSheet } from "react-native";
import { SlideInLeft } from "react-native-reanimated";

import AudioVolume from "@/components/settings/audio/audioVolume";
import { SafeArea } from "@/components/shared";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { SettingsActions } from "@/store/reducers/settings/settingsActions";
import { SettingsSelectors } from "@/store/reducers/settings/settingsSelectors";

const volumeAnimation =
  Platform.OS !== "web"
    ? SlideInLeft.springify().delay(100).mass(0.5)
    : undefined;
export default function Audio() {
  const dispatch = useAppDispatch();
  const { musicVolume, soundVolume } = useAppSelector(
    SettingsSelectors.selectAudioSettings,
  );

  const handleMusicVolume = (musicVolume: number) => {
    dispatch(SettingsActions.saveAudioSettings({ musicVolume }));
  };

  const handleSoundVolume = (soundVolume: number) => {
    dispatch(SettingsActions.saveAudioSettings({ soundVolume }));
  };

  return (
    <SafeArea style={styles.container}>
      <AudioVolume
        title="Música"
        layoutAnimation={volumeAnimation}
        value={musicVolume}
        onValueChange={handleMusicVolume}
        style={styles.volume}
      />
      <AudioVolume
        title="Som"
        layoutAnimation={volumeAnimation}
        value={soundVolume}
        onValueChange={handleSoundVolume}
        style={styles.volume}
      />
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    flexDirection: "column",
  },
  volume: {
    marginBottom: 18,
  },
});
