import { Button, Empty, Spin } from "antd";
import dayjs from "dayjs";
import { Printer } from "lucide-react";

import { COMPANY } from "../../config/company";
import { useGetCompanySettingsQuery } from "../../redux/features/company/companyApi";
import {
  ReportQuery,
  useProfitLossReportQuery,
} from "../../redux/features/report/reportApi";

const money = (n: number) =>
  Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

interface Row {
  head: string;
  amount: number;
  count: number;
  nature: "direct" | "indirect";
}

interface Props {
  query: ReportQuery;
}

/**
 * One printed line: a label, and an amount in one of the two money columns.
 *
 * No weight on it. On the sheet being copied every line of the body is set in
 * the same face — a group and the heads under it are told apart by the indent
 * and nothing else, and only the Total row is emphasised. Bolding the headings
 * looked tidier on screen and was the loudest thing separating this from the
 * page it is meant to reproduce.
 */
interface Line {
  label: string;
  /** The breakdown column — an individual head's own figure. */
  inner?: string;
  /** The outer column — a group's total, and the result. */
  outer?: string;
  indent?: boolean;
}

/**
 * The profit and loss account, cloned from the sheet the company prints today.
 *
 * A T account: expenses down the left, income down the right, the result
 * written into whichever side is short, and both columns ending on the same
 * figure. That last part is the whole discipline of the form — if the two
 * totals differ the sheet is wrong on its face, which a single list with a
 * minus sign at the bottom can never show.
 *
 * ── Why one table rather than two ──────────────────────────────────────────
 *
 * The two sides must end level: a Total halfway up one column and at the foot
 * of the other reads as a mistake even when the arithmetic is right. Two tables
 * side by side line up only by luck, so both sides are rows of a single table
 * and the shorter one is padded.
 *
 * ── On the ruling ──────────────────────────────────────────────────────────
 *
 * The sheet is a ruled box, and getting that wrong is what made an earlier
 * version of this file unrecognisable beside the printed page. There is a
 * border around the whole report, a rule under the letterhead, a rule under the
 * column headings, a rule above the Total row, and one vertical rule down the
 * middle dividing the two sides. That is the complete list.
 *
 * In particular there is no rule between a Particulars column and the money
 * beside it. The two money columns of a side are one column of figures with the
 * group totals carried out to the right of their members — ruling between them
 * would claim they are separate quantities, and turn the sheet into a
 * spreadsheet, which is the thing an accounts sheet is trying not to be.
 */
const ProfitLossReport = ({ query }: Props) => {
  const { data, isFetching } = useProfitLossReportQuery(query);

  /* The letterhead is the office's own, not this file's.
     `config/company` is the fallback for a click that cannot wait on a fetch;
     a sheet printed from a screen can wait, and the address the office typed
     into Settings is the one that belongs on the paper. It is a textarea, so it
     arrives with its line breaks in it — printed as typed, below. */
  const { data: settings } = useGetCompanySettingsQuery();
  const name = settings?.name || COMPANY.name;
  const address = settings?.address || COMPANY.address;

  if (isFetching) {
    return (
      <div className="flex justify-center py-16">
        <Spin />
      </div>
    );
  }

  const s = data?.summary;
  if (!s) return <Empty description="Nothing to show" className="py-12" />;

  const income: Row[] = data.income || [];
  const expense: Row[] = data.expense || [];
  const profit = s.net >= 0;

  const period =
    query.startDate && query.endDate
      ? `${dayjs(query.startDate).format("D-MMM-YYYY")} to ${dayjs(query.endDate)
          .subtract(1, "day")
          .format("D-MMM-YYYY")}`
      : "All time";

  const of = (rows: Row[], nature: Row["nature"]) =>
    rows.filter((r) => r.nature === nature);
  const sum = (rows: Row[]) => rows.reduce((n, r) => n + r.amount, 0);

  /*
   * Both sides end on the larger of the two, because the result is written into
   * the short side to make up the difference.
   */
  const grand = Math.max(s.income, s.expense);

  /**
   * A heading and the heads beneath it.
   *
   * `always` is the difference between the two sides of the sheet, and it is
   * copied from the book rather than reasoned out. The expense side prints both
   * its headings whatever happened: an empty "Direct Expenses" says the
   * company ran none this period, which is a finding, and dropping the line
   * asks the reader to notice an absence — nobody notices an absence. The
   * income side prints only what was earned. A bare "Indirect Incomes" standing
   * over white space is not on the sheet being copied, and it reads as a column
   * that failed to print rather than as a nil.
   */
  const section = (label: string, rows: Row[], always = false): Line[] => {
    if (!rows.length && !always) return [];

    return [
      { label, outer: rows.length ? money(sum(rows)) : "" },
      /* By name, not by size. The service hands these over biggest-first, which
         is the right order for a screen that is asking where the money went;
         the sheet is not asking that. It is looked up — somebody has a voucher
         for Stationery in their hand and wants the line — and a list ordered by
         an amount you do not yet know is a list you have to read all of. */
      ...[...rows]
        .sort((a, b) => a.head.localeCompare(b.head))
        .map((r) => ({
          label: r.head,
          indent: true,
          inner: money(r.amount),
        })),
    ];
  };

  const left: Line[] = [
    ...section("Direct Expenses", of(expense, "direct"), true),
    ...section("Indirect Expenses", of(expense, "indirect"), true),
  ];

  const right: Line[] = [
    ...section("Direct Incomes", of(income, "direct")),
    ...section("Indirect Incomes", of(income, "indirect")),
  ];

  /*
   * The balancing figure: a profit belongs with the expenses it exceeded, a
   * loss with the income it outran.
   *
   * It is not the next line after the last head — it is the last line of the
   * column, sitting on the Total rule with the unused depth of the sheet above
   * it. That is where the book puts it and the position is the point: the
   * figure is what makes the two columns agree, so it is read against the Total
   * directly beneath it rather than trailing a list of expense heads it is not
   * one of.
   */
  const balance: Line = {
    label: profit ? "Nett Profit" : "Nett Loss",
    outer: money(Math.abs(s.net)),
  };

  /* A minimum depth so a quiet month still prints as a sheet rather than as
     four lines adrift under a letterhead. The balancing figure claims the last
     row of its own column, so that side is measured with it included. */
  const depth = Math.max(
    left.length + (profit ? 1 : 0),
    right.length + (profit ? 0 : 1),
    14,
  );

  /** The line a side shows at row `i` — its own, or the result at the foot. */
  const lineAt = (lines: Line[], carriesResult: boolean, i: number) =>
    carriesResult && i === depth - 1 ? balance : lines[i];

  /** The one vertical rule on the sheet, carried by the left side's last cell. */
  const divide = "border-r border-black";

  /**
   * One side of one row: the particular, its own figure, and the group figure.
   *
   * `divider` is passed rather than derived because the rule belongs to the
   * sheet, not to the side — it is drawn once, on the left side's outer cell,
   * and the right side's matching cell must not draw it again or the box gains
   * a second line down its right-hand edge.
   */
  const cells = (line: Line | undefined, divider = false) => (
    <>
      {/* Truncated, never wrapped — the same rule the cash book prints under.
          One head with a long name wrapping to a second line pushes every row
          after it down and the two sides stop meeting, which is visible from
          across the room; a lost tail on one name is not. The columns are cut
          so the names the company actually uses fit whole. */}
      <td
        className={`overflow-hidden text-ellipsis whitespace-nowrap py-[2px] pr-2 align-top ${
          line?.indent ? "pl-5" : "pl-2"
        }`}
      >
        {line?.label ?? ""}
      </td>
      <td className="py-[2px] pr-2 text-right align-top tabular-nums">
        {line?.inner ?? ""}
      </td>
      <td
        className={`py-[2px] pr-2 text-right align-top tabular-nums ${
          divider ? divide : ""
        }`}
      >
        {line?.outer ?? ""}
      </td>
    </>
  );

  /* Letter-spaced the way the book sets them, which is what makes "Particulars"
     and "Total" read as the sheet's own furniture rather than as more entries. */
  const spaced = "tracking-[0.18em]";

  return (
    <div>
      <div className="mb-3 flex justify-end print:hidden">
        <Button
          icon={<Printer className="h-4 w-4" />}
          onClick={() => window.print()}
        >
          Print
        </Button>
      </div>

      {/* See the cash book: `ledger-print` is what survives the print
          stylesheet's blanket hide. Serif, for the reason the cash book is
          serif — the two are the same book printed on the same afternoon, and a
          sheet set in the app's screen face does not file with the others. */}
      {/* 8.5pt, not the cash book's 9. The sheet has to carry two Particulars
          columns where the cash book carries one, so a head name has barely
          half the width to fit in — at 9pt the longer ones ran out of column.
          A P&L is a page of headings, not a page of entries; the half point
          buys the names their room and costs nothing in depth. */}
      <div className="ledger-print ledger-page mx-auto w-full max-w-[210mm] bg-white px-[8mm] py-[10mm] font-serif text-[8.5pt] leading-[1.3] text-black [&_*]:!text-black print:max-w-none">
        {/* The box. Everything the report says is inside it, letterhead
            included — on the printed sheet the company's name is part of the
            document rather than a caption sitting above one. */}
        <div className="border border-black">
          <div className="relative border-b border-black px-2 py-1.5 text-center">
            <p className="absolute right-2 top-1.5 text-[7.5pt]">
              Printed on {dayjs().format("D-MMM-YYYY [at] HH mm")}
            </p>
            <h2 className="text-[12.5pt] font-bold">{name}</h2>
            {/* As the office typed it: the settings field is two rows, and two
                lines there print as two lines here. */}
            <p className="whitespace-pre-line text-[8.5pt] leading-[1.25]">
              {address}
            </p>
            <h3 className="mt-1.5 text-[11pt] font-bold">
              Profit &amp; Loss A/c
            </h3>
            <p className="text-[8.5pt]">{period}</p>
          </div>

          {/* Both sides are the same three columns: the particular, the head's
              own figure, and the group total carried out to the edge. Measured
              off the printed sheet — the group totals sit hard against the
              middle rule and the right-hand border, the members a clear step
              inside them. */}
          <table className="w-full table-fixed border-collapse">
            {/* Measured off the printed sheet rather than chosen: on it a
                head's own figure ends a third of the way across the page and a
                group total ends just shy of the halfway rule, which is what
                puts the two money columns where the eye already expects them.
                25/10/15 per side reproduces that. */}
            <colgroup>
              <col className="w-[25%]" />
              <col className="w-[10%]" />
              <col className="w-[15%]" />
              <col className="w-[25%]" />
              <col className="w-[10%]" />
              <col className="w-[15%]" />
            </colgroup>

            <thead>
              <tr className="text-left align-bottom">
                <th
                  className={`border-b border-black py-1 pl-2 font-normal ${spaced}`}
                >
                  Particulars
                </th>
                <th
                  colSpan={2}
                  className={`border-b border-black py-1 pr-2 text-right text-[8pt] font-normal ${divide}`}
                >
                  {period}
                </th>
                <th
                  className={`border-b border-black py-1 pl-2 font-normal ${spaced}`}
                >
                  Particulars
                </th>
                <th
                  colSpan={2}
                  className="border-b border-black py-1 pr-2 text-right text-[8pt] font-normal"
                >
                  {period}
                </th>
              </tr>
            </thead>

            <tbody>
              {Array.from({ length: depth }).map((_, i) => (
                <tr key={i}>
                  {cells(lineAt(left, profit, i), true)}
                  {cells(lineAt(right, !profit, i))}
                </tr>
              ))}

              {/* Ruled above only. The line under it is the bottom of the box,
                  which is where the sheet ends — a border of its own here would
                  print two rules a hair apart. */}
              <tr className="font-bold">
                <td className={`border-t border-black py-1 pl-2 pr-2 ${spaced}`}>
                  Total
                </td>
                <td className="border-t border-black" />
                <td
                  className={`border-t border-black py-1 pr-2 text-right tabular-nums ${divide}`}
                >
                  {money(grand)}
                </td>
                <td className={`border-t border-black py-1 pl-2 pr-2 ${spaced}`}>
                  Total
                </td>
                <td className="border-t border-black" />
                <td className="border-t border-black py-1 pr-2 text-right tabular-nums">
                  {money(grand)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProfitLossReport;
