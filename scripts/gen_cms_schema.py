"""Generates admin/src/pages/CMS/cmsSchema.ts from the frontend dictionaries.

The public site's copy lives in frontend.zoom-property/src/i18n/messages/{en,bn}.json.
The CMS edits the same strings, so the schema is derived from those files rather
than retyped -- a hand-written list would go stale the first time a dictionary
key is added.
"""
import json
import os
import re

FRONTEND = r"C:\project\zoom-property\frontend.zoom-property\src\i18n\messages"
OUT = r"C:\project\zoom-property\admin.zoom-property\src\pages\CMS\cmsSchema.ts"

# Which dictionary groups belong to which public page.
#
# `landowners` carries only the page banner (`landowner`): the case studies
# themselves are records with a photograph, a share and a handover year, and
# they live in the Landowners module. The `landowners` group of section
# headings is deliberately not listed - see the note in the response.
#
# `reviews` is deliberately absent. A review is a record with a photograph,
# a rating and a film, not a heading — it belongs in the Reviews module,
# which manages the reviews themselves. Listing it here put the same thing
# in two places in the sidebar.
PAGES = [
    ("home", "Home", "The landing page, top to bottom.",
     ["hero", "showcase", "features", "gallery", "faq", "rooms", "statsBanner",
      "videoSection", "cta"]),
    ("properties", "Properties", "The listings index and a single listing.",
     ["listings", "property", "search", "calculator"]),
    ("projects", "Projects", "Section copy for developments. The records themselves live under Listings.",
     ["projects", "projectDetail"]),
    ("areas", "Areas", "Section copy for neighbourhoods. The records themselves live under Listings.",
     ["areas"]),
    ("about", "About", "The about page and the explainer blocks it is built from.",
     ["about", "pages"]),
    ("services", "Services", "The services showcase.", ["services"]),
    ("landowners", "Landowners", "The banner at the top of the landowners page.",
     ["landowner"]),
    ("blog", "Blog", "The blog index, an article, and everything around it.",
     ["blog"]),
    ("reviews", "Reviews", "The banner at the top of the reviews page.",
     ["reviews"]),
    ("agents", "Agents", "The agents page.", ["agentsSection"]),
    ("contact", "Contact", "The contact page and its enquiry form.", ["contact"]),
    ("common", "Site-wide", "Navigation, footer, metadata and the 404 page.",
     ["meta", "nav", "footer", "notFound"]),
]

TEXTAREA = re.compile(
    r"(description|lead|body|note|quote|subtitle|placeholder|tagline|successBody)$",
    re.IGNORECASE,
)

# A media field is named like one *and* holds an address. The key alone is not
# enough: "playVideo" and "copyLink" are button labels, and typing them as a
# URL would hand the desk an upload box where a word belongs.
IMAGE_KEY = re.compile(r"(poster|image|photo|avatar|logo|banner|cover|thumbnail)$", re.I)
URL_KEY = re.compile(r"(video|url|href|link)$", re.I)
ADDRESS = re.compile(r"^(https?://|/)")


# Pages whose CMS entry is the banner and nothing else: the photograph and the
# three lines over it. Everything else on these pages is a record managed in
# its own module - a listing, a development, an area, a case study, a review -
# so the only thing left for the CMS to own is the top of the page.
#
# The value is the dictionary group the banner lives in, and the four keys are
# taken in this order so the editor reads top-down the way the page does.
BANNER_ONLY = {
    "properties": "listings",
    "projects": "projects",
    "areas": "areas",
    "landowners": "landowner",
    "reviews": "reviews",
}

BANNER_KEYS = ["backgroundImage", "eyebrow", "title", "description"]


# A tab is named for what it is on the page, not for the dictionary group it
# happens to come from. Keyed by section id.
SECTION_LABELS = {
    "landowner": "Banner",
}


def pretty(seg: str) -> str:
    """camelCase / dotted segment to a human label."""
    s = re.sub(r"([a-z0-9])([A-Z])", r"\1 \2", seg)
    s = s.replace("_", " ").replace("-", " ").strip()
    return s[:1].upper() + s[1:]


def scalars(node, prefix=""):
    """Every string leaf under a node, as (dotted path, value)."""
    for k, v in node.items():
        p = f"{prefix}.{k}" if prefix else k
        if isinstance(v, dict):
            yield from scalars(v, p)
        elif isinstance(v, str):
            yield p, v


def field_type(path: str, value: str) -> str:
    last = path.split(".")[-1]
    if ADDRESS.match(value.strip()):
        if IMAGE_KEY.search(last):
            return "image"
        if URL_KEY.search(last):
            return "url"
    if TEXTAREA.search(last):
        return "textarea"
    return "textarea" if len(value) > 90 else "text"


def ts(s: str) -> str:
    """A TypeScript double-quoted string literal."""
    return json.dumps(s, ensure_ascii=False)


def build():
    en = json.load(open(os.path.join(FRONTEND, "en.json"), encoding="utf-8"))
    bn = json.load(open(os.path.join(FRONTEND, "bn.json"), encoding="utf-8"))

    def bn_at(path):
        node = bn
        for seg in path.split("."):
            if not isinstance(node, dict) or seg not in node:
                return ""
            node = node[seg]
        return node if isinstance(node, str) else ""

    out = []
    total_fields = 0

    def emit(page_id, page_label, page_desc, sections):
        """Writes one page block. Shared by the banner-only and general paths."""
        nonlocal total_fields
        if not sections:
            return

        out.append(f"  {{\n    id: {ts(page_id)},\n    label: {ts(page_label)},")
        out.append(f"    description: {ts(page_desc)},")
        out.append("    sections: [")
        for sec_id, sec_label, fields in sections:
            out.append(f"      {{\n        id: {ts(sec_id)},")
            out.append(f"        label: {ts(sec_label)},")
            out.append("        fields: [")
            for path, value in fields:
                total_fields += 1
                # Label from the part of the path below the section.
                tail = path[len(sec_id) + 1:] if path.startswith(sec_id + ".") else path
                label = " · ".join(pretty(s) for s in tail.split("."))
                out.append(
                    "          { key: %s, label: %s, type: %s, en: %s, bn: %s },"
                    % (ts(path), ts(label), ts(field_type(path, value)),
                       ts(value), ts(bn_at(path)))
                )
            out.append("        ],\n      },")
        out.append("    ],\n  },")

    for page_id, page_label, page_desc, groups in PAGES:
        sections = []

        if page_id in BANNER_ONLY:
            group = BANNER_ONLY[page_id]
            node = en.get(group) or {}
            fields = [
                (f"{group}.{k}", node[k])
                for k in BANNER_KEYS
                if isinstance(node.get(k), str)
            ]
            if fields:
                sections.append((group, "Banner", fields))
            emit(page_id, page_label, page_desc, sections)
            continue

        for group in groups:
            node = en.get(group)
            if not isinstance(node, dict):
                continue

            # Scalars sitting directly on the group, plus any that live under a
            # nested dict which is itself too small to deserve its own tab.
            own = [(p, v) for p, v in scalars(node, group)
                   if p.count(".") == group.count(".") + 1]
            children = [k for k, v in node.items() if isinstance(v, dict)]

            if own:
                sections.append(
                    (group, SECTION_LABELS.get(group, pretty(group)), own)
                )

            for child in children:
                sub = list(scalars(node[child], f"{group}.{child}"))
                if not sub:
                    continue
                label = f"{pretty(group)} · {pretty(child)}"
                sections.append((f"{group}.{child}", label, sub))

        emit(page_id, page_label, page_desc, sections)

    header = '''/**
 * What the CMS can edit, page by page.
 *
 * Generated from the public site's dictionaries
 * (`frontend.zoom-property/src/i18n/messages/{en,bn}.json`) by
 * `scripts/gen_cms_schema.py`. Regenerate rather than hand-editing: a list
 * typed out by hand goes stale the first time a dictionary key is added, and
 * a CMS that offers a field the site does not read is worse than no field.
 *
 * `en` and `bn` carry what the site says today. They are shown as the input's
 * placeholder, so an empty box means "unchanged, still using the built-in
 * text" rather than "blank on the site".
 *
 * A key here is the dictionary path (`hero.title`). Stored per language as
 * `<path>.<lang>` in the Dynamic Content collection, grouped by page id.
 */

export type CmsFieldType = "text" | "textarea" | "url" | "image";

export interface CmsField {
  /** Dictionary path, e.g. `hero.trust.rajuk`. */
  key: string;
  label: string;
  type: CmsFieldType;
  /** What the site says today, in each language. Used as placeholder text. */
  en: string;
  bn: string;
  /**
   * Starts a titled block within the section. Set on the first field of the
   * block; the editor groups everything after it until the next header.
   */
  groupHeader?: string;
  /** Overrides the default guidance shown beside an `image` field. */
  hint?: string;
}

/**
 * `image` and `url` fields hold one address, not one string per language, so
 * the editor shows a single control and stores the same value under both
 * languages.
 */

/**
 * A field inside a repeatable item - the "title" or "body" of one step, one
 * benefit, one stat. `suffix` is what goes after the index, so
 * `pages.buying.steps.2.title` addresses the third step's title.
 */
export interface CmsRepeatableField {
  suffix: string;
  label: string;
  type: CmsFieldType;
  defaultEn?: string;
  defaultBn?: string;
}

/**
 * A section whose content is a list rather than a fixed set of fields - the
 * buying steps, the stats band, the FAQ. The editor renders add / remove
 * controls and numbers each item as it goes.
 */
export interface CmsRepeatable {
  /** Key prefix the index is appended to, e.g. `pages.buying.steps`. */
  itemPrefix: string;
  /** Singular noun for the add button and the item headings: "Step". */
  itemName: string;
  addButtonText?: string;
  /** How many blank items to show before anything has been saved. */
  initialCount?: number;
  itemFields: CmsRepeatableField[];
  /** What the site ships today, so an untouched list still has its text. */
  defaultItems?: Record<string, string>[];
}

export interface CmsSection {
  id: string;
  label: string;
  fields: CmsField[];
  /**
   * Present when the section is a list. Set by hand in this file rather than
   * generated: the dictionary stores these as JSON arrays, and which of their
   * keys are editable is an editorial decision, not something the shape can
   * be read off.
   */
  repeatable?: CmsRepeatable;
}

export interface CmsPageDef {
  id: string;
  label: string;
  description: string;
  sections: CmsSection[];
}

export const cmsPages: CmsPageDef[] = [
'''
    footer = '''];

/** Page by its id, for the route to resolve `/cms/:pageId`. */
export const cmsPageById = (id?: string) =>
  cmsPages.find((p) => p.id === id);

/** The storage key for one field in one language. */
export const cmsStorageKey = (key: string, lang: "en" | "bn") =>
  `${key}.${lang}`;
'''

    body = "\n".join(out)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8", newline="\r\n") as fh:
        fh.write(header + body + "\n" + footer)

    print(f"wrote {OUT}")
    print(f"pages: {len(PAGES)}  fields: {total_fields}")


if __name__ == "__main__":
    build()
