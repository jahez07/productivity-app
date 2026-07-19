import { useAuth } from "@/lib/auth-context";
import { watchTodos } from "@/lib/todos";
import { Todo } from "@/types";
import { useEffect, useState } from "react";

export function useTodos() {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const unsubscribe = watchTodos(
      user.uid,
      (list) => {
        setTodos(list);
        setLoading(false);
      },
      (e) => {
        setError(e.message);
        setLoading(false);
        console.error("todos listener:", e);
      },
    );
    return unsubscribe; // stop listening when the user changes or screen unmounts
  }, [user]);

  return { todos, loading, error };
}
