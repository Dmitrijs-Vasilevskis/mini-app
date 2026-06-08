export interface ButtonPosition {
  left: string;
  bottom: string;
}

export const generateRandomButtonPosition = (): ButtonPosition => {
  const left = 5 + Math.random() * 90;
  const bottom = 5 + Math.random() * 45;

  return {
    left: `${left}%`,
    bottom: `${bottom}%`,
  };
};
