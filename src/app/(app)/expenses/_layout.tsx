import { Stack } from "expo-router";

export default function ExpensesStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Money" }} />
      <Stack.Screen name="accounts" options={{ title: "Accounts" }} />
    </Stack>
  );
}
