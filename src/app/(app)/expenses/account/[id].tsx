import {
  deleteAccountWithTransactions,
  getAccount,
  updateAccount,
} from "@/lib/accounts";
import { useAuth } from "@/lib/auth-context";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function EditAccountScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("");
  const [balance, setBalance] = useState("");

  useEffect(() => {
    (async () => {
      const acc = await getAccount(id);
      if (!acc) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setName(acc.name);
      setCurrency(acc.currency);
      setBalance(
        acc.startingBalance != null ? String(acc.startingBalance) : "",
      );
      setLoading(false);
    })();
  }, [id]);

  function goBackToList() {
    if (router.canGoBack()) router.back();
    else router.replace("/expenses/accounts");
  }

  async function handleSave() {
    if (!name.trim() || !currency.trim()) return;
    setSaving(true);
    try {
      await updateAccount(id, {
        name: name.trim(),
        currency: currency.toUpperCase(),
        startingBalance: parseFloat(balance) || 0,
      });
      goBackToList();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete() {
    Alert.alert(
      "Delete account?",
      "This permanently deletes the account AND every transaction in it. This cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (!user) return;
            try {
              const removed = await deleteAccountWithTransactions(user.uid, id);
              console.log(`Deleted account + ${removed} transactions`);
              goBackToList();
            } catch (e) {
              console.error(e);
            }
          },
        },
      ],
    );
  }

  if (loading)
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  if (notFound)
    return (
      <View style={styles.centered}>
        <Text>This account no longer exists.</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text style={styles.label}>Currency</Text>
      <TextInput
        style={styles.input}
        value={currency}
        onChangeText={setCurrency}
        autoCapitalize="characters"
      />
      <Text style={styles.label}>Starting balance</Text>
      <TextInput
        style={styles.input}
        value={balance}
        onChangeText={setBalance}
        keyboardType="decimal-pad"
      />
      <Stack.Screen options={{ title: "Edit account" }} />

      <Pressable
        style={[styles.saveBtn, saving && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>Save</Text>
        )}
      </Pressable>
      <Pressable style={styles.deleteBtn} onPress={confirmDelete}>
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#444",
    marginTop: 16,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 28,
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  deleteBtn: { paddingVertical: 14, alignItems: "center", marginTop: 12 },
  deleteText: { color: "#dc2626", fontWeight: "600" },
});
