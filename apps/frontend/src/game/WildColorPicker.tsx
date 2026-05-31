import type { Color } from "../types/game";

type Props = {
  onSelect: (color: string) => void;
};

const colors = [
  { color: "red", style: "rounded-ss-full" },
  { color: "green", style: "rounded-se-full" },
  { color: "blue", style: "rounded-es-full" },
  { color: "yellow", style: "rounded-ee-full" },
];

export function WildColorPicker({ onSelect }: Props) {
  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className=" bg-gray-900 p-6 rounded-2xl flex flex-col gap-4">
        <h2 className="text-white text-xl font-bold text-center">
          Choose Color
        </h2>
        <div className="grid grid-cols-2 gap-1 border-white border-4 bg-white rounded-full">
          {colors.map((c) => (
            <button
              key={c.color}
              onClick={() => onSelect(c.color as Color)}
              className={`
                w-24 h-24 rounded-xl capitalize text-white font-bold
                flex items-center justify-center relative shadow-xl
                bg-${c.color}-500
                hover:bg-opacity-80
                ${c.style}
                `}
            >
              {c.color}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
