import { Button, Empty, Spin } from "antd";
import dayjs from "dayjs";
import { Printer } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { COMPANY } from "../../config/company";
import {
  ReportQuery,
  useCashBookReportQuery,
} from "../../redux/features/report/reportApi";
import { paginateLedger, printPaginated } from "../../utils/printLedger";

/** Grouped the way the book writes it: 13,42,095.00 */
const money = (n: number) =>
  Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

/**
 * The detail line with the name and id stripped out of it.
 *
 * The reason is typed at the counter and people naturally write who it was
 * for — "Listing fee — Md Sujon Mia (AYE-2026-0107) · Web Development" — but the
 * line directly above already says that. Printed as written, the repetition ran
 * the detail past the end of its column and what fell off was the tail: the
 * receipt number, which is the one thing on the line that ties it to the piece
 * of paper in somebody's hand.
 *
 * Split and rejoined rather than pattern-matched, so a name containing a
 * bracket or a dash cannot break the expression.
 */
const withoutParty = (detail?: string, party?: string, partyId?: string) => {
  let text = detail || "";
  if (partyId) text = text.split(partyId).join("");
  if (party) text = text.split(party).join("");

  return text
    .split(/\s*[—–·]\s*/)
    .map((part) => part.replace(/\(\s*\)/g, "").trim())
    .filter(Boolean)
    .join(" · ");
};

interface Props {
  query: ReportQuery;
}

/**
 * The petty cash book, printed the way the book it replaces is printed.
 *
 * Deliberately not the app's table component. This is a document: it is
 * printed, filed, and read months later by somebody checking one figure against
 * a voucher in their hand. That reader needs what a screen table throws away —
 * a running balance, two columns that add to the same figure at the end, and
 * the date printed only when it changes, because a column repeating
 * "25-7-2026" nineteen times hides where one day ends and the next begins.
 *
 * The Dr/Cr against each line names the *other* account — the expense that was
 * debited, the income that was credited — while the column shows what the cash
 * did, so each line reads as a complete double entry rather than a note.
 *
 * ── On pagination ─────────────────────────────────────────────────────────
 *
 * The sheets are cut by `utils/printLedger.ts`, not by the browser and not by
 * this component.
 *
 * Chrome will not write into a page margin, so a flowing document cannot number
 * its own pages, and nothing in it knows where a page ended, so nothing can
 * carry a total forward. Paged.js exists for exactly that and printed every row
 * roughly twice here, so the sheets are measured out by hand instead — against
 * `@page { margin: 0 }`, which is what makes the count reliable where earlier
 * attempts at the same thing were beaten by the print dialog.
 *
 * One consequence worth knowing when reading a printout: at this density about
 * forty-five entries fill a sheet, so a quiet month is legitimately one page.
 * See `utils/printLedger.ts`.
 */
const CashBookReport = ({ query }: Props) => {
  const { data, isFetching } = useCashBookReportQuery({
    ...query,
    // No pagination: a cash book is the whole period or it does not balance.
    page: undefined,
    limit: undefined,
  });

  const rows: any[] = data?.allRows || data?.rows || [];
  const s = data?.summary;

  const period = `${dayjs(query.startDate).format("D-MMM-YYYY")} to ${dayjs(
    query.endDate,
  )
    .subtract(1, "day")
    .format("D-MMM-YYYY")}`;

  const sheetRef = useRef<HTMLDivElement>(null);
  const pagesRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(0);
  const [failed, setFailed] = useState(false);

  /*
   * Cut into sheets as soon as there is something to cut, rather than on the
   * Print button.
   *
   * The pages are the report. Paginating only at the moment of printing meant
   * the screen showed one endless strip and the page numbers, the Carried Over
   * line and the breaks themselves existed only inside the print dialog — where
   * they are too late to check. Now the reader sees the paper.
   */
  useEffect(() => {
    if (!sheetRef.current || !pagesRef.current) return;

    let cancelled = false;
    (async () => {
      try {
        const pages = await paginateLedger(
          sheetRef.current!,
          pagesRef.current!,
          // The book's continuation pages carry the period too.
          `Petty Cash Book : ${period}`,
          // Given, so each page can close on Carried Over and the next open on
          // Brought Forward — which needs to know where the break fell.
          money,
        );
        if (!cancelled) {
          setPageCount(pages);
          setFailed(false);
        }
      } catch {
        // The figures still have to be readable, so the unpaginated sheet is
        // shown instead. It loses the page numbers, not the money.
        if (cancelled) return;
        setFailed(true);
        toast.warning("Showing one continuous sheet — pagination failed");
      }
    })();

    return () => {
      cancelled = true;
    };
    // `data` rather than `rows`: the rows array is rebuilt on every render and
    // would restart this on each one.
  }, [data, period]);

  const handlePrint = () => (failed ? window.print() : printPaginated());

  if (isFetching) {
    return (
      <div className="flex justify-center py-16">
        <Spin />
      </div>
    );
  }

  if (!s) return <Empty description="Nothing to show" className="py-12" />;

  const rule = "border-b border-secondary-200";
  let lastDate = "";

  return (
    /* A4 is wider than this panel on a laptop, so the sheets scroll sideways
       rather than being squeezed out of shape. On paper there is nothing to
       scroll and the clipping would cut the Credit column off. */
    <div className="relative overflow-x-auto print:overflow-visible">
      <div className="mb-3 flex items-center justify-end gap-3 print:hidden">
        {pageCount > 0 && (
          <span className="text-xs text-secondary-500">
            {pageCount} {pageCount === 1 ? "page" : "pages"}
          </span>
        )}
        <Button icon={<Printer className="h-4 w-4" />} onClick={handlePrint}>
          Print
        </Button>
      </div>

      {/* The finished sheets: what is read on screen and what is printed.

          `ledger-print` is what the print stylesheet keeps on the page —
          everything else in the app is hidden while printing, and without it
          the browser prints a blank sheet. */}
      <div
        ref={pagesRef}
        className="ledger-print ledger-paged flex flex-col items-center gap-6 print:gap-0"
      />

      {/* The sheet the pages are cut from. Off screen rather than hidden: the
          paginator has to measure it to know where a page ends, and an element
          with `display: none` has no measurements — hidden that way it laid out
          nothing and the print came out blank.

          `print:hidden` sits on this wrapper, not on the sheet itself: the
          sheet is what gets cloned into each page, and a clone carrying that
          class would be hidden on the very paper it was cloned for. */}
      <div
        aria-hidden={!failed}
        className={
          failed
            ? // Nothing was cut, so this is the report: it has to be seen and
              // printed, page numbers or no page numbers.
              "ledger-print"
            : "pointer-events-none absolute -left-[10000px] top-0 w-[210mm] print:hidden"
        }
      >
        <div ref={sheetRef}>
        <div /* Sized in points, not pixels, because this is going on paper: 9pt
             is the ordinary size for a printed register — small enough that a
             sheet still holds a working number of entries, large enough to read
             a year later without holding it to the light. Pixels said nothing
             about either; 8px printed at about 6pt, below what any book uses. */
          className="ledger-page mx-auto w-full max-w-[210mm] bg-white px-[8mm] py-[10mm] font-serif text-[9pt] leading-[1.35] text-black [&_*]:!text-black print:max-w-none">
          {/* Name and where it is, and nothing else.

              No box around it, and no email or website line: this is a ledger
              the office keeps, not a letter it sends. The contact details
              belong on a receipt a client walks away with — here they would be
              two lines pushing the entries down the page and telling the reader
              nothing they needed. */}
          <div className="relative text-center">
            <p className="absolute right-0 top-0 text-[7pt]">
              Printed on {dayjs().format("DD-MMM-YYYY [at] HH mm")}
            </p>
            <h2 className="text-[12.5pt] font-bold">{COMPANY.name}</h2>
            <p className="text-[8pt]">{COMPANY.address}</p>
          </div>

          <h3 className="mt-1.5 text-center text-[11.5pt] font-bold tracking-[0.14em]">
            Petty Cash Book
          </h3>
          <p className="mt-1 text-center text-[9pt]">{period}</p>

          {/* `table-fixed` is what keeps the money on the page.

              Left to itself the browser widens a column to fit its longest
              line, and a particular reading "Client Income — Nafisa Chowdhury
              (AYE-2026-0100)" set in `nowrap` is very long indeed: the table
              grew past the sheet and pushed Debit and Credit off the right-hand
              edge, where the sheet's own `overflow: hidden` cut them off. The
              amounts were not missing — they were printed off the paper.

              Fixed layout takes the widths below as final and gives whatever is
              left to Particulars, which then truncates. Money always fits;
              a long name loses its tail, which is the right way round. */}
          <table className="mt-3 w-full table-fixed border-collapse">
            {/* Repeated by the browser at the top of every printed page, so no
                column loses its name across the fold. */}
            <thead>
              <tr className="border-b border-black text-left">
                <th className="w-[4.9em] py-[2px] pl-1 pr-2 font-normal">
                  Date
                </th>
                <th className="py-[2px] pr-2 font-normal">Particulars</th>
                <th className="w-[4.4em] py-[2px] pr-2 font-normal">Vch Type</th>
                <th className="w-[3.5em] py-[2px] pr-2 text-center font-normal">
                  Vch No
                </th>
                {/* Wide enough for 15,73,200.00 and the gap after it — the
                    longest figure this book is likely to carry. */}
                <th className="w-[6.8em] py-[2px] pr-3 text-right font-normal">
                  Debit
                </th>
                <th className="w-[6.8em] py-[2px] pr-1 text-right font-normal">
                  Credit
                </th>
              </tr>
            </thead>

            <tbody>
              <tr className={rule}>
                <td className="whitespace-nowrap py-[1px] pl-1 pr-2">
                  {dayjs(query.startDate).format("D-M-YYYY")}
                </td>
                <td className="py-[2px] pr-2">
                  <span className="mr-2 inline-block w-[1.7em]">Dr</span>
                  Opening Balance
                </td>
                <td colSpan={2} />
                <td className="py-[2px] pr-3 whitespace-nowrap text-right tabular-nums">
                  {s.openingSide === "debit" && s.opening !== 0
                    ? money(s.opening)
                    : ""}
                </td>
                <td className="py-[2px] pr-1 whitespace-nowrap text-right tabular-nums">
                  {s.openingSide === "credit" && s.opening !== 0
                    ? money(-s.opening)
                    : ""}
                </td>
              </tr>

              {rows.map((r: any, i: number) => {
                const d = dayjs(r.date).format("D-M-YYYY");
                const showDate = d !== lastDate;
                lastDate = d;

                return (
                  <tr key={i} className={`${rule} align-top`}>
                    <td className="whitespace-nowrap py-[2px] pl-1 pr-2">
                      {showDate ? d : ""}
                    </td>
                    <td className="py-[1px] pr-2">
                      {/* One line, cut with an ellipsis rather than wrapped.
                          A name that wraps turns a one-line entry into three
                          and the sheet holds a quarter of what the book does. */}
                      <span className="flex gap-1">
                        <span className="w-[1.3em] shrink-0">
                          {r.debit ? "Cr" : "Dr"}
                        </span>
                        <span className="min-w-0 flex-1 truncate">
                      {r.particulars}
                      {r.party && (
                        <span>
                          {" "}
                          — {r.party}
                          {r.partyId ? ` (${r.partyId})` : ""}
                        </span>
                      )}
                        </span>
                      </span>
                      {/* The book's own sub-detail line. The system's voucher
                          number rides here too: the Vch No column is the book's
                          own count, not what is printed on the paper, and
                          losing the link to the paper would make a line
                          impossible to check. */}
                      {(r.detail || r.receiptNo) && (
                        <span className="block truncate pl-[24px] text-[7.5pt]">
                          {[withoutParty(r.detail, r.party, r.partyId), r.receiptNo]
                            .filter(Boolean)
                            .join("   ")}
                        </span>
                      )}
                    </td>
                    <td className="py-[1px] pr-2">{r.voucherType}</td>
                    <td className="py-[1px] pr-2 text-center">{r.voucherNo}</td>
                    <td className="py-[1px] pr-3 whitespace-nowrap text-right tabular-nums">
                      {r.debit ? money(r.debit) : ""}
                    </td>
                    <td className="py-[1px] pr-1 whitespace-nowrap text-right tabular-nums">
                      {r.credit ? money(r.credit) : ""}
                    </td>
                  </tr>
                );
              })}

              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center">
                    No entries in this period
                  </td>
                </tr>
              )}

              {/* The closing block. Marked so the browser keeps it together —
                  a balance separated from the totals it has to agree with is
                  the one break that would actually mislead. */}
              <tr className="ledger-keep">
                <td colSpan={4} />
                <td className="border-t border-black py-[2px] pr-3 whitespace-nowrap text-right tabular-nums">
                  {money(
                    (s.openingSide === "debit" ? s.opening : 0) + s.debitTotal,
                  )}
                </td>
                <td className="border-t border-black py-[2px] pr-1 whitespace-nowrap text-right tabular-nums">
                  {money(
                    (s.openingSide === "credit" ? -s.opening : 0) +
                      s.creditTotal,
                  )}
                </td>
              </tr>
              <tr className="ledger-keep">
                <td />
                <td className="py-[2px] pr-2">
                  <span className="mr-2 inline-block w-[1.7em]">Cr</span>
                  <span className="underline underline-offset-2">
                    Closing Balance
                  </span>
                </td>
                <td colSpan={2} />
                <td className="py-[2px] pr-3 whitespace-nowrap text-right tabular-nums">
                  {s.closingSide === "debit" ? money(-s.closing) : ""}
                </td>
                <td className="py-[2px] pr-1 whitespace-nowrap text-right tabular-nums">
                  {s.closingSide === "credit" ? money(s.closing) : ""}
                </td>
              </tr>
              {/* The two figures that have to be the same one. */}
              <tr className="ledger-keep font-semibold">
                <td colSpan={4} />
                <td className="border-y border-black py-[2px] pr-3 whitespace-nowrap text-right tabular-nums">
                  {money(s.grandDebit)}
                </td>
                <td className="border-y border-black py-[2px] pr-1 whitespace-nowrap text-right tabular-nums">
                  {money(s.grandCredit)}
                </td>
              </tr>
            </tbody>
          </table>

          {Math.abs(s.grandDebit - s.grandCredit) > 0.01 && (
            <p className="mt-2 text-center text-[10pt] font-bold text-red-600">
              The two columns do not agree — difference{" "}
              {money(Math.abs(s.grandDebit - s.grandCredit))}
            </p>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default CashBookReport;
