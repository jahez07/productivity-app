import { useAccounts } from "@/hooks/use-accounts";
import { addAccount } from "@/lib/accounts";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    StyleSheet
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
  return ()
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
