import dayjs from "dayjs";
import jsPDF, { GState } from "jspdf";

import { BRAND, COMPANY, COMPANY_CONTACT } from "../config/company";
import * as XLSX from "xlsx";
import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  HeadingLevel,
  ImageRun,
  PageNumber,
  PageOrientation,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";

/**
 * One shape, three files.
 *
 * Any list in the panel — the attendance register, the client list, a project
 * roster — hands this module the same plain grid rather than each building its
 * own Excel, PDF and Word writer. Which rows are exceptional is decided by
 * whoever builds the grid and arrives already flagged, so an exported file can
 * never disagree with the screen it came from.
 *
 * Pair it with `<ExportMenu sheet={...} />` rather than calling the three
 * exporters by hand — that component is the button, the loading state and the
 * error toast around these functions.
 */
export type ExportRow = {
  cells: (string | number)[];
  /** Rendered in red across all three formats. */
  isLow?: boolean;
  /**
   * The signed figure behind the amount cell, for the running total.
   *
   * The cell itself is text — "+ 6,300", "− 21,000 (refund)" — and adding a
   * ledger up by parsing its own formatting is how a total quietly goes wrong
   * the day somebody changes a separator. The number is carried alongside.
   */
  value?: number;
};

export type ExportSheet = {
  /** Becomes the file name and the heading on the page. */
  title: string;
  subtitle?: string;
  headers: string[];
  rows: ExportRow[];
  /** Printed under the heading so the colour is never unexplained. */
  note?: string;
  /**
   * Run a page-by-page total down the ledger.
   *
   * A thousand payments is thirty pages, and thirty pages of figures with one
   * total at the very end cannot be checked by anybody — the accepted way to
   * write a ledger is to close each page with what it came to, open the next
   * with that figure, and let the last page carry the whole. Given here, the
   * PDF closes every page with **Carried forward**, opens the next with
   * **Brought forward**, and ends on **Total**.
   */
  runningTotal?: {
    /** Which column holds the money. */
    column: number;
    /** How the carried figure is written; defaults to a grouped number. */
    format?: (value: number) => string;
  };
};

/**
 * The sheet every list builds, built the same way.
 *
 * Without this each page wrote its own subtitle and its own "N records" line,
 * and they disagreed — some counted, some named the filters, some said nothing,
 * so two exported files from the same panel did not look like they came from
 * the same system. A page now says what it is called, what is being shown and
 * how one record becomes a row; the rest is identical everywhere.
 *
 *   makeSheet({
 *     title: "Agent",
 *     unit: "agent",
 *     filters: [status && `Status: ${status}`],
 *     headers: ["ID", "Name"],
 *     rows: faculties,
 *     cells: (f) => [f.facultyId, f.name],
 *   })
 */
/** Which file is being written — some columns only belong in one of them. */
export type SheetFormat = "xlsx" | "pdf" | "docx";

export type SheetColumn<T> = {
  header: string;
  cell: (row: T) => string | number;
  /**
   * Excel only.
   *
   * A spreadsheet is the place to keep everything on file — every field of the
   * record, however long, because a column nobody needs can be hidden and one
   * that was never written cannot be recovered. A PDF or a Word file is a page
   * somebody reads: thirty columns on it are thirty unreadable columns. So the
   * full record goes to Excel and the printed formats carry what a person
   * actually looks for.
   */
  detail?: boolean;
};

export const makeSheet = <T>({
  title,
  unit = "record",
  filters = [],
  headers,
  rows,
  cells,
  columns,
  format,
  isLow,
  note,
  value,
  runningTotal,
}: {
  title: string;
  /** Singular noun for the count line — "agent", "payment", "project". */
  unit?: string;
  /** Whatever narrowed the list; falsy entries are dropped. */
  filters?: (string | false | undefined | null)[];
  rows: T[];
  /** Same columns in every format. Use `columns` instead to vary by format. */
  headers?: string[];
  cells?: (row: T) => (string | number)[];
  /** Per-column definition, so `detail` columns can be Excel-only. */
  columns?: SheetColumn<T>[];
  /** The file being written; only matters alongside `columns`. */
  format?: SheetFormat;
  /** Rows worth picking out in red — overdue, failed, below the bar. */
  isLow?: (row: T) => boolean;
  note?: string;
  /** The signed figure behind a row, for `runningTotal`. */
  value?: (row: T) => number;
  runningTotal?: ExportSheet["runningTotal"];
}): ExportSheet => {
  const active = filters.filter(Boolean) as string[];

  const picked = columns?.filter((c) => !c.detail || format === "xlsx");
  const finalHeaders = picked ? picked.map((c) => c.header) : headers ?? [];
  const rowCells = picked
    ? (r: T) => picked.map((c) => c.cell(r))
    : cells ?? (() => []);

  return {
    title,
    subtitle: [
      `${rows.length} ${unit}${rows.length === 1 ? "" : "s"}`,
      ...active,
    ].join("  ·  "),
    /* No automatic "this list is filtered" note. It was printed in red across
       the top of every filtered export, which is the colour a document uses
       for something being wrong — and a deliberately filtered list is not
       wrong. The filters are named in the subtitle a line above it, so it was
       saying twice what it only needed to say once. `note` stays for a legend
       a reader actually needs, like what the red rows mean. */
    note,
    headers: finalHeaders,
    rows: rows.map((r) => ({
      cells: rowCells(r).map((c) => c ?? ""),
      ...(isLow ? { isLow: isLow(r) } : {}),
      ...(value ? { value: value(r) } : {}),
    })),
    runningTotal,
  };
};

const fileName = (title: string, ext: string) =>
  `${title.replace(/[^\w\d-]+/g, "-").replace(/-+/g, "-").toLowerCase()}-${dayjs().format(
    "YYYY-MM-DD"
  )}.${ext}`;

const saveBlob = (blob: Blob, name: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  // Revoked on the next tick — doing it immediately cancels the download in
  // Firefox before the file is written.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/* ── The letterhead ─────────────────────────────────────────────────────── */

/**
 * The company's mark, as a data URI, fetched once per page load.
 *
 * jsPDF and docx both want the bytes rather than a URL. It is fetched instead
 * of bundled so the 60kB does not ride in the main chunk for a button most
 * sessions never press, and a failure is not an error: a letterhead without
 * its logo is still a letterhead, and refusing to write somebody's file
 * because an image 404'd would be the wrong trade.
 */
let logoPromise: Promise<string | null> | null = null;

/**
 * The size the mark is stored at.
 *
 * It is used twice — 34pt in the letterhead and ~300pt as the watermark behind
 * the page — so it is sized for the larger of the two rather than the smaller.
 * The source is 501px and storing it whole put a megabyte of logo in every
 * exported file; 256 keeps a three-page list at about 70kB. The watermark is
 * printed at 5% opacity, where softness does not read as a defect, so there is
 * nothing to buy by going higher.
 */
const LOGO_PX = 256;

const companyLogo = () => {
  if (!logoPromise) {
    logoPromise = new Promise<string | null>((resolve) => {
      const img = new Image();
      img.onload = () => {
        try {
          /* Redrawn small before it is embedded. The source is 501x501, and
             jsPDF stores what it is given as raw pixels — the first version of
             this put a megabyte of logo inside every exported list, for a mark
             printed half an inch wide. Flattened onto white at the same time,
             so the transparent corners do not have to be carried either. */
          const canvas = document.createElement("canvas");
          canvas.width = LOGO_PX;
          canvas.height = LOGO_PX;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(null);
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, LOGO_PX, LOGO_PX);
          ctx.drawImage(img, 0, 0, LOGO_PX, LOGO_PX);
          resolve(canvas.toDataURL("image/png"));
        } catch {
          resolve(null);
        }
      };
      // A letterhead without its logo is still a letterhead; refusing to write
      // somebody's file because an image failed would be the wrong trade.
      img.onerror = () => resolve(null);
      img.src = COMPANY.logo;
    });
  }
  return logoPromise;
};

/** Read the same way on every file: "Generated 3 Sep 2026, 4:12 PM". */
const generatedAt = () => `Generated ${dayjs().format("D MMM YYYY, h:mm A")}`;

/* ── Excel ──────────────────────────────────────────────────────────────── */

export const exportToExcel = (sheet: ExportSheet) => {
  /* The same letterhead the printed formats carry, as text rows above the
     table. No logo: an image floats over the grid rather than sitting in it,
     and drags out of place the moment somebody sorts or inserts a column.
     Four lines of text do the same job and survive being edited. */
  const letterhead = [
    [COMPANY.name],
    [COMPANY.address],
    [COMPANY_CONTACT],
    [],
  ];

  const body = [
    ...letterhead,
    [sheet.title],
    ...(sheet.subtitle ? [[sheet.subtitle]] : []),
    ...(sheet.note ? [[sheet.note]] : []),
    [generatedAt()],
    [],
    sheet.headers,
    ...sheet.rows.map((r) => r.cells),
  ];

  const ws = XLSX.utils.aoa_to_sheet(body);

  /* Each letterhead line spans the table, or a long address is cut off at the
     first column's edge and reads as truncated data. */
  const span = Math.max(1, sheet.headers.length);
  const headerRowCount = body.length - sheet.rows.length - 1;
  ws["!merges"] = Array.from({ length: headerRowCount }, (_, r) => ({
    s: { r, c: 0 },
    e: { r, c: span - 1 },
  }));

  /* No frozen header row: `!freeze` is silently dropped by the community build
     of SheetJS, so setting it only looked like it worked. */

  // Widths have to be set by hand — SheetJS ships no autofit, and without this
  // every name column opens eight characters wide.
  ws["!cols"] = sheet.headers.map((h, i) => ({
    wch: Math.min(
      40,
      Math.max(
        h.length + 2,
        ...sheet.rows.map((r) => String(r.cells[i] ?? "").length + 2)
      )
    ),
  }));

  const wb = XLSX.utils.book_new();
  /* Named after the export. Every file used to open on a tab called
     "Attendance", including the client list and the fee ledger. Excel refuses
     a tab name over 31 characters or carrying []:*?/\ , so it is trimmed. */
  XLSX.utils.book_append_sheet(
    wb,
    ws,
    sheet.title.replace(/[[\]:*?/\\]/g, " ").slice(0, 31) || "Sheet1"
  );
  XLSX.writeFile(wb, fileName(sheet.title, "xlsx"));
};

/* ── PDF ────────────────────────────────────────────────────────────────── */

/**
 * What jsPDF's built-in fonts can actually print.
 *
 * Helvetica and its siblings are WinAnsi-encoded — Latin-1 and a handful of
 * typographic extras, and nothing else. A character outside that does not just
 * look wrong: `getTextWidth` measures it as one width and the viewer draws it
 * as another, so the column arithmetic goes with it and the text spills over
 * the cell beside it. The project list showed this as "01 Sep 2026 !' 30 N620 2.."
 * running through the Seats column, all from one arrow.
 *
 * The substitutions keep the meaning. Anything still outside the encoding is
 * replaced with a question mark, which is at least honest and, more to the
 * point, measures correctly.
 */
const PDF_SUBSTITUTES: Record<string, string> = {
  "\u2192": "-", // → an arrow between two dates is a dash on paper
  "\u2190": "-", // ←
  "\u2194": "-", // ↔
  "\u2212": "-", // − the true minus sign; not the hyphen, and not in WinAnsi
  "\u2032": "'", // ′
  "\u2033": '"', // ″
  "\u2264": "<=", // ≤
  "\u2265": ">=", // ≥
  "\u2260": "!=", // ≠
  "\u09F3": "Tk", // ৳ the taka sign
  "\u20B9": "Rs", // ₹
  "\u2022": "\u00B7", // • → the middle dot, which WinAnsi does have
};

/** Latin-1 plus the WinAnsi extras jsPDF's standard fonts can draw. */
const pdfSafe = (text: string) => {
  let out = "";
  for (const ch of text) {
    const swap = PDF_SUBSTITUTES[ch];
    if (swap !== undefined) {
      out += swap;
      continue;
    }
    const code = ch.codePointAt(0) ?? 0;
    // Latin-1 outright, and the printable slice of Windows-1252 above it.
    out += code <= 0x2c6 || "\u2013\u2014\u2018\u2019\u201C\u201D\u2020\u2021\u2026\u2030\u20AC\u2122".includes(ch)
      ? ch
      : "?";
  }
  return out;
};

const PDF_FONT_SIZE = 8;
const PDF_ROW_HEIGHT = 16;
const PDF_HEADER_HEIGHT = 18;
const PDF_PAD = 4;

/** Room the letterhead takes at the top of the first page. */
const PDF_HEAD_HEIGHT = 58;
/** Room the running footer takes at the foot of every page. */
const PDF_FOOT_HEIGHT = 26;

/** The papers the export dialog offers. */
export const PDF_PAGE_SIZES = ["a4", "a3", "a5", "letter", "legal"] as const;
export type PdfPageSize = (typeof PDF_PAGE_SIZES)[number];
export type PdfOrientation = "landscape" | "portrait";

export type PdfOptions = {
  size?: PdfPageSize;
  orientation?: PdfOrientation;
};

export const exportToPdf = async (
  sheet: ExportSheet,
  options: PdfOptions = {}
) => {
  /* Landscape by default: a register is far wider than it is tall once the
     dates are in. The caller can say otherwise — a four-column list reads
     better on a portrait page, and whoever is printing it knows what is going
     in the tray. */
  const doc = new jsPDF(
    options.orientation ?? "landscape",
    "pt",
    options.size ?? "a4",
    true
  );
  const logo = await companyLogo();
  const margin = 32;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const usable = pageWidth - margin * 2;

  doc.setFontSize(PDF_FONT_SIZE);

  // Columns are sized from what they actually hold rather than by a fixed
  // ratio: a register is mostly one-letter date columns, and giving those the
  // same room as the name column is what used to push IDs onto a second line
  // and over the row below.
  const widths = sheet.headers.map((h, i) => {
    // Measured on the substituted text, or a column is sized for characters
    // that are never drawn.
    const longest = sheet.rows.reduce(
      (w, r) => Math.max(w, doc.getTextWidth(pdfSafe(String(r.cells[i] ?? "")))),
      doc.getTextWidth(pdfSafe(String(h)))
    );
    // Capped, or one unusually long cell — a mail address, a list of three
    // listings — takes the page and squeezes the short columns beside it until
    // even their headings are cut short.
    return Math.min(longest + PDF_PAD * 2, usable * 0.32);
  });
  const natural = widths.reduce((a, b) => a + b, 0);
  // Scale to the page either way — spare room goes back to the columns, and an
  // over-wide table is squeezed rather than run off the edge.
  const scale = usable / natural;
  for (let i = 0; i < widths.length; i++) widths[i] *= scale;

  const xOf = (i: number) =>
    margin + widths.slice(0, i).reduce((a, b) => a + b, 0);

  // Whatever is left after squeezing gets cut, so a long name can never bleed
  // into the column beside it.
  const fit = (text: string, width: number) => {
    const room = width - PDF_PAD * 2;
    if (doc.getTextWidth(text) <= room) return text;
    let cut = text;
    while (cut.length > 1 && doc.getTextWidth(`${cut}...`) > room)
      cut = cut.slice(0, -1);
    return `${cut}...`;
  };

  /* Every column ranges left, headings included.
  
     Centring everything but the first column was making the table hard to read
     down: a column of dates each a different width has no left edge to follow,
     and a name beside it starts in a different place on every row. Ranged left,
     the eye has one line to run down per column. */
  const drawCell = (text: string, i: number, top: number, height: number) => {
    const shown = fit(pdfSafe(text), widths[i]);
    const baseline = top + height / 2 + PDF_FONT_SIZE / 2 - 1.5;
    doc.text(shown, xOf(i) + PDF_PAD, baseline);
  };

  /**
   * The mark, faint, behind the page.
   *
   * Drawn as each page opens rather than stamped over the finished document:
   * a watermark laid on top would put the logo over the names, and a register
   * is read, not admired. Everything after this draws on top of it.
   *
   * Kept very light on purpose — at anything darker the grey column rules and
   * the mark start competing, and the table is what the page is for.
   */
  const drawWatermark = () => {
    if (!logo) return;
    const size = Math.min(300, pageHeight * 0.62);
    doc.setGState(new GState({ opacity: 0.05 }));
    doc.addImage(
      logo,
      "PNG",
      (pageWidth - size) / 2,
      (pageHeight - size) / 2,
      size,
      size
    );
    // Back to solid, or every stroke and letter after this comes out ghosted.
    doc.setGState(new GState({ opacity: 1 }));
  };

  drawWatermark();

  let y = margin;
  let tableTop = 0;

  // Verticals are drawn once per page, from the header down to wherever the
  // last row landed — drawing them per cell would be thousands of strokes.
  const closeGrid = () => {
    if (!tableTop) return;
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.5);
    for (let i = 0; i <= widths.length; i++) {
      const x = i === widths.length ? margin + usable : xOf(i);
      doc.line(x, tableTop, x, y);
    }
    doc.line(margin, tableTop, margin + usable, tableTop);
  };

  const drawHeaderRow = () => {
    tableTop = y;
    doc.setFillColor(243, 244, 246);
    doc.rect(margin, y, usable, PDF_HEADER_HEIGHT, "F");
    doc.setFontSize(PDF_FONT_SIZE);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(60);
    sheet.headers.forEach((h, i) =>
      drawCell(String(h), i, y, PDF_HEADER_HEIGHT)
    );
    doc.setFont("helvetica", "normal");
    y += PDF_HEADER_HEIGHT;
  };

  /* The letterhead. A list printed from here lands on somebody's desk, and a
     grid on a blank page says nothing about where it came from. */
  const textLeft = logo ? margin + 42 : margin;
  if (logo) {
    // Square source, so a square box — anything else stretches the mark.
    doc.addImage(logo, "PNG", margin, y, 34, 34);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(BRAND.rgb[0], BRAND.rgb[1], BRAND.rgb[2]);
  doc.text(pdfSafe(COMPANY.name.toUpperCase()), textLeft, y + 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(110);
  doc.text(pdfSafe(COMPANY.address), textLeft, y + 23);
  doc.text(pdfSafe(COMPANY_CONTACT), textLeft, y + 32);

  // A rule in the company's green, closing the letterhead off from the report
  // below it, so the two do not read as one block of text.
  doc.setDrawColor(BRAND.rgb[0], BRAND.rgb[1], BRAND.rgb[2]);
  doc.setLineWidth(1.2);
  doc.line(margin, y + PDF_HEAD_HEIGHT - 14, margin + usable, y + PDF_HEAD_HEIGHT - 14);
  y += PDF_HEAD_HEIGHT;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(20);
  doc.text(pdfSafe(sheet.title), margin, y + 10);
  doc.setFont("helvetica", "normal");
  y += 20;

  if (sheet.subtitle) {
    doc.setFontSize(9);
    doc.setTextColor(110);
    doc.text(pdfSafe(sheet.subtitle), margin, y + 8);
    y += 14;
  }
  if (sheet.note) {
    doc.setFontSize(8);
    doc.setTextColor(180, 40, 40);
    doc.text(pdfSafe(sheet.note), margin, y + 8);
    y += 14;
  }

  y += 6;
  drawHeaderRow();

  /* ── The running total ──────────────────────────────────────────────────
     Thirty pages of figures with one total on the last is a document nobody
     can check. Each page closes with what it came to and the next opens with
     that figure carried in, so any page can be verified on its own and the
     last one carries the lot. */
  const carry = sheet.runningTotal;
  const money = (n: number) =>
    carry?.format ? carry.format(n) : n.toLocaleString("en-BD");
  // The label sits to the left of the money, unless the money is already there.
  const labelCol = carry ? (carry.column === 0 ? 1 : 0) : 0;
  let running = 0;

  const drawCarryRow = (label: string, strong = false) => {
    if (!carry) return;
    doc.setFillColor(strong ? 226 : 241, strong ? 232 : 245, strong ? 240 : 249);
    doc.rect(margin, y, usable, PDF_ROW_HEIGHT, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(strong ? 15 : 55);
    if (labelCol < widths.length) drawCell(label, labelCol, y, PDF_ROW_HEIGHT);
    if (carry.column < widths.length)
      drawCell(money(running), carry.column, y, PDF_ROW_HEIGHT);
    doc.setFont("helvetica", "normal");
    y += PDF_ROW_HEIGHT;
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin + usable, y);
  };

  doc.setFontSize(PDF_FONT_SIZE);
  for (const row of sheet.rows) {
    /* The footer is stamped over every page afterwards, so rows have to stop
       short of it or the last one on a page is written under the page number.
       A carried pair needs room for two more rows, not one — the closing line
       on this page and the opening line on the next. */
    const needed = PDF_ROW_HEIGHT * (carry ? 2 : 1);
    if (y + needed > pageHeight - margin - PDF_FOOT_HEIGHT) {
      drawCarryRow("Carried forward");
      closeGrid();
      doc.addPage();
      drawWatermark();
      y = margin;
      drawHeaderRow();
      doc.setFontSize(PDF_FONT_SIZE);
      drawCarryRow("Brought forward");
      doc.setFontSize(PDF_FONT_SIZE);
    }

    const setRowColor = () => {
      if (row.isLow) doc.setTextColor(180, 30, 30);
      else doc.setTextColor(40);
    };

    if (row.isLow) {
      doc.setFillColor(254, 226, 226);
      doc.rect(margin, y, usable, PDF_ROW_HEIGHT, "F");
    }
    setRowColor();

    row.cells.forEach((cell, i) => {
      const text = String(cell ?? "");
      // A present mark reads as the brand green even on a red low-attendance
      // row — the row colour is about the client, not about that day.
      if (text === "P") doc.setTextColor(19, 48, 80);
      drawCell(text, i, y, PDF_ROW_HEIGHT);
      if (text === "P") setRowColor();
    });

    running += row.value ?? 0;

    y += PDF_ROW_HEIGHT;
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin + usable, y);
  }

  // The last page carries every page before it, so this is the whole ledger.
  drawCarryRow("Total", true);

  closeGrid();

  /* Stamped last, because "Page 1 of 7" cannot be written until the seventh
     page exists. Every page carries it, including the first. */
  const pages = doc.getNumberOfPages();
  const stamp = generatedAt();
  for (let page = 1; page <= pages; page++) {
    doc.setPage(page);
    const footY = pageHeight - margin + 4;

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(margin, footY - 10, margin + usable, footY - 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(140);
    doc.text(stamp, margin, footY);
    doc.text(pdfSafe(COMPANY.name), margin + usable / 2, footY, {
      align: "center",
    });
    doc.text(`Page ${page} of ${pages}`, margin + usable, footY, {
      align: "right",
    });
  }

  doc.save(fileName(sheet.title, "pdf"));
};

/* ── Word ───────────────────────────────────────────────────────────────── */

/** Grey hairlines on every edge, so the table reads as a table on paper too. */
const WORD_BORDER = { style: BorderStyle.SINGLE, size: 2, color: "CBD5E1" };
const WORD_BORDERS = {
  top: WORD_BORDER,
  bottom: WORD_BORDER,
  left: WORD_BORDER,
  right: WORD_BORDER,
};

const wordCell = (
  text: string,
  opts?: { head?: boolean; low?: boolean }
) =>
  new TableCell({
    borders: WORD_BORDERS,
    // Word packs text against the cell edge by default; a register with this
    // many columns needs the breathing room to stay readable.
    margins: { top: 40, bottom: 40, left: 80, right: 80 },
    shading: opts?.head
      ? { fill: "F3F4F6" }
      : opts?.low
      ? { fill: "FEE2E2" }
      : undefined,
    children: [
      new Paragraph({
        // Ranged left, like the PDF. Centring every column but the first left
        // no edge for the eye to follow down a long table, and the two formats
        // are meant to be the same document in different files.
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({
            text,
            bold: opts?.head,
            color: opts?.head ? "334155" : opts?.low ? "B91C1C" : "1F2937",
            size: 18, // half-points, so 9pt — a register has a lot of columns
          }),
        ],
      }),
    ],
  });

/** A data URI back to the bytes docx wants. */
const dataUriToBytes = (uri: string) => {
  const base64 = uri.slice(uri.indexOf(",") + 1);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
};

/**
 * The same letterhead the PDF carries, as a Word page header.
 *
 * A header rather than the first paragraph of the body, so it repeats on every
 * page — a twelve-page client list should say whose it is on page nine too.
 */
const wordLetterhead = (logo: string | null) =>
  new Header({
    children: [
      new Paragraph({
        spacing: { after: 40 },
        children: [
          ...(logo
            ? [
                new ImageRun({
                  type: "png",
                  data: dataUriToBytes(logo),
                  transformation: { width: 34, height: 34 },
                }),
                new TextRun({ text: "  " }),
              ]
            : []),
          new TextRun({
            text: COMPANY.name.toUpperCase(),
            bold: true,
            size: 26,
            color: BRAND.hex,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 0 },
        children: [
          new TextRun({ text: COMPANY.address, size: 15, color: "6B7280" }),
        ],
      }),
      new Paragraph({
        // The rule under the letterhead, drawn as a bottom border rather than a
        // row of dashes so it survives a change of font.
        border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: BRAND.hex } },
        spacing: { after: 200 },
        children: [
          new TextRun({ text: COMPANY_CONTACT, size: 15, color: "6B7280" }),
        ],
      }),
    ],
  });

const wordFooter = () =>
  new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" } },
        children: [
          new TextRun({
            text: `${generatedAt()}   ·   ${COMPANY.name}   ·   Page `,
            size: 14,
            color: "9CA3AF",
          }),
          // Word fills these in itself, so the count is right however the
          // document reflows on the reader's machine.
          new TextRun({ children: [PageNumber.CURRENT], size: 14, color: "9CA3AF" }),
          new TextRun({ text: " of ", size: 14, color: "9CA3AF" }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 14, color: "9CA3AF" }),
        ],
      }),
    ],
  });

export const exportToWord = async (sheet: ExportSheet) => {
  const logo = await companyLogo();
  // Landscape once a table is wider than a portrait page can carry without
  // squeezing every column to a couple of characters.
  const landscape = sheet.headers.length > 6;

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: landscape
                ? PageOrientation.LANDSCAPE
                : PageOrientation.PORTRAIT,
            },
            // Room at the top for the letterhead and at the foot for the
            // page number, or Word runs the body straight through both.
            margin: { top: 1500, bottom: 900, left: 720, right: 720 },
          },
        },
        headers: { default: wordLetterhead(logo) },
        footers: { default: wordFooter() },
        children: [
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 60 },
            children: [
              new TextRun({ text: sheet.title, bold: true, color: "133050" }),
            ],
          }),
          ...(sheet.subtitle
            ? [
                new Paragraph({
                  spacing: { after: 40 },
                  children: [
                    new TextRun({
                      text: sheet.subtitle,
                      size: 18,
                      color: "6B7280",
                    }),
                  ],
                }),
              ]
            : []),
          ...(sheet.note
            ? [
                new Paragraph({
                  children: [
                    new TextRun({ text: sheet.note, color: "B91C1C", size: 18 }),
                  ],
                }),
              ]
            : []),
          new Paragraph({ text: "", spacing: { after: 120 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                // Repeated at the top of every page — a table that runs over
                // the page break is unreadable without its headings.
                tableHeader: true,
                children: sheet.headers.map((h) => wordCell(h, { head: true })),
              }),
              ...sheet.rows.map(
                (r) =>
                  new TableRow({
                    children: r.cells.map((c) =>
                      wordCell(String(c ?? ""), { low: r.isLow })
                    ),
                  })
              ),
            ],
          }),
          // The "generated" line used to sit here, at the end of the body. It
          // is in the running footer now, where it is on every page instead of
          // only the last.
        ],
      },
    ],
  });

  saveBlob(await Packer.toBlob(doc), fileName(sheet.title, "docx"));
};
