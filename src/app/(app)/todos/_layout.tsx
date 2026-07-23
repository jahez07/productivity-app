import { Stack } from "expo-router";

export default function TodosStackLayout() {
  return (
    <Stack>
      {/* list keeps its own in-screen header row, so hide the native one */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* detail shows a native header — the back arrow here is your close button */}
      <Stack.Screen name="[id]" options={{ title: "Edit todo" }} />
    </Stack>
  );
}
