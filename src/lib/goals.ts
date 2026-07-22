import { db } from "@/lib/firebase";
import { Goal, GoalInput } from "@/types";
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

const goalsRef = collection(db, "goals");

export async function addGoal(userId: string, title: string) {
  const now = Date.now();
  const newGoal: GoalInput = {
    userId,
    title: title.trim(),
    description: null,
    targetDate: null,
    createdAt: now,
    updatedAt: now,
  };
  await addDoc(goalsRef, newGoal);
}

export function watchGoals(
  userId: string,
  onChange: (goals: Goal[]) => void,
  onError: (e: Error) => void,
) {
  const q = query(
    goalsRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  );
  return onSnapshot(
    q,
    (snapshot) =>
      onChange(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Goal)),
    onError,
  );
}

export async function getGoal(id: string): Promise<Goal | null> {
  const snap = await getDoc(doc(db, "goals", id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Goal) : null;
}

export async function updateGoal(
  id: string,
  fields: Partial<Pick<Goal, "title" | "description" | "targetDate">>,
) {
  await updateDoc(doc(db, "goals", id), { ...fields, updatedAt: Date.now() });
}

export async function deleteGoals(id: string) {
  await deleteDoc(doc(db, "goals", id));
}
