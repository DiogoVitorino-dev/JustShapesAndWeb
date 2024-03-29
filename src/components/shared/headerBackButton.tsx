import { router } from "expo-router";
import React from "react";
import { StyleSheet, Pressable, View, Text } from "react-native";

import { Icon } from "./icon";

import Colors from "@/constants/Colors";
import { StackScreenOptions } from "@/constants/commonTypes";

type NativeHeaderBackButton = Exclude<
  Exclude<Exclude<StackScreenOptions, Function>, undefined>["headerLeft"],
  undefined
>;

type RouterParams = Parameters<Extract<StackScreenOptions, Function>>[0];
type HeaderBackButtonParams = Parameters<NativeHeaderBackButton>[0];

export interface HeaderBackButtonProps
  extends HeaderBackButtonParams,
    RouterParams {
  onPress?: () => Promise<void>;
}

export function HeaderBackButton({
  route,
  onPress,
  canGoBack,
  label,
  tintColor,
  navigation,
}: HeaderBackButtonProps) {
  const handlePress = async () => {
    if (onPress) await onPress();
    if (canGoBack) {
      navigation.goBack();
    } else {
      router.replace("/");
    }
  };

  return (
    <Pressable onPress={handlePress}>
      {({ pressed }) => (
        <View>
          <Icon
            style={[
              { transform: [{ scale: pressed ? 0.95 : 1 }] },
              styles.spacing,
            ]}
            name="arrow-back"
            size={26}
            color={tintColor}
          />
          {label ? (
            <Text style={[styles.label, styles.spacing]}>{label}</Text>
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: "Manjari",
    fontSize: 16,
    color: Colors.UI.text,
  },

  spacing: {
    margin: 3,
    marginLeft: 12,
    padding: 3,
  },
});
