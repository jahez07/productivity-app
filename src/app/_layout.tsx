import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

function RootNavigator() {
  const { user, loading } = useAuth();

  // While Firebase restores the session from storage, show a spinner -
  // this prevents the login screen flashing at an already-logged-in user.
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
