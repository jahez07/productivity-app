import { watchAccounts } from "@/lib/accounts";
import { useAuth } from "@/lib/auth-context";
import { Account } from "@/types";
import { useEffect, useState } from "react";

export function useAccounts() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const unsubscribe = watchAccounts(
      user.uid,
      (list) => {
        setAccounts(list);
        setLoading(false);
      },
      (e) => {
        console.error("accounts listener:", e);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [user]);

  return { accounts, loading };
}
