import { BlurView } from "expo-blur";
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, useWindowDimensions } from "react-native";

import { Text, View } from "@/components/shared";
import Colors from "@/constants/Colors";
import useAndroidBlur from "@/hooks/useAndroidBlur";
import {
  GameCommands,
  KeyboardCommand,
  KeyboardKeys,
} from "@/settings/keyboardSettings";
import { useAppDispatch } from "@/store/hooks";
import { SettingsActions } from "@/store/reducers/settings/settingsActions";
import { ListenersUtils } from "@/utils/listenersUtils";

type GameCommandsList = keyof typeof GameCommands;
type KeyboardKeysTypes = keyof KeyboardKeys;

export interface KeyboardListenerModalData {
  key?: KeyboardKeysTypes;
  command?: GameCommandsList;
}

export interface KeyboardListenerModalProps {
  onDismiss?: () => void;
  data?: KeyboardListenerModalData;
}

export default function KeyboardBindingModal({
  onDismiss,
  data,
}: KeyboardListenerModalProps) {
  const { width, height } = useWindowDimensions();
  const [visible, setVisible] = useState(false);
  const { experimentalBlurMethod } = useAndroidBlur();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data?.key && data?.command) {
      openModal();
      startListening(data.key, data.command);
    }
  }, [data]);

  const openModal = () => setVisible(true);

  const closeModal = () => setVisible(false);

  const save = (newValue: KeyboardCommand) =>
    dispatch(
      SettingsActions.saveKeyboardSettings({
        keys: [newValue],
      }),
    ).unwrap();

  const startListening = (
    key: KeyboardKeysTypes,
    command: GameCommandsList,
  ) => {
    ListenersUtils.web.listenKey(async (pressedKey) => {
      if (pressedKey) {
        switch (key) {
          case "primary":
            await save({ command, primary: pressedKey });
            break;

          case "alternative":
            await save({ command, alternative: pressedKey });
            break;
        }
      }

      closeModal();
    });
  };

  if (!visible) {
    return <></>;
  }

  return (
    <BlurView
      style={styles.container}
      intensity={20}
      experimentalBlurMethod={experimentalBlurMethod}
    >
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        transparent
        animationType="fade"
        style={[styles.modal]}
      >
        <View
          style={[
            { width: width / 2, height: height / 2 },
            styles.contentModal,
          ]}
        >
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.text}>
            Pressione alguma tecla do teclado ou mouse.
          </Text>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            secondary
            style={styles.text}
          >
            ESC para cancelar
          </Text>
        </View>
      </Modal>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },

  contentModal: {
    backgroundColor: Colors.UI.background,
    borderColor: Colors.UI.borderColor,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 20,
    flexDirection: "column",
    justifyContent: "center",
    margin: "auto",
  },

  modal: {
    margin: "auto",
  },

  text: {
    textAlign: "center",
    marginBottom: 22,
  },
});
