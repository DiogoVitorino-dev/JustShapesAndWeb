import { BlurView } from "expo-blur";
import React from "react";
import { StyleSheet, Text, useWindowDimensions } from "react-native";
import { FadingTransition } from "react-native-reanimated";

import MenuBackground from "@/components/menu/menuBackground";
import MenuButton from "@/components/menu/menuButton";
import { TextTitle, View } from "@/components/shared";
import Colors from "@/constants/Colors";
import { useAndroidBlur } from "@/hooks";

const layoutAnimation = FadingTransition.duration(100);

export default function Menu() {
  const { height } = useWindowDimensions();
  const { experimentalBlurMethod } = useAndroidBlur();

  return (
    <MenuBackground layout={layoutAnimation} style={styles.container}>
      <View style={[{ height }, styles.containerButtons]}>
        <MenuButton
          title="Jogar"
          href="/stages/"
          isStart
          style={{ marginVertical: 18, height: height / 5 }}
        />
        <MenuButton
          title="Opções"
          index={1}
          style={{ marginVertical: 18, height: height / 5 }}
          href="/settings/"
        />
        {__DEV__ ? (
          <MenuButton
            title="Testing"
            index={2}
            style={{ marginVertical: 18, height: height / 5 }}
            href="/(testing)"
          />
        ) : null}
      </View>
      <View style={[{ height }, styles.containerTitle]}>
        <BlurView
          style={styles.blur}
          blurReductionFactor={4}
          intensity={20}
          experimentalBlurMethod={experimentalBlurMethod}
        >
          <TextTitle
            style={styles.title}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            <Text>Just </Text>
            <Text style={styles.titleVariant}>Shapes</Text>
          </TextTitle>

          <TextTitle
            style={styles.title}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            <Text>& </Text>
            <Text style={styles.titleVariant2}>Web</Text>
          </TextTitle>
        </BlurView>
      </View>
    </MenuBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  buttons: {
    marginVertical: 18,
  },

  containerButtons: {
    flex: 1.5,
    justifyContent: "center",
  },

  containerTitle: {
    flex: 1,
  },

  blur: {
    flex: 1,
    borderRadius: 10,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  title: {
    fontSize: 55,
    textAlign: "center",
    color: Colors.Menu.title.default,
  },

  titleVariant: {
    color: Colors.Menu.title.variant_1,
  },

  titleVariant2: {
    color: Colors.Menu.title.variant_2,
  },
});
