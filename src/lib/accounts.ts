import { db } from "@/lib/firebase";
import { Account } from "@/types";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
    where,
    writeBatch,
} from "firebase/firestore";

const accountsRef = collection(db, "accounts");

export async function addAccount(
  userId: string,
  name: string,
  currency: string,
  startingBalanace: number,
) {
  const now = Date.now();
  await addDoc(accountsRef, {
    userId,
    name: name.trim(),
    currency: currency.trim(),
    startingBalanace,
    createdAt: now,
    updatedAt: now,
  });
}

export function watchAccounts(
  userId: string,
  onChange: (accounts: Account[]) => void,
  onError: (e: Error) => void,
) {
  const q = query(
    accountsRef,
    where("userId", "==", userId),
    orderBy("createdAt", "asc"),
  );
  return onSnapshot(
    q,
    (snap) =>
      onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Account)),
    onError,
  );
}

export async function getAccount(id: string): Promise<Account | null> {
  const snap = await getDoc(doc(db, "accounts", id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Account) : null;
}

export async function updateAccount(
  id: string,
  fields: Partial<Pick<Account, "name" | "currency" | "startingBalance">>,
) {
  await updateDoc(doc(db, "accounts", id), {
    ...fields,
    updatedAt: Date.now(),
  });
}

export async function deleteAccount(id: string) {
  await deleteDoc(doc(db, "accounts", id));
}

export async function deleteAccountWithTransactions(
  userId: string,
  accountId: string,
) {
  const q = query(
    collection(db, "transactions"),
    where("userId", "==", userId),
    where("accountId", "==", accountId),
  );
  const snap = await getDocs(q);

  const batch = writeBatch(db);
  snap.docs.forEach((d) => batch.delete(d.ref));
  batch.delete(doc(db, "accounts", accountId));
  await batch.commit();
  return snap.size;
}
