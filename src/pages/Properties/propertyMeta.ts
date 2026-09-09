import type { ColumnsType } from "antd/es/table";

/**
 * The vocabulary of a listing, in one place.
 *
 * The table, the filters and the form all need the same six lists, and three
 * copies of "what counts as a status" is how a filter ends up offering an
 * option the form cannot produce.
 */
export const PURPOSES = [
  { value: "sale", label: "For sale" },
  { value: "rent", label: "To rent" },
];

export const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment" },
  { value: "duplex", label: "Duplex" },
  { value: "house", label: "House" },
  { value: "commercial", label: "Commercial" },
  { value: "land", label: "Land" },
];

export const STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "available", label: "Available" },
  { value: "reserved", label: "Reserved" },
  { value: "sold", label: "Sold" },
  { value: "rented", label: "Rented" },
  { value: "archived", label: "Archived" },
];

/** Antd Tag colours, so a status reads the same on every screen. */
export const STATUS_COLOUR: Record<string, string> = {
  draft: "default",
  available: "green",
  reserved: "gold",
  sold: "blue",
  rented: "cyan",
  archived: "red",
};

export const BADGES = [
  { value: "New", label: "New" },
  { value: "Featured", label: "Featured" },
  { value: "Exclusive", label: "Exclusive" },
  { value: "Verified", label: "Verified" },
  { value: "Price drop", label: "Price drop" },
];

export const FURNISHINGS = [
  { value: "Unfurnished", label: "Unfurnished" },
  { value: "Semi-furnished", label: "Semi-furnished" },
  { value: "Fully furnished", label: "Fully furnished" },
];

export const statusLabel = (value?: string) =>
  STATUSES.find((s) => s.value === value)?.label ?? value ?? "—";

export const typeLabel = (value?: string) =>
  PROPERTY_TYPES.find((t) => t.value === value)?.label ?? value ?? "—";

/** BDT, grouped the way prices are read here. */
export const money = (value?: number) =>
  typeof value === "number" ? value.toLocaleString("en-BD") : "—";

export type PropertyColumns = ColumnsType<any>;
