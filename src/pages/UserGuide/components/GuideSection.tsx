import { AlertTriangle, Lightbulb, Lock, MapPin } from "lucide-react";
import React from "react";

import { GROUP_ACCENT, type GuideSectionData } from "./guideData";

/**
 * One topic.
 *
 * Half of every section used to be a gradient panel with a large icon in it,
 * which filled the page and told the reader nothing. What a reference document
 * owes its reader is where the screen is, what it is for, what to do in order,
 * and what will catch them out — so that is what is on the card.
 */
const GuideSection: React.FC<{ section: GuideSectionData }> = ({ section }) => {
  const Icon = section.icon;
  const accent = GROUP_ACCENT[section.group];

  return (
    <section
      id={section.id}
      // Cleared for the sticky page header, or jumping to a section lands with
      // its title underneath it.
      className="scroll-mt-24 overflow-hidden rounded-xl border border-secondary-100 bg-white"
    >
      <header
        className="flex items-start gap-3 border-b px-5 py-3.5"
        style={{
          background: `linear-gradient(90deg, ${accent}14 0%, ${accent}06 60%, transparent 100%)`,
          borderBottomColor: `${accent}26`,
        }}
      >
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white"
          style={{ background: accent }}
        >
          <Icon className="h-[18px] w-[18px]" />
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-semibold leading-tight text-secondary-900">
            {section.title}
          </h3>

          {/* Where it is and what it needs — the two things somebody reading on
              a phone has to know before they can start. */}
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            {section.where && (
              <span className="inline-flex items-center gap-1 text-[11px] text-secondary-500">
                <MapPin className="h-3 w-3 shrink-0" />
                {section.where}
              </span>
            )}
            {section.module && (
              <span className="inline-flex items-center gap-1 text-[11px] text-secondary-400">
                <Lock className="h-3 w-3 shrink-0" />
                Needs {section.module} permission
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="px-5 py-4">
        <p className="text-[13.5px] leading-relaxed text-secondary-600">
          {section.intro}
        </p>

        <ol className="mt-4 space-y-2.5">
          {section.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span
                className="mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-bold"
                style={{ background: `${accent}1f`, color: accent }}
              >
                {i + 1}
              </span>
              <span className="text-[13.5px] leading-relaxed text-secondary-700">
                {step}
              </span>
            </li>
          ))}
        </ol>

        {/* A note is a thing that goes wrong, so it is drawn to be noticed and
            it comes first. A tip only makes the job nicer. */}
        {section.note && (
          <div className="mt-4 flex gap-2.5 rounded-lg border border-amber-200 bg-amber-50/60 px-3.5 py-2.5">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <p className="text-[13px] leading-relaxed text-secondary-700">
              <span className="font-semibold text-amber-700">Watch out: </span>
              {section.note}
            </p>
          </div>
        )}

        {section.tip && (
          <div className="mt-2.5 flex gap-2.5 rounded-lg border border-secondary-100 bg-secondary-50/70 px-3.5 py-2.5">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-secondary-400" />
            <p className="text-[13px] leading-relaxed text-secondary-600">
              <span className="font-semibold text-secondary-700">Tip: </span>
              {section.tip}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default GuideSection;
