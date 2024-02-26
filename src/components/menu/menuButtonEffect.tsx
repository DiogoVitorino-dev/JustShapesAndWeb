import React from "react";
import { StyleSheet } from "react-native";
import { useAnimatedRef, useAnimatedStyle, useSharedValue } from "react-native-reanimated";

import { AnimatedView } from "../shared";

import Colors from "@/constants/Colors";
import { Size } from "@/constants/commonTypes";

interface ButtonMenuEffectProps {
  children?: React.ReactNode;
}

export default function ButtonMenuEffect({ children }: ButtonMenuEffectProps) {
  const ref = useAnimatedRef();
  const size = useSharedValue<Size>({ width: 0, height: 0 });
  const transRightX = useSharedValue(0);
  const transLeftX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(()=>({

  }))
  return (
    
  );
}

const styles = StyleSheet.create({
  
});
