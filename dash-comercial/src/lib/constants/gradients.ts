export const GRADIENTS = {
  blue: "linear-gradient(135deg, rgb(14,28,48) 0%, rgb(30,55,90) 50%, rgb(12,22,38) 100%)",
  coral: "linear-gradient(135deg, rgb(40,18,10) 0%, rgb(90,35,20) 45%, rgb(20,10,4) 100%)",
  green: "linear-gradient(135deg, rgb(10,32,20) 0%, rgb(30,75,45) 50%, rgb(8,22,14) 100%)",
  purple: "linear-gradient(135deg, rgb(22,12,40) 0%, rgb(55,30,90) 50%, rgb(14,8,28) 100%)",
} as const;

export type GradientPreset = keyof typeof GRADIENTS;
