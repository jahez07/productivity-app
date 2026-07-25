import { Goal } from "@/types";
import { Alert, Pressable, StyleSheet, Text } from "react-native";

type Props = {
  goal: Goal;
  onOpen: (goal: Goal) => void;
  onDelete: (goal: Goal) => void;
};

export function GoalItem({ goal, onOpen, onDelete }: Props) {
  function confirmDelete() {
    Alert.alert("Delete goal?", `"${goal.title}"`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => onDelete(goal) },
    ]);
  }

  return (
    <Pressable
      style={styles.row}
      onPress={() => onOpen(goal)}
      onLongPress={confirmDelete}
    >
      <Text style={styles.title}>{goal.title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#eee" },
  title: { fontSize: 16 },
});
