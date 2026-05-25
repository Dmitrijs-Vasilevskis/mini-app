import { create } from "zustand";

export type FloatingEffect = {
  id: string;
  text: string;
  color?: string;
  emphasis?: "normal" | "special";
};

type EffectsStore = {
  effects: FloatingEffect[];
  addEffect: (effect: Omit<FloatingEffect, "id">) => void;
  removeEffect: (id: string) => void;
};

export const useEffectStore = create<EffectsStore>((set) => ({
  effects: [],
  addEffect: (effect) => {
    const id = crypto.randomUUID();

    set((state) => ({
      effects: [
        ...state.effects,
        {
          id,
          ...effect,
        },
      ],
    }));

    setTimeout(() => {
      set((state) => ({
        effects: state.effects.filter((e) => e.id != id),
      }));
    }, 1500);
  },
  removeEffect: (id) => {
    set((state) => ({
      effects: state.effects.filter((e) => e.id != id),
    }));
  },
}));
