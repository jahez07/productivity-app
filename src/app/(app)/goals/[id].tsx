import { useGoalTodos } from "@/hooks/use-goal-todos";
import { getGoal } from "@/lib/goals";
import { Goal } from "@/types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function GoalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loadingGoal, setLoadingGoal] = useState(true);

  const {
    todos,
    loading: loadingTodos,
    total,
    done,
    percent,
  } = useGoalTodos(id);

  useEffect(() => {
    (async () => {
      setGoal(await getGoal(id));
      setLoadingGoal(false);
    })();
  }, [id]);

  if (loadingGoal)
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  if (!goal)
    return (
      <View style={styles.centered}>
        <Text>This goal no longer exists.</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{goal.title}</Text>
      {goal.description ? (
        <Text style={styles.description}>{goal.description}</Text>
      ) : null}
      {goal.targetDate ? (
        <Text style={styles.meta}>
          Target: {new Date(goal.targetDate).toLocaleDateString()}
        </Text>
      ) : null}

      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>Progress</Text>
        <Text style={styles.progressCount}>
          {done} / {total} done · {percent}%
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%` }]} />
      </View>

      {loadingTodos ? (
        <ActivityIndicator style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          style={{ marginTop: 16 }}
          data={todos}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No todos assigned to this goal yet. Open a todo and pick this
              goal.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.todoRow}>
              <Text style={styles.check}>{item.isDone ? "✓" : "○"}</Text>
              <Text style={[styles.todoTitle, item.isDone && styles.todoDone]}>
                {item.title}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700" },
  description: { fontSize: 15, color: "#555", marginTop: 6 },
  meta: { fontSize: 13, color: "#888", marginTop: 6 },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  progressLabel: { fontSize: 14, fontWeight: "600", color: "#444" },
  progressCount: { fontSize: 13, color: "#666" },
  track: {
    height: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
    marginTop: 8,
    overflow: "hidden",
  },
  fill: { height: "100%", backgroundColor: "#2563eb" },
  empty: { textAlign: "center", color: "#999", marginTop: 32 },
  todoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  check: { fontSize: 16, width: 18, color: "#2563eb" },
  todoTitle: { fontSize: 16, flex: 1 },
  todoDone: { textDecorationLine: "line-through", color: "#aaa" },
});
