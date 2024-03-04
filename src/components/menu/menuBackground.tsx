import React from "react";
import { StyleSheet } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import MenuSquare from "./menuSquare";
import { AnimatedView, View } from "../shared";

import Colors from "@/constants/Colors";

type MenuBackgroundProps = React.ComponentProps<typeof View>;

export default function MenuBackground(props: MenuBackgroundProps) {
  const scale = useSharedValue(1);

  const createSquares = () => {
    const squares: React.JSX.Element[] = [];
    for (let index = 0; index < 9; index++) {
      squares.push(<MenuSquare key={`square_${index}`} />);
    }
    return squares;
  };

  return (
    <SafeAreaView style={styles.root}>
      <View transparent {...props} />
      <AnimatedView
        style={[styles.containerGeometry, { transform: [{ scale }] }]}
      >
        {createSquares()}
      </AnimatedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.UI.background,
  },

  containerGeometry: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: -1,
  },
});
