import React from "react";
import { View, StyleSheet } from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { AnimatedView } from "@/components/shared";
import { ButtonData } from "@/controllers/mobile";
import { AreaButton } from "@/controllers/mobile/buttons";

export default function AreaButtonChamber() {
  const moveObject = useSharedValue(300);
  const animatedStyle = useAnimatedStyle(() => ({
    left: withRepeat(withTiming(moveObject.value, { duration: 500 }), -1, true),
  }));

  const handleOnPress = ({ jumping }: ButtonData) => {
    "worklet";
    console.log(jumping);
  };

  moveObject.value = 500;
  return (
    <View style={styles.container}>
      <AnimatedView style={[styles.feedbackObject, animatedStyle]} />
      <AreaButton onPress={handleOnPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  feedbackObject: {
    width: 50,
    height: 50,
    top: 100,
    position: "absolute",
    backgroundColor: "tomato",
  },
});
