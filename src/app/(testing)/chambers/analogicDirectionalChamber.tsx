import React from "react";
import { View, StyleSheet } from "react-native";

import { DirectionalData } from "@/controllers/mobile";
import { AnalogicDirectional } from "@/controllers/mobile/directional";

export default function AnalogicDirectionalChamber() {
  const handler = ({ angle, x, y }: DirectionalData) => {
    "worklet";
  };
  return (
    <View style={styles.container}>
      <AnalogicDirectional onMove={handler} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});
