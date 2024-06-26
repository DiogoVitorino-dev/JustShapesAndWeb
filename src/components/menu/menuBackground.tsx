import React from "react";
import { StyleSheet } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";

import MenuSquare from "./menuSquare";
import { SafeArea, View } from "../shared";

import Colors from "@/constants/Colors";

type MenuBackgroundProps = React.ComponentProps<typeof Animated.View>;

export default function MenuBackground({ ...props }: MenuBackgroundProps) {
  const scale = useSharedValue(1);

  const createSquares = () => {
    const squares: React.JSX.Element[] = [];
    for (let index = 0; index < 9; index++) {
      squares.push(<MenuSquare key={`square_${index}`} />);
    }
    return squares;
  };

  return (
    <View style={styles.root}>
      <SafeArea>
        <Animated.View {...props} />
      </SafeArea>
      <Animated.View
        style={[styles.containerGeometry, { transform: [{ scale }] }]}
      >
        {createSquares()}
      </Animated.View>
    </View>
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
