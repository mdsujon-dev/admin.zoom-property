import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { format } from "date-fns";
import React, { useState } from "react";
import { FiEye, FiMail, FiSearch, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import PageHeader from "../../components/Common/PageHeader";
import PageMeta from "../../components/Common/PageMeta";
import PermissionGate from "../../components/Common/PermissionGate";
import SendQuotationEmailModal from "../../components/modal/inquiries/SendQuotationEmailModal";
import ViewQuotationModal, {
  QuotationRequestMessage,
} from "../../components/modal/inquiries/ViewQuotationModal";
import DateTimeStacked from "../../components/shared/DateTimeStacked";
import DataTable from "../../components/Table/DataTable";
import {
  useAllQuotationMessagesQuery,
  useDeleteQuotationMessageMutation,
  useLazyAllQuotationMessagesQuery,
} from "../../redux/features/inquiries/inquiriesApi";
import ExportMenu from "../../components/Common/ExportMenu";
import { makeSheet } from "../../utils/tableExport";

const { confirm } = Modal;

const QuotationRequests: React.FC = () => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] =
    useState<QuotationRequestMessage | null>(null);
  // Per-row delete loading so only the targeted row's button spins.
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading, isFetching } = useAllQuotationMessagesQuery([
    { name: "limit", value: limit },
    { name: "page", value: page },
    { name: "search", value: search },
  ]);
  const [deleteQuotationMessage] = useDeleteQuotationMessageMutation();
  const [fetchAllQuotations] = useLazyAllQuotationMessagesQuery();

  const buildSheet = async () => {
    const all = await fetchAllQuotations([
      { name: "limit", value: 10000 },
      { name: "page", value: 1 },
      { name: "search", value: search },
    ]).unwrap();

    return makeSheet({
      title: "Quotation Requests",
      unit: "request",
      filters: [search && `Search: "${search}"`],
      headers: [
        "Created",
        "Name",
        "Email",
        "Phone",
        "Service",
        "Budget",
        "Delivery",
        "Website",
      ],
      rows: all?.data?.data || [],
      cells: (q: any) => [
        q.createdAt
          ? format(new Date(q.createdAt), "dd MMM yyyy, h:mm a")
          : "—",
        q.name || "—",
        q.email || "—",
        q.phone || "—",
        q.service || "—",
        q.budget || "—",
        q.delivery_time || "—",
        q.site_url || "—",
      ],
    });
  };

  const handlePreview = (record: QuotationRequestMessage) => {
    setSelectedMessage(record);
    setIsPreviewModalOpen(true);
  };

  const handleSendEmail = (record: QuotationRequestMessage) => {
    setSelectedMessage(record);
    setIsEmailModalOpen(true);
  };

  const handleDelete = (id: string) => {
    confirm({
      title: "Delete this quotation request?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        setDeletingId(id);
        try {
          const res: any = await deleteQuotationMessage(id).unwrap();
          if (res?.success) toast.success(res?.message || "Quotation deleted");
        } catch (err: any) {
          toast.error(err?.data?.message || "Failed to delete");
        } finally {
          setDeletingId(null);
        }
      },
    });
  };

  const columns: ColumnsType<QuotationRequestMessage> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
    },
    {
      title: "Budget",
      dataIndex: "budget",
      key: "budget",
    },
    {
      title: "Delivery Time",
      dataIndex: "delivery_time",
      key: "delivery_time",
    },
    {
      title: "Website",
      dataIndex: "site_url",
      key: "site_url",
      render: (url?: string) =>
        url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        ) : (
          "-"
        ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      sorter: true,
      render: (val: string) => <DateTimeStacked value={val} />,
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button icon={<FiEye />} onClick={() => handlePreview(record)} />
          <Button
            icon={<FiMail />}
            type="primary"
            onClick={() => handleSendEmail(record)}
            title="Send email"
          />
          <PermissionGate module="Quotation Requests" action="Delete">
            <Button
              icon={<FiTrash2 />}
              danger
              loading={deletingId === record._id}
              disabled={deletingId === record._id}
              onClick={() => handleDelete(record._id)}
            />
          </PermissionGate>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageMeta
        title="Quotation Requests - Zoom Property Admin"
        description="Manage quotation requests and service inquiries from potential leads."
        keywords="quotations, requests, inquiries, Zoom Property"
        canonicalUrl={`${window.location.origin}/inquiries/quotation-request`}
        noindex={true}
        nofollow={true}
      />
      <PageHeader
        title="Quotation Request Messages"
        subtitle="List of all quotation request messages"
        breadcrumbs={[
          { title: "Dashboard", path: "/" },
          { title: "Inquiries" },
          { title: "Quotation Request Messages" },
        ]}
        // Was a primary button that did nothing at all when clicked.
        extra={
          <ExportMenu
            label="Export Messages"
            sheet={buildSheet}
            disabled={(data?.data?.meta?.total || 0) === 0}
          />
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 flex-1 mb-3">
        <Input
          placeholder="Search messages..."
          prefix={<FiSearch />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <DataTable
        loading={isFetching || isLoading}
        columns={columns}
        data={data?.data?.data || []}
        rowKey="_id"
        limit={limit}
        setLimit={setLimit}
        setCurrentPage={setPage}
        isPaginate={true}
        total={data?.data?.meta?.total || 0}
      />

      <ViewQuotationModal
        open={isPreviewModalOpen}
        setOpen={setIsPreviewModalOpen}
        data={selectedMessage}
      />

      <SendQuotationEmailModal
        open={isEmailModalOpen}
        setOpen={setIsEmailModalOpen}
        recipient={selectedMessage}
      />
    </div>
  );
};

export default QuotationRequests;
