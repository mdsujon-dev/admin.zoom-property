import dayjs from "dayjs";
import {
  Archive,
  FilePlus2,
  History,
  PencilLine,
  Send,
  ToggleLeft,
  Users,
} from "lucide-react";

import { useGetRecordHistoryQuery } from "../../redux/features/history/historyApi";
import { EmptyNote, Panel } from "../Details/DetailKit";

const ACTION = {
  created: { label: "Created", icon: FilePlus2, tone: "text-primary bg-primary-50" },
  updated: { label: "Edited profile", icon: PencilLine, tone: "text-blue-600 bg-blue-50" },
  archived: { label: "Archived", icon: Archive, tone: "text-red-600 bg-red-50" },
  restored: { label: "Restored", icon: History, tone: "text-amber-600 bg-amber-50" },
  published: { label: "Published", icon: Send, tone: "text-emerald-600 bg-emerald-50" },
  "status-changed": { label: "Status changed", icon: ToggleLeft, tone: "text-indigo-600 bg-indigo-50" },
  assigned: { label: "Assigned", icon: Users, tone: "text-teal-600 bg-teal-50" },
} as const;

/** camelCase field names are how the database spells it, not how people read. */
const label = (field: string) =>
  field
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();

/** Dates come back as ISO strings; everything else prints as it is. */
const show = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "empty";
  if (typeof value === "boolean") return value ? "yes" : "no";
  if (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)
  ) {
    return dayjs(value).format("DD MMM YYYY");
  }
  if (Array.isArray(value)) {
    if (!value.length) return "empty";
    return value
      .map((v) => {
        if (typeof v === "object" && v !== null) {
          if ("day" in v && "startTime" in v) {
            return `${v.day} ${v.startTime}-${(v as any).endTime || ""}`;
          }
          return JSON.stringify(v);
        }
        return String(v);
      })
      .join(", ");
  }
  if (typeof value === "object" && value !== null) {
    if ("day" in value && "startTime" in value) {
      return `${value.day} ${value.startTime}-${(value as any).endTime || ""}`;
    }
    return "updated";
  }
  return String(value);
};

const renderMeta = (action: string, meta: any) => {
  if (!meta) return null;
  if (action === "enrolled") {
    return <p className="text-sm text-secondary-600 mt-1">Joined <strong>{meta.batchName}</strong> ({meta.courseName})</p>;
  }
  if (action === "payment") {
    return <p className="text-sm text-secondary-600 mt-1">{meta.type}: <strong>৳{meta.amount}</strong></p>;
  }
  if (action === "exam") {
    return <p className="text-sm text-secondary-600 mt-1">Scored <strong>{meta.marks}</strong> out of {meta.totalMarks} in <strong>{meta.examTitle}</strong></p>;
  }
  if (action === "assigned") {
    return <p className="text-sm text-secondary-600 mt-1">Assigned to <strong>{meta.name}</strong></p>;
  }
  return <p className="text-sm text-secondary-600 mt-1">{JSON.stringify(meta)}</p>;
};

const RecordHistory = ({ entity, id }: { entity: string; id: string }) => {
  const { data: entries = [], isFetching } = useGetRecordHistoryQuery(
    { entity, id },
    { skip: !id }
  );

  if (isFetching) {
    return (
      <div className="h-64 animate-pulse rounded-xl border border-secondary-100 bg-white" />
    );
  }

  return (
    <Panel
      title="Activity log"
      icon={History}
      subtitle={`${entries.length} event${entries.length === 1 ? "" : "s"} recorded`}
    >
      {entries.length === 0 ? (
        <EmptyNote
          icon={History}
          title="Nothing recorded yet"
          hint="Activities and profile edits will appear here."
        />
      ) : (
        <ol className="relative space-y-4 pl-6">
          <span className="absolute left-[7px] top-1 h-[calc(100%-0.5rem)] w-px bg-secondary-100" />

          {entries.map((e: any) => {
            const meta =
              ACTION[e.action as keyof typeof ACTION] ?? ACTION.updated;
            const Icon = meta.icon;
            return (
              <li key={e._id} className="relative">
                <span
                  className={`absolute -left-6 top-0.5 grid h-4 w-4 place-items-center rounded-full ring-4 ring-white ${meta.tone}`}
                >
                  <Icon className="h-2.5 w-2.5" />
                </span>

                <div className="rounded-xl border border-secondary-100 bg-white p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-secondary-800">
                      {meta.label}
                    </span>
                    <span className="text-xs text-secondary-400">
                      {dayjs(e.at).format("DD MMM YYYY, h:mm A")}
                    </span>
                    <span className="ml-auto text-xs text-secondary-500">
                      {e.byName ? `by ${e.byName}` : "by the system"}
                    </span>
                  </div>

                  {e.meta && renderMeta(e.action, e.meta)}

                  {e.changes?.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {e.changes.map((c: any, i: number) => (
                        <li
                          key={`${c.field}-${i}`}
                          className="flex flex-wrap items-baseline gap-1.5 text-xs"
                        >
                          <span className="font-medium text-secondary-600">
                            {label(c.field)}
                          </span>
                          <span className="rounded bg-secondary-50 px-1.5 py-0.5 text-secondary-400 line-through">
                            {show(c.from)}
                          </span>
                          <span className="text-secondary-300">→</span>
                          <span className="rounded bg-primary-50 px-1.5 py-0.5 font-medium text-primary">
                            {show(c.to)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </Panel>
  );
};

export default RecordHistory;
