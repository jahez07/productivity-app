import { Todo } from "@/types";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onOpen: (todo: Todo) => void;
};

export function TodoItem({ todo, onToggle, onDelete, onOpen }: Props) {
  function confirmDelete() {
    Alert.alert("Delete todo?", `"${todo.title}"`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => onDelete(todo) },
    ]);
  }

  return (
    <View style={styles.row}>
      <Pressable onPress={() => onToggle(todo)} hitSlop={8}>
        <View style={[styles.checkbox, todo.isDone && styles.checkboxDone]}>
          {todo.isDone && <Text style={styles.check}>✓</Text>}
        </View>
      </Pressable>
      <Pressable
        style={styles.titleWrap}
        onPress={() => onOpen(todo)}
        onLongPress={confirmDelete}
      >
        <Text style={[styles.title, todo.isDone && styles.titleDone]}>
          {todo.title}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBlockColor: "#eee",
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#bbb",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxDone: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  check: { color: "#fff", fontSize: 14, fontWeight: "700" },
  title: { flex: 1, fontSize: 16 },
  titleDone: { textDecorationLine: "line-through", color: "#aaa" },
  titleWrap: { flex: 1 },
});
