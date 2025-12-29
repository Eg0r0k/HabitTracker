import { Plus } from "lucide-react";

export function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-tg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
        <Plus className="w-8 h-8 text-tg-hint" />
      </div>
      <h3 className="font-medium mb-1">Нет привычек</h3>
      <p className="text-sm text-tg-hint">
        Нажми кнопку ниже, чтобы добавить первую привычку
      </p>
    </div>
  );
}
