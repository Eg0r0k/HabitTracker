import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { format } from "date-fns";
import type { Habit, HabitLog } from "../types";

interface HabitState {
  habits: Habit[];
  logs: HabitLog[];

  addHabit: (habit: Omit<Habit, "id" | "createdAt">) => void;
  removeHabit: (id: string) => void;
  toggleHabit: (habitId: string, date?: string) => void;
}

const today = () => format(new Date(), "yyyy-MM-dd");

export const useHabitStore = create<HabitState>()(
  persist(
    (set) => ({
      habits: [],
      logs: [],

      addHabit: (habitData) => {
        const newHabit: Habit = {
          ...habitData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          habits: [...state.habits, newHabit],
        }));
      },

      removeHabit: (id) => {
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
          logs: state.logs.filter((l) => l.habitId !== id),
        }));
      },

      toggleHabit: (habitId, date = today()) => {
        set((state) => {
          const existingLog = state.logs.find(
            (l) => l.habitId === habitId && l.date === date
          );

          if (existingLog) {
            return {
              logs: state.logs.map((l) =>
                l.habitId === habitId && l.date === date
                  ? { ...l, completed: !l.completed }
                  : l
              ),
            };
          } else {
            return {
              logs: [...state.logs, { habitId, date, completed: true }],
            };
          }
        });
      },
    }),
    {
      name: "habit-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Хелпер функции (НЕ селекторы)
export const helpers = {
  getHabitsForToday: (habits: Habit[]): Habit[] => {
    const dayOfWeek = new Date().getDay();
    return habits.filter((habit) => {
      if (habit.frequency === "daily") return true;
      if (habit.frequency === "weekly" && habit.weekDays) {
        return habit.weekDays.includes(dayOfWeek);
      }
      return true;
    });
  },

  isCompletedToday: (logs: HabitLog[], habitId: string): boolean => {
    const log = logs.find((l) => l.habitId === habitId && l.date === today());
    return log?.completed ?? false;
  },

  getStreak: (logs: HabitLog[], habitId: string): number => {
    const habitLogs = logs
      .filter((l) => l.habitId === habitId && l.completed)
      .map((l) => l.date)
      .sort()
      .reverse();

    if (habitLogs.length === 0) return 0;

    let streak = 0;
    const checkDate = new Date();

    if (!habitLogs.includes(today())) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (habitLogs.includes(format(checkDate, "yyyy-MM-dd"))) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return streak;
  },
};
