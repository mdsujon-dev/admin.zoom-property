import { Radio } from "antd";
import React from "react";

/**
 * Who a designation is for.
 *
 * Only two are offered. There is a third scope in the data — "client" — and it
 * is deliberately not here: it holds one system row issued with a portal login,
 * not a job title anybody assigns, and the API refuses to create or return it.
 * See `server/src/app/access/access.constant.ts`.
 */
export const DESIGNATION_SCOPE_OPTIONS = [
  { value: "employee", label: "Employee" },
  { value: "agent", label: "Agent" },
] as const;

export type SelectableScope = (typeof DESIGNATION_SCOPE_OPTIONS)[number]["value"];

/** Label for a stored scope. Rows written before scopes existed read as staff. */
export const scopeLabel = (scope?: string): string =>
  scope === "agent" ? "Agent" : "Employee";

/**
 * The scope picker, shared by the create and update dialogs so the two cannot
 * offer different options.
 */
export const ScopeRadio: React.FC<{
  value?: SelectableScope;
  onChange?: (value: SelectableScope) => void;
}> = ({ value, onChange }) => (
  <Radio.Group
    optionType="button"
    buttonStyle="solid"
    value={value}
    onChange={(e) => onChange?.(e.target.value)}
  >
    {DESIGNATION_SCOPE_OPTIONS.map((o) => (
      <Radio.Button key={o.value} value={o.value}>
        {o.label}
      </Radio.Button>
    ))}
  </Radio.Group>
);
