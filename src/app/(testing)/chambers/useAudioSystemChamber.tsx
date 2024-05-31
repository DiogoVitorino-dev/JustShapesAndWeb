import { useEffect, useState } from "react";
import { Button, StyleSheet, TextInput } from "react-native";

import { useMusicContext } from "@/audio/music";
import { View } from "@/components/shared";
import Colors from "@/constants/Colors";

export default function UseAudioSystemChamber() {
  const [progressValue, setProgressValue] = useState(0);
  const [volumeValue, setVolumeValue] = useState("1");
  const {
    getProgress,
    stop,
    pause,
    play,
    skip,
    playMusic,
    setProgress,
    setVolume,
  } = useMusicContext();

  const handleGetProgress = async () => {
    setProgressValue((await getProgress()) || -1);
  };
  const handlePause = () => pause();
  const handleFadedPause = () => pause(3000);

  const handlePlay = async () => play();
  const handleFadedPlay = async () => play(3000);

  const handleStop = async () => stop();
  const handleFadedStop = async () => stop(3000);

  const handleSkip = async () => skip(0);
  const handleFadedSkip = async () => skip(0, 3000);

  const handleMusic = async () => playMusic("blackbox-ani");

  const handleSetProgress = () => setProgress(progressValue);

  const handleSetVolume = () =>
    setVolume(parseFloat(volumeValue.replace(/[^0-9.]/g, "")));

  useEffect(() => {
    handleMusic();
    return () => {
      stop();
    };
  }, []);

  return (
    <View style={[styles.container]}>
      <View style={styles.column}>
        <Button title="PLAY" onPress={handlePlay} />
        <Button title="FADED PLAY" onPress={handleFadedPlay} />
      </View>

      <View style={styles.column}>
        <Button title="PAUSE" onPress={handlePause} />
        <Button title="FADED PAUSE" onPress={handleFadedPause} />
      </View>

      <View style={styles.column}>
        <Button title="SKIP" onPress={handleSkip} />
        <Button title="FADED SKIP" onPress={handleFadedSkip} />
      </View>

      <View style={styles.column}>
        <Button title="STOP" onPress={handleStop} />
        <Button title="FADED STOP" onPress={handleFadedStop} />
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
    flexWrap: "wrap",
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
