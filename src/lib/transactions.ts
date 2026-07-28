import { db } from "@/lib/firebase";
import { ExpenseCategory, Transaction, TransactionType } from "@/types";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
    where,
} from "firebase/firestore";

const transactionRef = collection(db, "transactions");

export async function addTransaction(
  userId: string,
  accountId: string,
  type: TransactionType,
  amount: number,
  date: number,
  category: ExpenseCategory | null,
  note: string | null,
) {
  const now = Date.now();
  await addDoc(transactionRef, {
    userId,
    accountId,
    type,
    amount,
    category,
    date,
    note,
    createdAt: now,
    updatedAt: now,
  });
}

// All transactions for ONE account - remember the rule lesson: filter by userId.
export function watchAccountTransactions(
  userId: string,
  accountId: string,
  onChange: (txns: Transaction[]) => void,
  onError: (e: Error) => void,
) {
  const q = query(
    transactionRef,
    where("userId", "==", userId),
    where("accountId", "==", accountId),
    orderBy("data", "desc"),
  );
  return onSnapshot(
    q,
    (snap) =>
      onChange(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Transaction),
      ),
    onError,
  );
}

export async function getTransaction(id: string): Promise<Transaction | null> {
  const snap = await getDoc(doc(db, "transactions", id));
  return snap.exists()
    ? ({ id: snap.id, ...snap.data() } as Transaction)
    : null;
}

export async function updateTransaction(
  id: string,
  fields: Partial<
    Pick<Transaction, "type" | "amount" | "category" | "date" | "note">
  >,
) {
  await updateDoc(doc(db, "transactions", id), {
    ...fields,
    updatedAt: Date.now(),
  });
}

export async function deleteTransaction(id: string) {
  await deleteDoc(doc(db, "transactions", id));
}
