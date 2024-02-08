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
      <Stack.Screen
        name="useAudioSystemChamber"
        options={{
          title: "Audio Hook chamber",
        }}
      />
      <Stack.Screen
        name="analogicDirectionalChamber"
        options={{
          title: "Analogic Directional chamber",
        }}
      />
      <Stack.Screen
        name="areaButtonChamber"
        options={{
          title: "Area Button chamber",
        }}
      />
      <Stack.Screen
        name="animationShakeChamber"
        options={{
          title: "Shake Animation chamber",
        }}
      />
    </Stack>
  );
}
