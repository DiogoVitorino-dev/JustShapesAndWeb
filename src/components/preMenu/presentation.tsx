import React, { useEffect } from "react";
import { StyleSheet, Platform } from "react-native";
import { useSharedValue, withTiming } from "react-native-reanimated";

import { AnimatedText, BouncingText, View } from "../shared";

import Colors from "@/constants/Colors";
import { AreaButton } from "@/controllers/mobile/buttons";
import { ListenersUtils } from "@/utils/listenersUtils";

interface PresentationProps {
  onUserInteract?: () => void;
}

export default function Presentation({ onUserInteract }: PresentationProps) {
  const opacity = useSharedValue(0);

  const showTip = () => {
    opacity.value = withTiming(0.9, { duration: 500 });
  };

  const onPressWeb = () =>
    Platform.OS === "web" && onUserInteract
      ? ListenersUtils.web.listenKey(onUserInteract)
      : undefined;

  useEffect(() => {
    onPressWeb();
  }, []);

  return (
    <View background style={styles.container}>
      <View style={styles.titleContainer}>
        <BouncingText
          type="title"
          start
          duration={5000}
          toggle
          style={styles.defaultText}
          containerStyle={styles.containerText}
        >
          Just
        </BouncingText>
        <BouncingText
          type="title"
          start
          duration={7000}
          toggle
          style={[styles.defaultText, { color: Colors.Menu.title.variant_1 }]}
          containerStyle={styles.containerText}
        >
          ShAPES
        </BouncingText>
        <BouncingText
          type="title"
          start
          duration={9000}
          toggle
          style={styles.defaultText}
          containerStyle={styles.containerText}
        >
          &
        </BouncingText>
        <BouncingText
          type="title"
          start
          duration={11000}
          toggle
          style={[styles.defaultText, { color: Colors.Menu.title.variant_2 }]}
          containerStyle={styles.containerText}
          onStartAnimationEnds={showTip}
        >
          Web
        </BouncingText>
      </View>
      <AnimatedText.Text style={[{ opacity }, styles.tipText]}>
        Pressione para continuar
      </AnimatedText.Text>
      {Platform.OS === "android" || Platform.OS === "ios" ? (
        <AreaButton
          onPress={onUserInteract}
          indicatorSize={0}
          style={{ width: "100%" }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
  },

  defaultText: {
    fontSize: 80,
    color: Colors.Menu.title.default,
  },

  containerText: {
    marginLeft: 28,
  },

  titleContainer: {
    flexDirection: "row",
  },

  tipText: {
    marginTop: 16,
  },
});
