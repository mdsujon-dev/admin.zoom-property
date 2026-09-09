/**
 * The vocabulary of a project, in one place.
 *
 * The table and the form both name the build stages, and two copies is how a
 * filter ends up offering a stage the form cannot produce.
 */
export const STAGES = [
  { value: "Planning", label: "Planning" },
  { value: "Processing", label: "Processing" },
  { value: "Completed", label: "Completed" },
];

/** Antd Tag colours, so a stage reads the same on every screen. */
export const STAGE_COLOUR: Record<string, string> = {
  Planning: "default",
  Processing: "blue",
  Completed: "green",
};
