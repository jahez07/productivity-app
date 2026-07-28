import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function MoneyScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.note}>The Money Screen is built next</Text>
      <Pressable
        style={styles.btn}
        onPress={() => router.push("/expenses/accounts")}
      >
        <Text style={styles.btnTxt}>Manage Accounts</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  note: { color: "#666" },
  btn: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  btnTxt: { color: "#fff", fontWeight: "600" },
});
