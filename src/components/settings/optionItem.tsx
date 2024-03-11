import { Href, Link } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

import { Icon, IconProps, TextTitle, View } from "@/components/shared";
import Colors from "@/constants/Colors";

interface ListItemData {
  title: string;
  icon: IconProps["name"];
  to: Href<string>;
}

export default function OptionItem({ title, icon, to }: ListItemData) {
  return (
    <Link href={to}>
      <View style={styles.item}>
        <Icon
          name={icon}
          size={38}
          style={styles.icon}
          color={Colors.options.iconItem}
        />
        <TextTitle style={styles.itemText}>{title}</TextTitle>
      </View>
    </Link>
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
