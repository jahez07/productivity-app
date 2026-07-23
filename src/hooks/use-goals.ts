import { useAuth } from "@/lib/auth-context";
import { watchGoals } from "@/lib/goals";
import { Goal } from "@/types";
import { useEffect, useState } from "react";

export function useGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const unsubscribe = watchGoals(
      user.uid,
      (list) => {
        setGoals(list);
        setLoading(false);
      },
      (e) => {
        setError(e.message);
        setLoading(false);
        console.error("goals listener:", e);
      },
    );
    return unsubscribe;
  }, [user]);

  return { goals, loading, error };
}
