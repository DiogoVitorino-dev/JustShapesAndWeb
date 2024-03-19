import { FontAwesome } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Pressable, SectionList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Text, TextTitle, View } from "@/components/shared";
import { Pink, White } from "@/constants/Colors";

interface SectionData {
  name: string;
  to: Href<string>;
}

interface ListItem extends SectionData {
  onPress: (data: SectionData) => void;
}

const ListItemView = ({ name, onPress, ...others }: ListItem) => {
  return (
    <Pressable onPress={() => onPress({ name, ...others })}>
      {({ pressed }) => {
        return (
          <View style={[styles.item, { opacity: pressed ? 0.6 : 1 }]}>
            <Text style={styles.itemText}>{name}</Text>
          </View>
        );
      }}
    </Pressable>
  );
};

interface SectionHeader {
  title: keyof typeof SectionsNames;
  icon: React.ComponentProps<typeof FontAwesome>["name"];
}

const SectionHeaderView = ({ title, icon }: SectionHeader) => (
  <View transparent style={styles.sectionHeader}>
    <FontAwesome
      name={icon}
      size={28}
      style={styles.sectionHeaderIcon}
      color={Pink["80"]}
    />
    <TextTitle>{title}</TextTitle>
  </View>
);

interface ListData {
  section: SectionHeader;
  data: SectionData[];
}

const ListEmpty = () => (
  <Text style={styles.listEmptyText}>No chambers ;(</Text>
);

const ListHeader = () => (
  <View transparent style={styles.listHeader}>
    <TextTitle style={styles.listHeaderTitle}>Test Chambers</TextTitle>
    <Text style={styles.listHeaderSubtitle}>
      Designed to perform interactive and specific tests
    </Text>
  </View>
);

enum SectionsNames {
  Audio,
  Controllers,
  Animations,
  Scripts,
}

const Sections: Record<keyof typeof SectionsNames, SectionHeader> = {
  Audio: { title: "Audio", icon: "music" },
  Controllers: { title: "Controllers", icon: "gamepad" },
  Animations: { title: "Animations", icon: "video-camera" },
  Scripts: { title: "Scripts", icon: "code" },
};

export default function TestChamberList() {
  const router = useRouter();
  const handleOnPress = ({ to }: SectionData) => router.push(to);

  const chambers: ListData[] = [
    {
      section: Sections.Audio,
      data: [
        { name: "Audio Hook", to: "/chambers/analogicDirectionalChamber" },
      ],
    },
    {
      section: Sections.Controllers,
      data: [
        {
          name: "Analogic Directional",
          to: "/chambers/analogicDirectionalChamber",
        },
        {
          name: "Area Button",
          to: "/(testing)/chambers/areaButtonChamber",
        },
      ],
    },
    {
      section: Sections.Animations,
      data: [
        { name: "Shaker Animation", to: "/chambers/animationShakeChamber" },
        { name: "Grenade Attack", to: "/chambers/animationGrenadeChamber" },
      ],
    },
    {
      section: Sections.Scripts,
      data: [
        { name: "Collision System", to: "/chambers/useCollisionSystemChamber" },
        { name: "Movement System", to: "/chambers/useMovementSystemChamber" },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={chambers}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        renderSectionHeader={({ section }) =>
          SectionHeaderView({ ...section.section })
        }
        renderItem={({ item }) =>
          ListItemView({ ...item, onPress: handleOnPress })
        }
      />
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Pink["15"],
  },

  listHeader: {
    flexDirection: "column",
    alignItems: "center",
  },
  listHeaderTitle: {
    marginBottom: 3,
  },
  listHeaderSubtitle: {
    fontSize: 12,
    color: White["60"],
  },

  listEmptyText: {
    textAlign: "center",
    marginTop: 48,
    color: Pink["100"],
  },

  list: {
    flex: 1,
    width: "100%",
    paddingTop: 16,
  },

  item: {
    backgroundColor: Pink["40"],
    width: 500,
    justifyContent: "center",
    paddingLeft: 10,
    marginBottom: 8,
    borderRadius: 5,
  },
  itemText: {
    color: White["80"],
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 8,
  },

  sectionHeaderIcon: {
    marginRight: 6,
  },
});
