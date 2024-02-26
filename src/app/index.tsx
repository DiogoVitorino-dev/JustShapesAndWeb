import React from "react";
import { StyleSheet } from "react-native";

import ButtonMenu from "@/components/menu/menuButton";
import MenuBackground from "@/components/menu/menuBackground";
import { View } from "@/components/shared";

export default function Menu() {
  return (
    <MenuBackground style={styles.container}>
      <View>

      <ButtonMenu title="Jogar" />
      </View>
    </MenuBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
});
