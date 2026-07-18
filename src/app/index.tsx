import { StyleSheet, Text, View } from "react-native";
import { useAuth } from "@/lib/auth-context";

export default function TodosScreen() {
  const { user, loading } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My ToDos</Text>
      <Text style={styles.subtitle}>
        {loading ? 'Checking auth...' : user ? `Logged in: ${user.email}`: 'Not logged in'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: { fontSize: 24, fontWeight: "600" },
  subtitle: { fontSize: 14, color: "#666", marginTop: 8 },
});
