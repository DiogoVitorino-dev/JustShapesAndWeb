import { Href } from "expo-router";
import React from "react";
import { Pressable, StyleSheet } from "react-native";

import { Icon, IconProps, TextTitle, View } from "@/components/shared";
import Colors from "@/constants/Colors";

export type SettingItemPress = (to: Href<string>) => void;

interface SettingItemProps {
  title: string;
  icon: IconProps["name"];
  to: Href<string>;
  onPress?: SettingItemPress;
  onHoverIn?: () => void;
  onHoverOut?: () => void;
}

export default function SettingItem({
  title,
  icon,
  to,
  onHoverIn,
  onPress,
  onHoverOut,
}: SettingItemProps) {
  return (
    <Pressable
      onPress={() => {
        if (onPress) onPress(to);
      }}
      onHoverIn={onHoverIn}
      onHoverOut={onHoverOut}
    >
      <View style={styles.item}>
        <Icon
          name={icon}
          size={38}
          style={styles.icon}
          color={Colors.settings.iconItem}
        />
        <TextTitle style={styles.itemText}>{title}</TextTitle>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    paddingBottom: 16,
    alignItems: "center",
  },
  itemText: {
    height: "auto",
  },

  icon: {
    marginRight: 32,
  },
});
