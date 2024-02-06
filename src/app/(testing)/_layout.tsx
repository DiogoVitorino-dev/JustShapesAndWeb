import { Stack } from "expo-router";

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */

export default function TestingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Choose Section",
        }}
      />

      <Stack.Screen
        name="sandbox"
        options={{
          title: "Sandbox",
        }}
      />

      <Stack.Screen
        name="chambers"
        options={{
          title: "Test Chambers",
        }}
      />
    </Stack>
  );
}
