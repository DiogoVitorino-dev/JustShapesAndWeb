import { useState } from "react";
import { Button, StyleSheet, Text, TextInput } from "react-native";

import { useSoundEffects } from "@/audio/sound/soundEffectSystem";
import { View } from "@/components/Themed";

export default function Audio() {
  const [progressValue, setProgressValue] = useState(0);
  const [volumeValue, setVolumeValue] = useState("1");
  const { getProgress, pause, play, setProgress, setVolume, loadAndPlay } =
    useSoundEffects();

  const handleGetProgress = async () => {
    setProgressValue((await getProgress()) || -1);
  };
  const handlePause = () => {
    pause();
  };
  const handleResume = () => {
    play();
  };
  const handlePlay = () => {
    loadAndPlay(require("@/assets/audio/sona.mp3"));
  };
  const handleSetProgress = () => {
    setProgress(progressValue);
  };
  const handleSetVolume = () => {
    setVolume(parseFloat(volumeValue.replace(/[^0-9.]/g, "")));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{volumeValue}</Text>
      <View style={styles.row}>
        <Button title="PLAY" onPress={handlePlay} />
        <Button title="PAUSE" onPress={handlePause} />
        <Button title="RESUME" onPress={handleResume} />
      </View>

      <View style={styles.column}>
        <TextInput
          value={progressValue.toString()}
          inputMode="numeric"
          style={styles.title}
          onChangeText={(text) => setProgressValue(Number(text))}
        />
        <View style={styles.row}>
          <Button title="SET PROGRESS" onPress={handleSetProgress} />
          <Button title="GET PROGRESS" onPress={handleGetProgress} />
        </View>
      </View>

      <View style={styles.column}>
        <TextInput
          value={volumeValue}
          style={styles.title}
          onChangeText={(text) => setVolumeValue(text)}
        />
        <Button title="SET VOLUME" onPress={handleSetVolume} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  row: {
    width: 300,
    marginHorizontal: 5,

    justifyContent: "space-around",
    flexDirection: "row",
  },

  column: {
    width: 300,
    height: 80,
    marginHorizontal: 5,
    justifyContent: "space-around",
    flexDirection: "column",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    borderColor: "white",
    borderWidth: 1,
  },
});
