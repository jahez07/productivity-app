import { AuthProvider } from "@/lib/auth-context";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "My ToDos" }} />
      </Stack>
    </AuthProvider>
  );
}
