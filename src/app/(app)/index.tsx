import { useTodos } from "@/hooks/use-todos";
import { useAuth } from "@/lib/auth-context";
import { auth } from "@/lib/firebase";
import { addTodo } from "@/lib/todos";
import { signOut } from "firebase/auth";
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

export default function TodosScreen() {
  const { user } = useAuth();
  const { todos, loading, error } = useTodos();
  const [title, setTitle] = useState("");
  const [adding, setAdding] = useState(false);

  async function handleAdd() {
    const trimmed = title.trim();
    if (!trimmed || !user) return;
    setAdding(true);
    try {
      await addTodo(user.uid, trimmed);
      setTitle(""); // just clear the box the listener adds it to the list for us
    } catch (e) {
      console.error(e);
    } finally {
      setAdding(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.email}>{user?.email}</Text>
        <Pressable onPress={() => signOut(auth)}>
          <Text style={styles.signOut}>Sign out</Text>
        </Pressable>
      </View>

      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          placeholder="Add a todo…"
          value={title}
          onChangeText={setTitle}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
        />
        <Pressable style={styles.addBtn} onPress={handleAdd} disabled={adding}>
          <Text style={styles.addBtnText}>Add</Text>
        </Pressable>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {loading ? (
        <ActivityIndicator style={{ marginTop: 32 }} />
      ) : (
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.empty}>No todos yet. Add one above.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.todoRow}>
              <Text style={styles.todoTitle}>{item.title}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  email: { fontSize: 13, color: "#666" },
  signOut: { color: "#dc2626", fontWeight: "600" },
  addRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  input: {
    flex: 1,
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
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  addBtnText: { color: "#fff", fontWeight: "600" },
  todoRow: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  todoTitle: { fontSize: 16 },
  empty: { textAlign: "center", color: "#999", marginTop: 32 },
  errorText: { color: "#dc2626", fontSize: 13, marginBottom: 8 },
});
