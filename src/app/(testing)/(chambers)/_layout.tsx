import { Stack } from "expo-router";

export default function ChambersLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Test Chambers List",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
