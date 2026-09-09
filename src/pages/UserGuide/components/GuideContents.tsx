import React from "react";

import {
  GROUP_ACCENT,
  GUIDE_GROUPS,
  type GuideGroup,
  type GuideSectionData,
} from "./guideData";

/**
 * The contents, down the side and staying there.
 *
 * A reference document is read by somebody who came looking for one thing, so
 * the whole list of what is in it has to be visible while they read — the old
 * guide put its jump-links in a grid at the top, which is only useful until you
 * scroll past it, which is immediately.
 */
const GuideContents: React.FC<{
  sections: GuideSectionData[];
  activeId: string | null;
  onJump: (id: string) => void;
}> = ({ sections, activeId, onJump }) => {
  const byGroup = GUIDE_GROUPS.map((group) => ({
    group,
    items: sections.filter((s) => s.group === group),
  })).filter((g) => g.items.length > 0);

  if (byGroup.length === 0) return null;

  return (
    <nav className="space-y-4">
      {byGroup.map(({ group, items }) => (
        <div key={group}>
          <p
            className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide"
            style={{ color: GROUP_ACCENT[group as GuideGroup] }}
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ background: GROUP_ACCENT[group as GuideGroup] }}
            />
            {group}
          </p>
          <ul className="space-y-0.5 border-l border-secondary-100 pl-3">
            {items.map((s) => {
              const active = s.id === activeId;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => onJump(s.id)}
                    className={`-ml-3 w-full border-l-2 py-1 pl-3 pr-1 text-left text-[13px] leading-snug transition-colors ${
                      active
                        ? "border-primary font-semibold text-primary"
                        : "border-transparent text-secondary-500 hover:text-secondary-900"
                    }`}
                  >
                    {s.title}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
};

export default GuideContents;
