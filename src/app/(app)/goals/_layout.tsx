import { Stack } from "expo-router";

export default function GoalsStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Goals" }} />
      <Stack.Screen name="[id]" options={{ title: "Goal"}} />
    </Stack>
  );
}
