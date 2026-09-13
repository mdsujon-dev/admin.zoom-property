import { motion } from "framer-motion";
import React from "react";

import { riseIn } from "./dashboardMotion";
import brand from "../../../theme/brand";

/**
 * The two shells every dashboard on this system is built from.
 *
 * They started life inside the agent's dashboard and moved here the moment
 * the office's dashboard wanted the same look: two copies of a card is two
 * places to change a colour, and the copy nobody remembers is the one that
 * drifts. Both take a single `accent` and derive the wash, the border, the
 * label and the chip's glow from it — one colour per card, not four decisions.
 *
 * This file exports components only. `riseIn` lives in `dashboardMotion.ts`
 * because mixing components and plain values in one module costs Vite's fast
 * refresh — it falls back to reloading the page on every edit.
 */

/** A headline number in its own colour, with an optional caption under it. */
export const Metric = ({
  label,
  value,
  hint,
  icon: Icon,
  accent,
  loading,
  onClick,
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  icon: React.ElementType;
  accent: string;
  loading?: boolean;
  onClick?: () => void;
}) => {
  if (loading) {
    return (
      <div className="h-[120px] animate-pulse rounded-xl bg-gray-200" />
    );
  }

  return (
    <motion.div
      onClick={onClick}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-xl px-4 py-3 text-white shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg ${
        onClick ? "cursor-pointer" : ""
      }`}
      style={{
        background: `linear-gradient(135deg, ${accent}, ${accent}d9)`,
      }}
    >
      {/* Decorative Wave Background */}
      <svg
        className="absolute bottom-0 right-0 h-full w-full opacity-20 pointer-events-none"
        viewBox="0 0 400 150"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,150 C100,100 200,200 300,50 C350,0 400,100 400,150 Z"
          fill="currentColor"
        />
        <path
          d="M0,150 C150,50 250,150 400,0 L400,150 Z"
          fill="currentColor"
          opacity="0.5"
        />
      </svg>
      
      <div className="relative z-10 flex justify-between">
        <div className="flex flex-col">
          <span className="text-[12px] font-medium opacity-90 tracking-wide uppercase">
            {label}
          </span>
          <span className="mt-0.5 text-2xl font-bold tracking-tight">
            {value}
          </span>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
          <Icon className="h-4 w-4 text-white" />
        </div>
      </div>
      
      <div className="relative z-10 mt-2 flex items-end justify-between">
        <div className="text-xs font-medium opacity-80">
          {hint}
        </div>
        {/* Tiny mock bar chart to mimic the reference image */}
        <div className="flex items-end gap-[3px] opacity-70 group-hover:opacity-100 transition-opacity">
          <div className="w-[4px] h-[12px] bg-white rounded-t-sm" />
          <div className="w-[4px] h-[20px] bg-white rounded-t-sm" />
          <div className="w-[4px] h-[16px] bg-white rounded-t-sm" />
          <div className="w-[4px] h-[24px] bg-white rounded-t-sm" />
          <div className="w-[4px] h-[10px] bg-white rounded-t-sm" />
        </div>
      </div>
    </motion.div>
  );
};

/**
 * A panel with a coloured header and a white body.
 *
 * The tint lives in the header only: it makes a panel identifiable from across
 * the page, while everything that has to be *read* — names, numbers, bars —
 * sits on white with nothing competing against it.
 */
export const Section = ({
  title,
  subtitle,
  icon: Icon,
  accent = brand.primary,
  action,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  accent?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) => (
  <motion.section
    variants={riseIn}
    className={`overflow-hidden rounded-xl border border-secondary-100 bg-white transition-all duration-300 hover:border-secondary-200 hover:shadow-sm ${
      className || ""
    }`}
  >
    <header
      className="flex items-center gap-3 border-b px-4 py-3"
      style={{
        background: `linear-gradient(90deg, ${accent}1f 0%, ${accent}0a 55%, transparent 100%)`,
        borderBottomColor: `${accent}2e`,
      }}
    >
      <span
        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white shadow-sm"
        style={{ background: accent, boxShadow: `0 4px 12px -4px ${accent}80` }}
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <div className="min-w-0">
        <h3 className="truncate text-[15px] font-semibold leading-tight text-secondary-900">
          {title}
        </h3>
        {subtitle && (
          <p className="truncate text-xs text-secondary-400">{subtitle}</p>
        )}
      </div>
      {action && <div className="ml-auto shrink-0">{action}</div>}
    </header>
    <div className={bodyClassName ?? "p-4"}>{children}</div>
  </motion.section>
);

/** The skeleton a `Section` shows while its data is in flight. */
export const SectionSkeleton = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} animate-pulse rounded-xl border border-secondary-100 bg-white`}
  />
);
