import PageHeader from "../../components/Common/PageHeader";
import PageMeta from "../../components/Common/PageMeta";

const Reports = () => {
  return (
    <div>
      <PageMeta title="Reports · Zoom Property Admin" noindex />
      <PageHeader
        title="Reports"
        subtitle="Operational and system analytics"
        breadcrumbs={[
          { title: "Dashboard", path: "/" },
          { title: "Reports" },
        ]}
      />
      <div className="rounded-xl border border-secondary-100 bg-white px-5 py-12 text-center shadow-[0_1px_2px_rgba(16,24,40,.04)]">
        <p className="text-sm font-medium text-secondary-600">
          No financial reports are active.
        </p>
        <p className="mt-1 text-xs text-secondary-400">
          Use the Dashboard or Action Logs to view property analytics and audit logs.
        </p>
      </div>
    </div>
  );
};

export default Reports;
