import { getTodo, updateTodo } from "@/lib/todos";
import { Priority } from "@/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const PRIORITIES: { label: string; value: Priority | null }[] = [
  { label: "None", value: null },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

export default function TodoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState<Priority | null>(null);

  useEffect(() => {
    (async () => {
      const todo = await getTodo(id);
      if (!todo) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setTitle(todo.title);
      setNotes(todo.notes ?? "");
      setPriority(todo.priority);
      setLoading(false);
    })();
  }, [id]);

  async function handleSave() {
    if (!title.trim()) return;
    setSaving(true);
    try {
      await updateTodo(id, {
        title: title.trim(),
        notes: notes.trim() ? notes.trim() : null,
        priority,
      });
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
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
        <Text>This todo no longer exists.</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, styles.notes]}
        value={notes}
        onChangeText={setNotes}
        placeholder="Optional details…"
        multiline
      />

      <Text style={styles.label}>Priority</Text>
      <View style={styles.priorityRow}>
        {PRIORITIES.map((p) => (
          <Pressable
            key={p.label}
            style={[styles.chip, priority === p.value && styles.chipActive]}
            onPress={() => setPriority(p.value)}
          >
            <Text
              style={[
                styles.chipText,
                priority === p.value && styles.chipTextActive,
              ]}
            >
              {p.label}
            </Text>
          </Pressable>
        ))}
      </View>

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
  notes: { minHeight: 80, textAlignVertical: "top" },
  priorityRow: { flexDirection: "row", gap: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  chipActive: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  chipText: { color: "#444", fontWeight: "500" },
  chipTextActive: { color: "#fff" },
  saveBtn: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 28,
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
