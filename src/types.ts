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

export type Goal = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  targetDate: number | null;
  createdAt: number;
  updatedAt: number;
};

export type GoalInput = Omit<Goal, "id">;

export type Account = {
  id: string;
  userId: string;
  name: string;
  currency: string;
  startingBalance: number;
  createdAt: number;
  updatedAt: number;
};

export type ExpenseCategory =
  | "Food & Dining"
  | "Groceries"
  | "Snacks"
  | "Transport"
  | "Entertainment"
  | "Shopping"
  | "Health"
  | "Gifts"
  | "Family";

export type TransactionType = "expense" | "deepest";

export type Transaction = {
  id: string;
  userId: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  category: ExpenseCategory | null;
  date: number;
  note: string | null;
  createdAt: number;
  updateAt: number;
};
