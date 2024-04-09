import { Stack } from "expo-router";

export default function ChambersLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Test Chambers List",
          headerShown: true,
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
      <Stack.Screen
        name="useCollisionSystemChamber"
        options={{
          title: "Collision System chamber",
        }}
      />
      <Stack.Screen
        name="useMovementSystemChamber"
        options={{
          title: "Movement System chamber",
        }}
      />
      <Stack.Screen
        name="animationGrenadeChamber"
        options={{
          title: "Grenade Attack chamber",
        }}
      />
      <Stack.Screen
        name="animationFlashChamber"
        options={{
          title: "Flash Effect chamber",
        }}
      />
      <Stack.Screen
        name="animationBeamChamber"
        options={{
          title: "Beam Attack chamber",
        }}
      />
    </Stack>
  );
}
