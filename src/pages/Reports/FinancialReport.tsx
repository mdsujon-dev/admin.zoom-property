import { useState } from "react";
import dayjs from "dayjs";
import { ArrowDownCircle, ArrowUpCircle, Banknote, Wallet } from "lucide-react";

import { Money } from "../../components/shared/Money";
import {
  useFinancialReportQuery,
  type ReportQuery,
} from "../../redux/features/report/reportApi";
import ReportShell from "./ReportShell";

/** FR-2.8.2 — income, expense, net and what is still owed. */
const FinancialReport = ({
  query,
  rangeLabel,
}: {
  query: ReportQuery;
  rangeLabel: string;
}) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isFetching } = useFinancialReportQuery({
    ...query,
    page,
    limit,
  });
  const summary = data?.summary;
  const rows = data?.rows || [];
  const allRows = data?.allRows || rows;
  const meta = data?.meta;
  const net = summary?.net ?? 0;

  return (
    <ReportShell
      title="Financial report"
      subtitle={
        summary?.refunded
          ? `Includes ${summary.refunded.toLocaleString("en-BD")} refunded`
          : undefined
      }
      rangeLabel={rangeLabel}
      loading={isFetching}
      emptyHint="No income or expense was recorded in this range."
      stats={[
        {
          label: "Income",
          value: <Money value={summary?.income ?? 0} />,
          tone: "green",
          icon: ArrowDownCircle,
        },
        {
          label: "Expense",
          value: <Money value={summary?.expense ?? 0} />,
          tone: "red",
          icon: ArrowUpCircle,
        },
        {
          label: net >= 0 ? "Net profit" : "Net loss",
          value: <Money value={Math.abs(net)} />,
          tone: net >= 0 ? "green" : "red",
          hint: "Income − Expense, refunds netted off",
          icon: Banknote,
        },
        {
          label: "Outstanding due",
          value: <Money value={summary?.outstandingDue ?? 0} />,
          tone: "amber",
          // Deliberately not range-scoped — what is owed is owed today.
          hint: "Unpaid across every live enrolment",
          icon: Wallet,
        },
      ]}
      rows={rows}
      allRows={allRows}
      meta={meta}
      page={page}
      setPage={setPage}
      limit={limit}
      setLimit={setLimit}
      columns={[
        {
          title: "Date",
          width: 130,
          value: (r: any) => (r.date ? dayjs(r.date).format("DD MMM YYYY") : "—"),
        },
        {
          title: "Type",
          width: 110,
          render: (r: any) => (
            <span
              className={`text-xs font-semibold capitalize ${
                r.type === "income" ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {r.type}
              {r.isRefund ? " ↩" : ""}
            </span>
          ),
          value: (r: any) => `${r.type}${r.isRefund ? " (refund)" : ""}`,
        },
        { title: "Reason", value: (r: any) => r.reason || "—" },
        { title: "Client", width: 150, value: (r: any) => r.client || "—" },
        { title: "Added by", width: 140, value: (r: any) => r.addedBy || "—" },
        {
          title: "Amount",
          width: 130,
          align: "right",
          render: (r: any) => {
            // A refund flips the sign it is shown with, exactly as the ledger
            // page shows it, so the two cannot be read as disagreeing.
            const positive = (r.type === "income") !== r.isRefund;
            return (
              <span
                className={`font-semibold ${
                  positive ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {positive ? "+" : "−"} <Money value={r.amount} />
              </span>
            );
          },
          value: (r: any) => {
            const positive = (r.type === "income") !== r.isRefund;
            return `${positive ? "+" : "−"} ${Number(
              r.amount || 0
            ).toLocaleString("en-BD")}`;
          },
        },
      ]}
    />
  );
};

export default FinancialReport;
