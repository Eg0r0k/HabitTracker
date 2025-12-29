interface Props {
  value: number;
  max: number;
}

export function ProgressBar({ value, max }: Props) {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="h-2 bg-tg-secondary rounded-full overflow-hidden">
      <div
        className="h-full bg-tg-button rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
