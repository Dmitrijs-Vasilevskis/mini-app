interface ProgressCircleProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function CountdownProgressCircle({
  percentage,
  size = 96,
  strokeWidth = 3,
  label,
}: ProgressCircleProps) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        className="absolute inset-0 h-full w-full -rotate-90"
        viewBox="0 0 36 36"
      >
        <path
          className="text-zinc-800"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className="text-red-500 transition-all duration-300 ease-out"
          strokeDasharray={`${percentage}, 100`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke="currentColor"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      {label && (
        <div className="text-3xl font-black text-white font-mono z-10">
          {label}
        </div>
      )}
    </div>
  );
}
