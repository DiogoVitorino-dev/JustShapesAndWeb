import React from "react";
import { StyleSheet } from "react-native";
import {
  Easing,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import MenuSquare from "./menuSquare";
import { AnimatedView, View } from "../shared";

type MenuBackgroundProps = React.ComponentProps<typeof View>;

export default function MenuBackground(props: MenuBackgroundProps) {
  const scale = useSharedValue(1);

  scale.value = withRepeat(
    withTiming(1.03, { duration: 300, easing: Easing.out(Easing.exp) }),
    -1,
    true,
  );

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
  },

  containerGeometry: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: -1,
  },
});
