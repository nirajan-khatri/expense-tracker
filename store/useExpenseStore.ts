import { create } from 'zustand';
import { createMMKV } from 'react-native-mmkv';
import { StateStorage, createJSONStorage, persist } from 'zustand/middleware';

export const storage = createMMKV({
  id: 'expense-tracker-storage',
});

const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    storage.delete(name);
  },
};

export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  note?: string;
}

interface ExpenseState {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  removeExpense: (id: string) => void;
  totalBalance: () => number;
}

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      expenses: [],
      addExpense: (expense) =>
        set((state) => ({
          expenses: [
            ...state.expenses,
            { ...expense, id: Math.random().toString(36).substring(2, 9) },
          ],
        })),
      removeExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),
      totalBalance: () =>
        get().expenses.reduce((sum, e) => sum + e.amount, 0),
    }),
    {
      name: 'expense-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
