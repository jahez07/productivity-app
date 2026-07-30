import { useAccounts } from "@/hooks/use-accounts";
import { addAccount } from "@/lib/accounts";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function AccountScreen() {
  const { user } = useAuth();
  const { accounts, loading } = useAccounts();
  const router = useRouter();

  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("AED");
  const [balance, setBalance] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleAdd() {
    if (!name.trim() || !currency.trim() || !user) return;

    const start = parseFloat(balance) || 0; // blank or invalid -> 0
    setSaving(true);

    try {
      await addAccount(user.uid, name, currency.toUpperCase(), start);
      setName("");
      setCurrency("AED");
      setBalance("");
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Account name (e.g. Emirates NBD)"
          value={name}
          onChangeText={setName}
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.flex1]}
            placeholder="Currency"
            value={currency}
            onChangeText={setCurrency}
            autoCapitalize="characters"
          />
          <TextInput
            style={[styles.input, styles.flex1]}
            placeholder="Starting balance"
            value={balance}
            onChangeText={setBalance}
            keyboardType="decimal-pad"
          />
        </View>
        <Pressable style={styles.addBtn} onPress={handleAdd} disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.addBtnText}>Add account</Text>
          )}
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={accounts}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.empty}>No accounts yet. Add one above</Text>
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.accountRow}
              onPress={() =>
                router.push({
                  pathname: "/expenses/account/[id]",
                  params: { id: item.id },
                })
              }
            >
              <Text style={styles.accountName}>{item.name}</Text>
              <Text style={styles.accountMeta}>{item.currency}</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  form: { gap: 8, marginBottom: 20 },
  row: { flexDirection: "row", gap: 8 },
  flex1: { flex: 1 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  addBtn: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  addBtnText: { color: "#fff", fontWeight: "600" },
  accountRow: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  accountName: { fontSize: 16, fontWeight: "500" },
  accountMeta: { fontSize: 13, color: "#888", marginTop: 2 },
  empty: { textAlign: "center", color: "#999", marginTop: 32 },
});
