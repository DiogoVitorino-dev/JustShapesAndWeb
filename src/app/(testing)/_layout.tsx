import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

import Colors from "../../constants/Colors";

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={22} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.UI.tabIconSelected,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Sandbox",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="globe" color={color} />,
        }}
      />

      <Tabs.Screen
        name="chambers"
        options={{
          title: "Test Chambers",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="industry" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
