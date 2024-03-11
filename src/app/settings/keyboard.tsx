import React, { useEffect, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import Animated, { SlideInLeft } from "react-native-reanimated";

import CommandListItem, {
  CommandListItemData,
  CommandListItemPress,
} from "@/components/settings/keyboard/commandListItem";
import KeyboardBindingModal, {
  KeyboardListenerModalData,
} from "@/components/settings/keyboard/keyboardBindingModal";
import { View } from "@/components/shared";
import Colors from "@/constants/Colors";
import { useAppSelector } from "@/store/hooks";
import { SettingsSelectors } from "@/store/reducers/settings/settingsSelectors";

const entering =
  Platform.OS !== "web"
    ? SlideInLeft.springify().delay(100).mass(0.5)
    : undefined;

export default function Keyboard() {
  const [modalData, setModalData] = useState<KeyboardListenerModalData>();
  const [data, setData] = useState<CommandListItemData[]>([]);
  const { keys } = useAppSelector(SettingsSelectors.selectKeyboardSettings);

  const handlePress: CommandListItemPress = (key, command) => {
    setModalData({ key, command });
  };

  const handleModalDismiss = () => {
    setModalData(undefined);
  };

  useEffect(() => {
    setData(keys);
  }, [keys]);

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={data}
        style={styles.list}
        entering={entering}
        renderItem={({ item }) =>
          CommandListItem({
            ...item,
            onPress: handlePress,
          })
        }
      />
      <KeyboardBindingModal data={modalData} onDismiss={handleModalDismiss} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: Colors.UI.background,
  },

  list: {
    margin: 32,
  },
});
