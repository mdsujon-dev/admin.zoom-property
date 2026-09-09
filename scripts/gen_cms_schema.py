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
    ("landowners", "Landowners", "The landowner proposition and its case study.",
     ["landowner", "landowners"]),
    ("blog", "Blog", "The blog index, an article, and everything around it.",
     ["blog"]),
    ("reviews", "Reviews", "Client reviews, on the home page and their own.",
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

    for page_id, page_label, page_desc, groups in PAGES:
        sections = []
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
                sections.append((group, pretty(group), own))

            for child in children:
                sub = list(scalars(node[child], f"{group}.{child}"))
                if not sub:
                    continue
                label = f"{pretty(group)} · {pretty(child)}"
                sections.append((f"{group}.{child}", label, sub))

        if not sections:
            continue

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

export type CmsFieldType = "text" | "textarea";

export interface CmsField {
  /** Dictionary path, e.g. `hero.trust.rajuk`. */
  key: string;
  label: string;
  type: CmsFieldType;
  /** What the site says today, in each language. Used as placeholder text. */
  en: string;
  bn: string;
}

export interface CmsSection {
  id: string;
  label: string;
  fields: CmsField[];
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
