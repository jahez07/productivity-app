import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "My ToDos" }} />
      <Stack.Screen name="todo/[id]" options={{ title: "Edit todo" }} />
    </Stack>
  );
}
