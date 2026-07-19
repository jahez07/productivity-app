export type Priority = "high" | "medium" | "low";

export type Todo = {
  id: string; // Firestore document ID (NOT stored inside the doc)
  userId: string; // which signed-in user owns this todo
  title: string;
  isDone: boolean;
  notes: string | null; // optional longer description
  dueDate: number | null; // epoch millis, or null if no due date
  priority: Priority | null; // or null if not set
  goalId: string | null; // link to a Goal - always null for now
  createdAt: number; // epoch millis
  updatedAt: number; // epoch millis
};

// The shape we use when CREATING a todo: everything except the id,
// because Firestore generates the id for us.
export type TodoInput = Omit<Todo, "id">;
