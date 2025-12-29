// src/pages/Home.tsx
import { useMemo } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useHabitStore, helpers } from "../stores/useHabitStore";
import { ProgressBar } from "../components/ProgressBar";
import { EmptyState } from "../components/EmptyState";
import { HabitCard } from "../components/HabitCard";

export default function Home() {
  const habits = useHabitStore((s) => s.habits);
  const logs = useHabitStore((s) => s.logs);
  const todayHabits = useMemo(
    () => helpers.getHabitsForToday(habits),
    [habits]
  );

  const progress = useMemo(() => {
    const completed = todayHabits.filter((h) =>
      helpers.isCompletedToday(logs, h.id)
    ).length;
    return { completed, total: todayHabits.length };
  }, [todayHabits, logs]);

  const todayFormatted = format(new Date(), "d MMMM, EEEE", { locale: ru });

  return (
    <div className="p-4 pb-24">
      <div className="mb-6">
        <p className="text-tg-hint text-sm">{todayFormatted}</p>
        <h1 className="text-2xl font-bold mt-1">Привет! 👋</h1>
      </div>

      {todayHabits.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-tg-hint">Прогресс за день</span>
            <span className="text-sm font-medium">
              {progress.completed}/{progress.total}
            </span>
          </div>
          <ProgressBar value={progress.completed} max={progress.total} />
        </div>
      )}

      {todayHabits.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {todayHabits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} />
          ))}
        </div>
      )}
    </div>
  );
}
