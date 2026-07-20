import { db } from "@/lib/firebase";
import { Todo, TodoInput } from "@/types";
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

const todosRef = collection(db, "todos");

// CREATE a todo with sensible defaults
export async function addTodo(userId: string, title: string) {
  const now = Date.now();
  const newTodo: TodoInput = {
    userId,
    title: title.trim(),
    isDone: false,
    notes: null,
    dueDate: null,
    priority: null,
    goalId: null,
    createdAt: now,
    updatedAt: now,
  };
  await addDoc(todosRef, newTodo);
}

// LISTEN to this user's todos in real time. Returns an unsubscrible function
export function watchTodos(
  userId: string,
  onChange: (todos: Todo[]) => void,
  onError: (e: Error) => void,
) {
  const q = query(
    todosRef,
    where("userId", "==", userId), // only MY todos
    orderBy("createdAt", "desc"), // newest first
  );

  return onSnapshot(
    q,
    (snapshot) => {
      // attach each doc's id (remember: id is the key, not a stored field)
      const todos = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as Todo,
      );
      onChange(todos);
    },
    onError,
  );
}

export async function toggleTodo(id: string, isDone: boolean) {
  await updateDoc(doc(db, "todos", id), { isDone, updatedAt: Date.now() });
}

export async function deleteTodo(id: string) {
  await deleteDoc(doc(db, "todos", id));
}

export async function getTodo(id: string): Promise<Todo | null> {
  const snap = await getDoc(doc(db, "todos", id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Todo) : null;
}

export async function updateTodo(
  id: string,
  fields: Partial<
    Pick<Todo, "title" | "notes" | "dueDate" | "priority" | "goalId" | "isDone">
  >,
) {
  await updateDoc(doc(db, "todos", id), { ...fields, updatedAt: Date.now() });
}