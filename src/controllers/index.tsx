import React from "react";
import { StyleSheet, Platform } from "react-native";

import { ControlProp } from "./controllers.type";
import MobileControl from "./mobile";
import WebControl from "./web";

import { View } from "@/components/shared";

interface ControllerProp extends ControlProp {}

export default function Controller({ onMove, velocity }: ControllerProp) {
  return (
    <View style={styles.container} transparent>
      {Platform.OS === "ios" || Platform.OS === "android" ? (
        <MobileControl onMove={onMove} velocity={velocity} />
      ) : (
        <WebControl onMove={onMove} velocity={velocity} />
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
