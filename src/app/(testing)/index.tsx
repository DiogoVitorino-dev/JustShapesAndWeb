import { FontAwesome } from "@expo/vector-icons";
import { Href, Link, useFocusEffect, useRouter } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

import { Text, View } from "@/components/shared";
import Colors, { Pink } from "@/constants/Colors";

interface LinkButtonProps {
  href: Href<string>;
  title: string;
  icon?: React.ComponentProps<typeof FontAwesome>["name"];
  color?: string;
}
const LinkButton = ({ href, title, color, icon }: LinkButtonProps) => (
  <Link href={href}>
    <View transparent style={styles.linkButton}>
      <FontAwesome
        name={icon || "wrench"}
        color={color || Colors.UI.tint}
        size={48}
      />
      <Text style={[styles.linkButtonText]}>{title}</Text>
    </View>
  </Link>
);

export default function ChooseSection() {
  /*const router = useRouter();
  useFocusEffect(() => {
    const autoPush: Href<string> | undefined =
      "/chambers/animationShakeChamber";
    if (autoPush) {
      router.push(autoPush);
    }
  });*/
  return (
    <View style={styles.container}>
      <View style={styles.containerButtons}>
        <LinkButton href="/sandbox" title="Sandbox" icon="globe" />
        <LinkButton
          href="/chambers/"
          title="Test Chambers"
          icon="connectdevelop"
          color={Pink["100"]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  containerButtons: {
    width: "100%",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  linkButton: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  linkButtonText: {
    marginTop: 4,
    elevation: 5,
  },
});
