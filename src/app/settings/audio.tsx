import React from "react";
import { Platform, StyleSheet, useWindowDimensions } from "react-native";
import { SlideInLeft } from "react-native-reanimated";

import { useSoundContext } from "@/audio/sound";
import AudioVolume from "@/components/settings/audio/audioVolume";
import { SafeArea, View } from "@/components/shared";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { SettingsActions } from "@/store/reducers/settings/settingsActions";
import { SettingsSelectors } from "@/store/reducers/settings/settingsSelectors";

const volumeAnimation =
  Platform.OS !== "web"
    ? SlideInLeft.springify().delay(100).mass(0.5)
    : undefined;
export default function Audio() {
  const { width } = useWindowDimensions();
  const dispatch = useAppDispatch();
  const { musicVolume, soundVolume } = useAppSelector(
    SettingsSelectors.selectAudioSettings,
  );
  const { playSound } = useSoundContext();
  const handleVolumeSound = () => playSound("volume");

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
      <View
        style={[
          {
            width: width / 2,
          },
          styles.containerVolumes,
        ]}
      >
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
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
  },

  containerVolumes: {
    justifyContent: "space-evenly",
    flex: 1,
    flexDirection: "column",
  },
  volume: {
    margin: 18,
    width: "100%",
  },
});
