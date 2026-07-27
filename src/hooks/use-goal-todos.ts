import { useAuth } from "@/lib/auth-context";
import { watchTodosForGoal } from "@/lib/todos";
import { Todo } from "@/types";
import { useEffect, useState } from "react";

export function useGoalTodos(goalId: string) {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = watchTodosForGoal(
      user.uid,
      goalId,
      (list) => {
        setTodos(list);
        setLoading(false);
      },
      (e) => {
        console.error("goal todos listener:", e);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [user, goalId]);

  // progress computer live never stored
  const total = todos.length;
  const done = todos.filter((t) => t.isDone).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return { todos, loading, total, done, percent };
}
