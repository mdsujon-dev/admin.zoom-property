import { FileText, LayoutGrid, PenSquare, Video } from "lucide-react";
import React from "react";
import { DashboardStatKey } from "../../../redux/features/dashboard/dashboardApi";

// Brand palette used across every chart so the dashboard reads as one system.
export const dashPalette = {
  lightest: "#eef3f8",
  lighter: "#dae6f2",
  light: "#8db0d1",
  mid: "#2867a0",
  bold: "#133050",
  deep: "#133050",
  darker: "#0f172a",
};

// Two-series accent colors (Leads vs Leads) — teal + indigo read clearly
// against each other and stay on-brand.
export const SERIES = {
  leads: "#133050", // teal
  quotations: "#6366f1", // indigo
};

// Categorical palette for the donut / breakdown charts.
export const DONUT_COLORS = [
  "#133050",
  "#2867a0",
  "#8db0d1",
  "#6366f1",
  "#0ea5e9",
  "#f59e0b",
  "#1a4570",
];

export const STAT_ICONS: Record<
  DashboardStatKey,
  React.ComponentType<{ className?: string }>
> = {
  blogs: FileText,
  projects: Video,
  caseStudies: PenSquare,
  categories: LayoutGrid,
};
