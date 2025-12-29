// src/components/HabitCard.tsx
import { useMemo } from "react";
import { useHabitStore, helpers } from "../stores/useHabitStore";
import { useTelegram } from "../hooks/useTelegram";
import type { Habit } from "../types";
import { Check, Flame } from "lucide-react";

interface Props {
  habit: Habit;
}

export function HabitCard({ habit }: Props) {
  const toggleHabit = useHabitStore((s) => s.toggleHabit);
  const logs = useHabitStore((s) => s.logs);

  // ✅ Вычисляем в useMemo
  const completed = useMemo(
    () => helpers.isCompletedToday(logs, habit.id),
    [logs, habit.id]
  );

  const streak = useMemo(
    () => helpers.getStreak(logs, habit.id),
    [logs, habit.id]
  );

  const { vibrate } = useTelegram();

  const handleToggle = () => {
    toggleHabit(habit.id);
    vibrate(completed ? "light" : "success");
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        w-full p-4 rounded-xl flex items-center gap-4 transition-all
        ${completed ? "bg-green-500/20" : "bg-tg-secondary"}
      `}
    >
      <span className="text-2xl">{habit.emoji}</span>

      <div className="flex-1 text-left">
        <p
          className={`font-medium ${
            completed ? "line-through text-tg-hint" : ""
          }`}
        >
          {habit.name}
        </p>
        {streak > 0 && (
          <p className="text-xs text-tg-hint flex items-center gap-1 mt-0.5">
            <Flame className="w-3 h-3 text-orange-500" />
            {streak} {streak === 1 ? "день" : "дней"}
          </p>
        )}
      </div>

      <div
        className={`
          w-7 h-7 rounded-full border-2 flex items-center justify-center
          ${completed ? "bg-green-500 border-green-500" : "border-tg-hint"}
        `}
      >
        {completed && <Check className="w-4 h-4 text-white" />}
      </div>
    </button>
  );
}
