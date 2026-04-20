export const SHAPES = {
  triangle: "M 50 10 L 90 85 L 10 85 Z",
  chevron:
    "M 10 15 L 50 10 L 90 15 L 90 85 L 50 90 L 10 85 Z",
  hexagon:
    "M 50 5 L 90 27 L 90 73 L 50 95 L 10 73 L 10 27 Z",
} as const;

export type TeamShape = keyof typeof SHAPES;
