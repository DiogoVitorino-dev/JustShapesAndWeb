import { ExperimentalBlurMethod } from "expo-blur";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Platform } from "react-native";

export default function useAndroidBlur() {
  const [blur, setBlur] = useState<ExperimentalBlurMethod>("none");

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === "android") {
        setTimeout(() => {
          setBlur("dimezisBlurView");
        }, 100);
        return () => {
          setBlur("none");
        };
      }
    }, []),
  );

  return { experimentalBlurMethod: blur };
}
