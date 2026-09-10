import { FileText, LayoutGrid, PenSquare, Video } from "lucide-react";
import React from "react";
import { DashboardStatKey } from "../../../redux/features/dashboard/dashboardApi";
import { CHART_SERIES, primary, secondary } from "../../../theme/brand";

// Every chart reads from `theme/brand`, so the dashboard and the rest of the
// panel cannot drift apart — and nothing here is a hex typed by hand.
export const dashPalette = {
  lightest: primary[50],
  lighter: primary[100],
  light: primary[300],
  mid: primary[500],
  bold: primary[800],
  deep: primary[950],
  darker: secondary[900],
};

// Two series, told apart by depth rather than by hue: they are quantities of
// the same kind of thing, and two unrelated colours would imply otherwise.
export const SERIES = {
  leads: primary[800],
  quotations: secondary[800],
};

// Categorical palette for the donut / breakdown charts.
export const DONUT_COLORS = [...CHART_SERIES];

export const STAT_ICONS: Record<
  DashboardStatKey,
  React.ComponentType<{ className?: string }>
> = {
  blogs: FileText,
  projects: Video,
  caseStudies: PenSquare,
  categories: LayoutGrid,
};
