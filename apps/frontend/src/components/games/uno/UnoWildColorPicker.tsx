import type { Color } from "@uno/shared";

type Props = {
  onSelect: (color: Color) => void;
};

interface ColorStyle {
  color: Color;
  style: string;
}

const colors: ColorStyle[] = [
  { color: "red", style: "rounded-ss-full wild-color-red" },
  { color: "blue", style: "rounded-se-full wild-color-blue" },
  { color: "yellow", style: "rounded-es-full wild-color-yellow" },
  { color: "green", style: "rounded-ee-full wild-color-green" },
];

export function UnoWildColorPicker({ onSelect }: Props) {
  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className=" bg-gray-900 p-6 rounded-2xl flex flex-col gap-4">
        <h2 className="text-white text-xl font-bold text-center">
          Choose Color
        </h2>
        <div className="grid grid-cols-2 gap-1 border-white border-4 bg-white rounded-full">
          {colors.map((c: ColorStyle) => (
            <button
              key={c.color}
              onClick={() => onSelect(c.color)}
              className={`
                w-24 h-24 rounded-xl capitalize text-white font-bold
                flex items-center justify-center relative shadow-xl
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
