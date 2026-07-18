import { StyleSheet, Text, View } from "react-native";

export default function TodosScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My ToDos</Text>
      <Text style={styles.subtitle}>
        Nothing here yet — we build this next.
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
