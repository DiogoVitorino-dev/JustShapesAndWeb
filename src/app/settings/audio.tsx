import React from "react";
import { Platform, StyleSheet } from "react-native";
import { SlideInLeft } from "react-native-reanimated";

import { useSoundContext } from "@/audio/sound";
import AudioVolume from "@/components/settings/audio/audioVolume";
import { SafeArea } from "@/components/shared";
import { useAppDispatch, useAppSelector } from "@/hooks";
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
  const { play } = useSoundContext();
  const handleVolumeSound = () => play("volume");

  const handleMusicVolume = async (musicVolume: number) => {
    await handleVolumeSound();
    await dispatch(SettingsActions.saveAudioSettings({ musicVolume })).unwrap();
  };

  const handleSoundVolume = async (soundVolume: number) => {
    await handleVolumeSound();
    await dispatch(SettingsActions.saveAudioSettings({ soundVolume })).unwrap();
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
    width: "100%",
    justifyContent: "space-evenly",
    flexDirection: "column",
    alignItems: "center",
  },
  volume: {
    marginBottom: 18,
    marginHorizontal: "auto",
  },
});
