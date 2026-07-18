import { useAuth } from "@/lib/auth-context";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import {
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";

export default function ToDosScreen() {
  const { user, loading } = useAuth();

  return (
    <View style={styles.centered}>
      <Text style={styles.title}>My ToDos</Text>
      <Text style={styles.subtitle}>Logged in as {user?.email}</Text>
      <Pressable style={styles.signOut} onPress={() => signOut(auth)}>
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: { fontSize: 24, fontWeight: "600" },
  subtitle: { fontSize: 14, color: "#666", marginTop: 8 },
  signOut: {
    marginTop: 24,
    paddingVertical: 19,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#dc2626",
    borderRadius: 8,
  },
  signOutText: { color: "#dc2626", fontWeight: "600" },
});
