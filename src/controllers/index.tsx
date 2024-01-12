import React from "react";
import { View, StyleSheet, Platform } from "react-native";

import { ControlProp } from "./controllers.type";
import MobileControl from "./mobile";
import KeyboardControl from "./web";

interface ControllerProp extends ControlProp {}

export default function Controller({ onMove, velocity }: ControllerProp) {
  return (
    <View style={styles.container}>
      {Platform.OS === "ios" || Platform.OS === "android" ? (
        <MobileControl onMove={onMove} velocity={velocity} />
      ) : (
        <KeyboardControl onMove={onMove} velocity={velocity} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
});
