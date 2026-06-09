export interface ButtonPosition {
  left: string;
  bottom: string;
}

export const generateRandomButtonPosition = (): ButtonPosition => {
  const left = 10 + Math.random() * 70;
  const bottom = 5 + Math.random() * 45;

  return {
    left: `${left}%`,
    bottom: `${bottom}%`,
  };
};
