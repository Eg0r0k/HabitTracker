// src/pages/AddHabit.tsx
import { useState } from "react";
import { useHabitStore } from "../stores/useHabitStore";
import { useTelegram } from "../hooks/useTelegram";

const EMOJIS = ["💪", "📚", "🏃", "💧", "🧘", "💊", "🥗", "😴", "✍️", "🎯"];

interface Props {
  onSuccess: () => void;
}

export function AddHabit({ onSuccess }: Props) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("💪");
  const addHabit = useHabitStore((s) => s.addHabit);
  const { vibrate } = useTelegram();

  const handleSubmit = () => {
    if (!name.trim()) return;

    addHabit({
      name: name.trim(),
      emoji,
      frequency: "daily",
    });

    vibrate("success");
    onSuccess();
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-6">Новая привычка</h1>

      <div className="mb-6">
        <label className="text-sm text-tg-hint block mb-2">Иконка</label>
        <div className="flex flex-wrap gap-2">
          {EMOJIS.map((e) => (
            <button
              key={e}
              onClick={() => setEmoji(e)}
              className={`
                w-12 h-12 text-2xl rounded-xl
                ${emoji === e ? "bg-tg-button" : "bg-tg-secondary"}
              `}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="text-sm text-tg-hint block mb-2">Название</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Например: Пить воду"
          className="w-full p-3 rounded-xl bg-tg-secondary outline-none"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!name.trim()}
        className="w-full p-4 rounded-xl bg-tg-button text-tg-button-text font-medium disabled:opacity-50"
      >
        Создать привычку
      </button>
    </div>
  );
}
