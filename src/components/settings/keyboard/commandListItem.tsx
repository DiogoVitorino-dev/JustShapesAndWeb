import React from "react";
import { Pressable, StyleSheet } from "react-native";

import { Text, View } from "@/components/shared";
import Colors from "@/constants/Colors";
import {
  GameCommands,
  KeyboardCommand,
  KeyboardKeys,
} from "@/settings/keyboardSettings";

export type CommandListItemData = KeyboardCommand;

type GameCommandsList = keyof typeof GameCommands;
type KeyboardKeysTypes = keyof KeyboardKeys;

export type CommandListItemPress = (
  key?: KeyboardKeysTypes,
  command?: GameCommandsList,
) => void;

export interface CommandListItemProps extends CommandListItemData {
  onPress?: CommandListItemPress;
}

export default function CommandListItem({
  command,
  primary,
  alternative,
  onPress,
}: CommandListItemProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.box, styles.command]}>
        <Text numberOfLines={1} adjustsFontSizeToFit style={styles.text}>
          {command}
        </Text>
      </View>

      <Pressable
        style={styles.box}
        onPress={() => {
          if (onPress) onPress("primary", command);
        }}
      >
        {({ pressed }) => (
          <Text style={[{ opacity: pressed ? 0.5 : 1 }, styles.text]}>
            {primary}
          </Text>
        )}
      </Pressable>

      <Pressable
        style={styles.box}
        onPress={() => {
          if (onPress) onPress("alternative", command);
        }}
      >
        {({ pressed }) => (
          <Text style={[{ opacity: pressed ? 0.5 : 1 }, styles.text]}>
            {alternative}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  command: {
    flex: 1,
  },
  box: {
    minWidth: 100,
    minHeight: 100,
    flex: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.UI.borderColor,
    justifyContent: "center",
  },

  text: {
    textAlign: "center",
    fontWeight: "bold",
  },
});
