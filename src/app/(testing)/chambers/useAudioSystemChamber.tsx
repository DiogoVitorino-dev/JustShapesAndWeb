import { useState } from "react";
import { Button, StyleSheet, TextInput } from "react-native";

import { useSoundContext } from "@/audio/sound";
import { View, Text } from "@/components/shared";
import Colors from "@/constants/Colors";

export default function UseAudioSystemChamber() {
  const [progressValue, setProgressValue] = useState(0);
  const [volumeValue, setVolumeValue] = useState("1");
  const { getProgress, pause, play, setProgress, setVolume } =
    useSoundContext();

  const handleGetProgress = async () => {
    setProgressValue((await getProgress()) || -1);
  };
  const handlePause = () => {
    pause();
  };

  const handleResume = async () => play();

  const handlePlay = async () => play("start");

  const handleSetProgress = () => {
    setProgress(progressValue);
  };
  const handleSetVolume = () => {
    setVolume(parseFloat(volumeValue.replace(/[^0-9.]/g, "")));
  };

  const handleFadedPause = () => pause(3000);

  return (
    <View style={styles.container}>
      <Text style={styles.input}>Volume to set: {volumeValue}</Text>
      <View style={styles.row}>
        <Button title="PLAY" onPress={handlePlay} />
        <Button title="PAUSE" onPress={handlePause} />
        <Button title="FADED PAUSE" onPress={handleFadedPause} />
        <Button title="RESUME" onPress={handleResume} />
      </View>

      <View style={styles.column}>
        <TextInput
          value={progressValue.toString()}
          inputMode="numeric"
          style={styles.input}
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
          style={styles.input}
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
    flexWrap: "wrap",
  },

  column: {
    width: 300,
    height: 80,
    marginHorizontal: 5,
    justifyContent: "space-around",
    flexDirection: "column",
  },
  input: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.UI.text,
    borderWidth: 1,
    borderColor: Colors.UI.borderColor,
  },
});
