import { Goal } from "@/types";
import { Alert, Pressable, StyleSheet, Text } from "react-native";

type Props = {
  goal: Goal;
  onDelete: (goal: Goal) => void;
};

export function GoalItem({ goal, onDelete }: Props) {
  function confirmDelete() {
    Alert.alert("Delete goal?", `"${goal.title}"`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => onDelete(goal) },
    ]);
  }

  return (
    <Pressable style={styles.row} onLongPress={confirmDelete}>
      <Text style={styles.title}>{goal.title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#eee" },
  title: { fontSize: 16 },
});
