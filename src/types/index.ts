export interface Habit {
  id: string;
  name: string;
  emoji: string;
  createdAt: string;
  frequency: "daily" | "weekly";
  weekDays?: number[];
}

export interface HabitLog {
  habitId: string;
  date: string;
  completed: boolean;
}

export interface HabitWithStats extends Habit {
  isCompletedToday: boolean;
  currentStreak: number;
  longestStreak: number;
}
