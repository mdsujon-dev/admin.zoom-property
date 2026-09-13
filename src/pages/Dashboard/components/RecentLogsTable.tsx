import { Tag } from "antd";
import dayjs from "dayjs";
import React from "react";
import { useActionLogsQuery } from "../../../redux/features/actionLog/actionLogApi";
import DataTable from "../../../components/Table/DataTable";

const methodColors: Record<string, string> = {
  GET: "blue",
  POST: "green",
  PUT: "orange",
  PATCH: "gold",
  DELETE: "red",
};

const RecentLogsTable: React.FC = () => {
  // Fetch the 5 most recent logs
  const { data: logsRes, isFetching } = useActionLogsQuery([{ name: "limit", value: 6 }]);

  const logs = logsRes?.data?.data || logsRes?.data || [];
  
  // Safeguard if logs is not an array for some reason
  const safeLogs = Array.isArray(logs) ? logs : [];

  const columns = [
    {
      title: "Time",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (val: string) => (
        <span className="text-xs text-secondary-500 whitespace-nowrap">
          {val ? dayjs(val).format("DD MMM YYYY, HH:mm") : "-"}
        </span>
      ),
      width: 150,
    },
    {
      title: "User",
      dataIndex: "email",
      key: "email",
      render: (email: string, record: any) => (
        <div>
          <div className="text-sm font-medium text-secondary-900">{email}</div>
          <div className="text-xs text-secondary-500 capitalize">{record.role || "Unknown Role"}</div>
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (action: string) => (
        <span className="text-sm font-medium text-secondary-700">{action || "System Action"}</span>
      ),
    },
    {
      title: "Method",
      dataIndex: "method",
      key: "method",
      render: (method: string) => (
        <Tag color={methodColors[method] || "default"} className="font-semibold">{method || "N/A"}</Tag>
      ),
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "responseStatusCode",
      key: "status",
      render: (status: number) => {
        if (!status) return <Tag>Unknown</Tag>;
        let color = "success";
        if (status >= 400 && status < 500) color = "warning";
        if (status >= 500) color = "error";
        return <Tag color={color}>{status}</Tag>;
      },
      width: 100,
    },
  ];

  return (
    <div className="mt-6">
      <div className="mb-4 px-1">
        <h3 className="text-lg font-semibold text-secondary-900">Recent Action Logs</h3>
        <p className="text-xs text-secondary-400 mt-1">
          Latest system activities and login events
        </p>
      </div>
      <DataTable
        data={safeLogs}
        columns={columns}
        rowKey="_id"
        isPaginate={false}
        loading={isFetching}
      />
    </div>
  );
};

export default RecentLogsTable;
