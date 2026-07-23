import { StyleSheet, Text, View } from "react-native";

export default function GoalsScreen() {
  return (
    <View style={styles.centered}>
      <Text style={styles.text}>Goals list coming next</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  text: { color: "#666", fontSize: 16 },
});
