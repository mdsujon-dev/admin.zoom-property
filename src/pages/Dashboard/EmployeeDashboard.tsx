import { motion } from "framer-motion";
import {
  Banknote,
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
import WelcomeDashboard from "./components/WelcomeDashboard";

const EmployeeDashboard: React.FC = () => {
  const canListings = useHasPermission("Listings Summary", "View");
  const canProjects = useHasPermission("Projects Summary", "View");
  const canEnquiries = useHasPermission("Enquiries Summary", "View");
  const canContent = useHasPermission("Content Summary", "View");
  const canTrend = useHasPermission("Listing Trend", "View");

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
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
        >
          {canListings && (
            <Metric
              label="Live listings"
              value={listings?.available ?? 0}
              hint={`${listings?.reserved ?? 0} reserved · ${
                listings?.draft ?? 0
              } draft`}
              icon={Home}
              accent="#133050"
              loading={isFetching}
            />
          )}
          {canListings && (
            <Metric
              label="Sold / let"
              value={(listings?.sold ?? 0) + (listings?.rented ?? 0)}
              hint={`${listings?.sold ?? 0} sold · ${
                listings?.rented ?? 0
              } let`}
              icon={Banknote}
              accent="#2867a0"
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
              value={overview?.enquiries?.total ?? 0}
              hint={`${overview?.enquiries?.contact ?? 0} messages · ${
                overview?.enquiries?.quotations ?? 0
              } quotation requests`}
              icon={Mail}
              accent="#f59e0b"
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

      {canTrend && (
        <motion.div variants={riseIn} className="grid gap-4">
          <ListingTrendChart
            data={overview?.trend ?? []}
            loading={isFetching}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmployeeDashboard;
