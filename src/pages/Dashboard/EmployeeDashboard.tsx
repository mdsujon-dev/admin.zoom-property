import { motion } from "framer-motion";
import {
  Building2,
  FileText,
  Home,
  Mail,
} from "lucide-react";
import React from "react";
import PageMeta from "../../components/Common/PageMeta";
import { useHasPermission } from "../../hooks/useHasPermission";
import { useCompanyOverviewQuery } from "../../redux/features/dashboard/dashboardApi";
import { Metric } from "./components/DashboardKit";
import { riseIn } from "./components/dashboardMotion";
import ListingTrendChart from "./components/ListingTrendChart";
import EnquiriesTrendChart from "./components/EnquiriesTrendChart";
import RecentLogsTable from "./components/RecentLogsTable";
import WelcomeDashboard from "./components/WelcomeDashboard";
import brand from "../../theme/brand";

const EmployeeDashboard: React.FC = () => {
  const canListings = useHasPermission("Listings Summary", "View");
  const canProjects = useHasPermission("Projects Summary", "View");
  const canEnquiries = useHasPermission("Enquiries Summary", "View");
  const canContent = useHasPermission("Content Summary", "View");
  const canTrend = useHasPermission("Listing Trend", "View");
  // Assuming if they can view the dashboard, they might have permission to see logs, or we can just show it.
  // We'll show the table if they have any KPI.
  
  const hasAnyKpi = canListings || canProjects || canEnquiries || canContent;
  const hasAnything = hasAnyKpi || canTrend;

  const { data: overview, isFetching } = useCompanyOverviewQuery(undefined, {
    skip: !hasAnything,
  });

  if (!hasAnything) {
    return (
      <div className="space-y-4">
        <PageMeta
          title="Dashboard · Zoom Property Admin"
          description="Welcome to the Zoom Property admin panel."
          canonicalUrl={window.location.origin}
        />
        <WelcomeDashboard />
      </div>
    );
  }

  const listings = overview?.listings;
  const enquiries = overview?.enquiries;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      className="space-y-4"
    >
      <PageMeta
        title="Dashboard · Zoom Property Admin"
        description="Zoom Property admin dashboard — the agency at a glance."
        canonicalUrl={window.location.origin}
      />

      {hasAnyKpi && (
        <motion.div
          variants={riseIn}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {canListings && (
            <Metric
              label="Live listings"
              value={listings?.available ?? 0}
              hint={`${listings?.reserved ?? 0} reserved · ${
                listings?.draft ?? 0
              } draft`}
              icon={Home}
              accent={brand.primary}
              loading={isFetching}
            />
          )}

          {canProjects && (
            <Metric
              label="Projects"
              value={overview?.projects?.active ?? 0}
              hint={`${overview?.projects?.completed ?? 0} completed`}
              icon={Building2}
              accent="#0891b2"
              loading={isFetching}
            />
          )}
          {canEnquiries && (
            <Metric
              label="Enquiries"
              value={enquiries?.total ?? 0}
              hint={`${enquiries?.contact ?? 0} messages · ${
                enquiries?.quotations ?? 0
              } quotation requests`}
              icon={Mail}
              accent={brand.secondary}
              loading={isFetching}
            />
          )}
          {canContent && (
            <Metric
              label="Articles"
              value={overview?.content?.published ?? 0}
              hint={`${overview?.content?.drafts ?? 0} draft · ${
                overview?.content?.pendingReviews ?? 0
              } review${
                (overview?.content?.pendingReviews ?? 0) === 1 ? "" : "s"
              } awaiting approval`}
              icon={FileText}
              accent="#059669"
              loading={isFetching}
            />
          )}
        </motion.div>
      )}

      {(canTrend || canEnquiries) && (
        <motion.div variants={riseIn} className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {canTrend && (
            <ListingTrendChart
              data={overview?.trend ?? []}
              loading={isFetching}
            />
          )}
          {canEnquiries && (
            <EnquiriesTrendChart
              data={enquiries?.trend ?? []}
              loading={isFetching}
            />
          )}
        </motion.div>
      )}

      <motion.div variants={riseIn}>
        <RecentLogsTable />
      </motion.div>
    </motion.div>
  );
};

export default EmployeeDashboard;
