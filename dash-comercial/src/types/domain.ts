import type { GradientPreset } from "@/lib/constants/gradients";

export type TeamShape = "triangle" | "chevron" | "hexagon";

export interface SellerSnapshot {
  id: string;
  name: string;
  initials: string;
  accent_color: string;
  photo_url: string | null;
  totalVendas: number;
  totalEntrada: number;
  calls: number;
  conversion_pct: number;
}

export interface TeamSnapshot {
  id: string;
  name: string;
  banner_url: string | null;
  gradient_preset: GradientPreset;
  shape: TeamShape;
  accent_color: string;
  totalVendas: number;
  totalEntrada: number;
  sellers: SellerSnapshot[];
  isLeader: boolean;
}

export interface ProductSnapshot {
  id: string;
  name: string;
  totalVendas: number;
}

export interface LatestSaleSnapshot {
  id: string;
  closer_id: string;
  closer_name: string;
  closer_initials: string;
  closer_accent: string;
  product_name: string;
  client_name_masked: string;
  sale_date: string;
  created_at: string;
}

export interface GoalSnapshot {
  month: string;
  targetValue: number;
  currentValue: number;
  pct: number;
}

export interface TopSellerSnapshot {
  position: 1 | 2 | 3;
  id: string;
  name: string;
  accent_color: string;
  totalVendas: number;
}

export interface DashboardSnapshot {
  currentMonth: string;
  goal: GoalSnapshot;
  top3: TopSellerSnapshot[];
  teams: TeamSnapshot[];
  products: ProductSnapshot[];
  latestSales: LatestSaleSnapshot[];
}
