import { getTodo, updateTodo } from "@/lib/todos";
import { Priority } from "@/types";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
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
  const [dueDate, setDueDate] = useState<number | null>(null);

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
      setDueDate(todo.dueDate);
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
        dueDate,
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

  function pickDueDate() {
    DateTimePickerAndroid.open({
      value: dueDate ? new Date(dueDate) : new Date(),
      mode: "date",
      // Fires only when the user confirms a date; cancelling does nothing.
      // 'date' is always provided, so no gaurd needed.
      onValueChange: (event, date) => {
        setDueDate(date.getTime()); // epoch millis - matches our Todo type
      },
    });
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

      <Text style={styles.label}>Due Date</Text>
      <View style={styles.dueRow}>
        <Pressable style={styles.dueBtn} onPress={pickDueDate}>
          <Text style={styles.dueText}>
            {dueDate
              ? new Date(dueDate).toLocaleDateString()
              : "Set a due date"}
          </Text>
        </Pressable>
        {dueDate ? (
          <Pressable style={styles.clearBtn} onPress={() => setDueDate(null)}>
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>
        ) : null}
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
  dueRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dueBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dueText: { fontSize: 16, color: "#111" },
  clearBtn: { paddingHorizontal: 8, paddingVertical: 8 },
  clearText: { color: "#dc2626", fontWeight: "600" },
});
