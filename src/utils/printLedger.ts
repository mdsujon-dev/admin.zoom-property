import { COMPANY } from "../config/company";

/**
 * Lays a ledger out into real A4 sheets, then prints it.
 *
 * ── Why this is done by hand ───────────────────────────────────────────────
 *
 * Chrome breaks a long document across pages perfectly well, but it will not
 * write anything into a page margin: `@page { @top-right { content: counter(page) } }`
 * is in the spec and in no browser. So a flowing cash book cannot number its
 * own pages, and it cannot carry a total forward either, because nothing in the
 * document knows where a page ended.
 *
 * Paged.js was the obvious answer and it does not work here. Measured on this
 * report it laid 39 source rows into 82 — every row printed about twice,
 * because its table breaking clones the remainder onto the next sheet without
 * removing it from the last. Disabling our own handlers changed nothing, so it
 * is the library rather than the use of it.
 *
 * ── Why hand pagination works now and did not before ───────────────────────
 *
 * Earlier attempts guessed how many rows fit and were beaten by the print
 * dialog: how much paper a page offers depends on the margin and the scale
 * chosen there, and script can see neither.
 *
 * `@page { margin: 0 }` removes that unknown. The sheets below are a fixed
 * 210x297mm with their margins as padding, so capacity is a measurement rather
 * than a guess — rows are added until the body actually overflows, which is a
 * fact the browser reports. Scale stops mattering too: "fit to page" shrinks
 * the sheet and everything on it by the same amount, so a row on page two stays
 * on page two.
 *
 * The zero margin is injected only while a ledger is being printed and removed
 * afterwards, because every other print view in the app — receipts, the
 * registration form — relies on the browser's own margins.
 */

const SHEET_STYLE_ID = "ledger-sheet-css";
const PAGE_STYLE_ID = "ledger-page-css";

/**
 * How a sheet is built. Stays on the document, because the sheets are shown on
 * screen as well as printed — the report *is* the pages, so somebody checking a
 * figure sees the same paper the printer will produce, page numbers and carried
 * totals included, instead of one endless strip that turns into pages only once
 * it is too late to look at them.
 */
const SHEET_CSS = `
.lp-sheet {
  box-sizing: border-box;
  width: 210mm;
  height: 297mm;
  padding: 9mm 8mm 10mm 8mm;
  background: #fff;
  overflow: hidden;
  break-after: page;
  page-break-after: always;
}
.lp-sheet:last-child { break-after: auto; page-break-after: auto; }

/* The sheet is a column: head and foot take what they need and the entries
   take the rest — which is what makes "has this page run out of room?" a
   question the browser can answer. */
.lp-inner { display: flex; flex-direction: column; height: 100%; }
.lp-head { flex: 0 0 auto; }
.lp-body { flex: 1 1 auto; overflow: hidden; }
.lp-foot { flex: 0 0 auto; }

.lp-cont { text-align: right; font-style: italic; padding-top: 1mm; }

/* On screen a sheet needs an edge to read as a sheet; on paper it is the
   paper, and a shadow around it would be printed as a grey band. */
.lp-sheet { box-shadow: 0 1px 8px rgba(0, 0, 0, 0.16); }
@media print { .lp-sheet { box-shadow: none; } }
`;

const addStyle = (id: string, css: string) => {
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = css;
  document.head.appendChild(style);
};

const PAGE_CSS = "@page { size: A4; margin: 0; }";

/**
 * Makes every print of a paginated ledger use a zero page margin, however it
 * was started.
 *
 * The margin cannot simply live in the stylesheet: `@page` applies to the whole
 * document, so it would strip the margins off every other print view in the
 * app — the receipts, the registration form — which rely on them. So it is put
 * on for the duration of a print and taken off again.
 *
 * Hung off `beforeprint` rather than off the Print button, because Ctrl+P and
 * the browser's own menu never touch the button. Without this they printed each
 * 297mm sheet into a printable area shorter than 297mm, so every sheet spilled a
 * few millimetres onto a page of its own and a two-page book came out as four,
 * every other one nearly blank.
 *
 * The guard on `.lp-sheet` is what keeps it to this report: no sheets on the
 * page, no rule, and the receipts print with the margins they expect.
 */
let printGuardInstalled = false;

const installPrintGuard = () => {
  if (printGuardInstalled) return;
  printGuardInstalled = true;

  window.addEventListener("beforeprint", () => {
    if (document.querySelector(".lp-sheet")) addStyle(PAGE_STYLE_ID, PAGE_CSS);
  });
  window.addEventListener("afterprint", () => {
    document.getElementById(PAGE_STYLE_ID)?.remove();
  });
};

/** Prints the sheets. The margin is handled by the guard above. */
export const printPaginated = () => {
  /* Also set here, and not only in `beforeprint`, because Safari does not fire
     that event at all. Harmless where it does: `addStyle` is idempotent and
     `afterprint` takes the rule away either way. */
  addStyle(PAGE_STYLE_ID, PAGE_CSS);
  // Force the rule to take effect before the dialog reads the layout.
  void document.body.offsetHeight;
  window.print();
};

/**
 * Paginates `source` into `target`, and returns how many sheets it took.
 *
 * `target` is what the reader sees and what the printer gets — the same sheets
 * either way.
 *
 * `money` is given for a cash book and left out for anything with no running
 * total; with it, each sheet closes on **Carried Over** and the next opens on
 * **Brought Forward**, which is what lets somebody check one page on its own
 * instead of adding the whole month up again.
 */
export const paginateLedger = async (
  source: HTMLElement,
  target: HTMLElement,
  title: string,
  money?: (n: number) => string,
) => {
  addStyle(SHEET_STYLE_ID, SHEET_CSS);
  installPrintGuard();
  target.innerHTML = "";

  const sheetSource =
    source.querySelector<HTMLElement>(".ledger-page") ?? source;
  const table = sheetSource.querySelector("table");
  if (!table) return 0;

  /* The letterhead is whatever sits above the table — taken as it is rather
     than rebuilt here, so the printed first page and the screen cannot drift
     apart. */
  const letterhead = Array.from(sheetSource.children)
    .filter((n) => n !== table)
    .map((n) => n.outerHTML)
    .join("");

  const theadHTML = table.querySelector("thead")?.outerHTML ?? "";
  const rows = Array.from(table.querySelectorAll<HTMLElement>("tbody > tr"));

  /* Measured off the real table, so the carried figures sit under Debit and
     Credit rather than wherever the text happens to end. */
  const widths = Array.from(table.querySelectorAll("thead th")).map(
    (th) => th.getBoundingClientRect().width,
  );

  const carriedRow = (label: string, debit: number, credit: number) => {
    if (!money) return "";

    const cells = widths
      .map((w, i) => {
        const isCredit = i === widths.length - 1;
        const isDebit = i === widths.length - 2;
        // The second column is the wide one; it takes the label and no width.
        const width = i === 1 ? "" : `width:${w}px;`;

        if (!isDebit && !isCredit) {
          const pad = i === 1 ? "padding-left:24px" : "";
          return `<td style="${width}${pad}">${i === 1 ? label : ""}</td>`;
        }

        const pad = isCredit ? 4 : 12;
        const value = isCredit ? credit : debit;
        return `<td style="${width}text-align:right;padding-right:${pad}px;border-top:1px solid #000">${money(
          value,
        )}</td>`;
      })
      .join("");

    return `<table style="width:100%;table-layout:fixed;border-collapse:collapse"><tr>${cells}</tr></table>`;
  };

  /* Continuation sheets open with the company and the book, and the page
     number where the book puts it. The full letterhead belongs on sheet one. */
  const runningHead = (page: number) =>
    `<div style="display:flex;justify-content:space-between;align-items:flex-end">` +
    `<div><strong style="display:block">${COMPANY.name}</strong>${title}</div>` +
    `<div>Page ${page}</div></div>`;

  interface Sheet {
    body: HTMLElement;
    tbody: HTMLElement;
    foot: HTMLElement;
  }

  let carriedDebit = 0;
  let carriedCredit = 0;
  let pageNo = 0;

  const newSheet = (): Sheet => {
    pageNo += 1;

    const sheet = document.createElement("div");
    sheet.className = "lp-sheet";

    /* Cloned shallow, so the sheet keeps the typography the screen uses — the
       9pt serif, the black override — and loses only the page padding, which
       the sheet itself now supplies. */
    const inner = sheetSource.cloneNode(false) as HTMLElement;
    inner.classList.add("lp-inner");
    inner.style.cssText =
      "padding:0;margin:0;width:100%;max-width:none;height:100%";

    const head = document.createElement("div");
    head.className = "lp-head";
    head.innerHTML =
      pageNo === 1
        ? `<div style="text-align:right">Page 1</div>${letterhead}`
        : // The figures a sheet opens with are known the moment it opens: they
          // are the ones the sheet before it closed on.
          runningHead(pageNo) +
          carriedRow("Brought Forward", carriedDebit, carriedCredit);

    const body = document.createElement("div");
    body.className = "lp-body";
    const t = document.createElement("table");
    t.className = table.className;
    t.innerHTML = `${theadHTML}<tbody></tbody>`;
    body.appendChild(t);

    /* Written properly once the sheet is full. Rendered now, with the figures
       so far, so that it occupies its real height while rows are being counted
       — added afterwards it would push the last row off the sheet it had just
       been measured onto. */
    const foot = document.createElement("div");
    foot.className = "lp-foot";
    foot.innerHTML =
      carriedRow("Carried Over", carriedDebit, carriedCredit) +
      `<div class="lp-cont">continued</div>`;

    inner.append(head, body, foot);
    sheet.appendChild(inner);
    target.appendChild(sheet);

    return { body, tbody: t.querySelector("tbody")!, foot };
  };

  const overflows = (s: Sheet) => s.body.scrollHeight > s.body.clientHeight;

  const closeSheet = (s: Sheet, more: boolean) => {
    s.foot.innerHTML = more
      ? carriedRow("Carried Over", carriedDebit, carriedCredit) +
        `<div class="lp-cont">continued</div>`
      : "";
  };

  const cellValue = (row: Element, index: number) => {
    const n = Number(row.children[index]?.textContent?.replace(/,/g, "") || "");
    return Number.isFinite(n) ? n : 0;
  };

  let current = newSheet();

  /**
   * Places a run of rows, moving the whole run to a fresh sheet if it will not
   * fit. A run is normally one row; the closing block is passed as three, so a
   * balance is never separated from the totals it has to agree with.
   */
  const place = (run: HTMLElement[]) => {
    const added = run.map((r) => {
      const clone = r.cloneNode(true) as HTMLElement;
      current.tbody.appendChild(clone);
      return clone;
    });

    if (overflows(current)) {
      for (const clone of added) clone.remove();
      closeSheet(current, true);
      current = newSheet();
      for (const r of run) current.tbody.appendChild(r.cloneNode(true));
    }

    /* Counted after the sheet is settled, so a row that moved forward is
       carried by the sheet it actually landed on. The closing block is the
       total itself and is never carried. */
    for (const r of run) {
      if (r.classList.contains("ledger-keep")) continue;
      const n = r.children.length;
      carriedDebit += cellValue(r, n - 2);
      carriedCredit += cellValue(r, n - 1);
    }
  };

  const entries = rows.filter((r) => !r.classList.contains("ledger-keep"));
  const closing = rows.filter((r) => r.classList.contains("ledger-keep"));

  for (const row of entries) place([row]);
  if (closing.length) place(closing);

  // The last sheet closes; it carries nothing forward.
  closeSheet(current, false);

  return pageNo;
};
