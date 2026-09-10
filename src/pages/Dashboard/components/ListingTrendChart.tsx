import dayjs from "dayjs";
import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const BRAND = "#4b802d";

/**
 * Listings taken on per month, last six.
 *
 * An area rather than bars: new instructions are a rate over time, and the
 * shape of the run matters more than any single month's exact height. The
 * server fills empty months in, so a quiet April is a dip in the line rather
 * than a gap that reads as a rise.
 */
const ListingTrendChart: React.FC<{
  data: { month: string; listings: number }[];
  loading?: boolean;
}> = ({ data, loading }) => {
  const points = (data || []).map((d) => ({
    ...d,
    label: d.month ? dayjs(`${d.month}-01`).format("MMM") : "",
  }));

  const total = points.reduce((sum, p) => sum + p.listings, 0);

  return (
    <div className="rounded-xl border border-secondary-100 bg-white p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-secondary-900">
            New listings
          </h3>
          <p className="text-xs text-secondary-400">
            Taken on · last six months
          </p>
        </div>
        <span className="rounded-lg bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary">
          {total} in total
        </span>
      </div>

      {loading ? (
        <div className="h-[260px] animate-pulse rounded-xl bg-secondary-50" />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart
            data={points}
            margin={{ top: 6, right: 8, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="listingFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={BRAND} stopOpacity={0.22} />
                <stop offset="100%" stopColor={BRAND} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ stroke: "#cbd5e1", strokeDasharray: "3 3" }}
              contentStyle={{
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                fontSize: 12,
              }}
              formatter={(v: number) => [v, "Listings"]}
            />
            <Area
              type="monotone"
              dataKey="listings"
              stroke={BRAND}
              strokeWidth={2.5}
              fill="url(#listingFill)"
              dot={{ r: 3, fill: BRAND, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ListingTrendChart;
