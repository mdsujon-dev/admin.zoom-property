import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EnquiryPoint } from "./analytics";
import { SERIES } from "./constants";

interface Props {
  data: EnquiryPoint[];
  loading?: boolean;
}

/** Daily contact messages (leads) vs quotation requests (leads), last 14 days. */
const EnquiriesTrendChart: React.FC<Props> = ({ data, loading }) => (
  <div className="rounded-xl border border-secondary-100 bg-white p-6 lg:col-span-2">
    <div className="mb-5 flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-secondary-900">
          Lead Enquiries
        </h3>
        <p className="text-xs text-secondary-400">
          Contact messages vs quotation requests · last 14 days
        </p>
      </div>
    </div>

    {loading ? (
      <div className="h-[300px] animate-pulse rounded-xl bg-secondary-50" />
    ) : (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 6, right: 8, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="grad-leads" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SERIES.leads} stopOpacity={0.28} />
              <stop offset="100%" stopColor={SERIES.leads} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="grad-quotations" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SERIES.quotations} stopOpacity={0.28} />
              <stop offset="100%" stopColor={SERIES.quotations} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            width={32}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              fontSize: 12,
              boxShadow: "0 8px 24px -8px rgba(16,24,40,0.18)",
            }}
          />
          <Legend
            iconType="circle"
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
          />
          <Area
            type="monotone"
            name="Leads"
            dataKey="leads"
            stroke={SERIES.leads}
            strokeWidth={2.5}
            fill="url(#grad-leads)"
          />
          <Area
            type="monotone"
            name="Quotations"
            dataKey="quotations"
            stroke={SERIES.quotations}
            strokeWidth={2.5}
            fill="url(#grad-quotations)"
          />
        </AreaChart>
      </ResponsiveContainer>
    )}
  </div>
);

export default EnquiriesTrendChart;
