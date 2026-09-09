import { Avatar, Button, Input, Modal, Rate, Space, Switch, Tag, Tooltip } from "antd";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

import PageHeader from "../../components/Common/PageHeader";
import PageMeta from "../../components/Common/PageMeta";
import PermissionGate from "../../components/Common/PermissionGate";
import DataTable from "../../components/Table/DataTable";
import { config } from "../../config";
import {
  useDeleteReviewMutation,
  useGetReviewsQuery,
  useToggleReviewPublishedMutation,
} from "../../redux/features/review/reviewApi";
import ReviewModal from "./ReviewModal";

const { confirm } = Modal;

const src = (key?: string) =>
  key ? (key.startsWith("http") ? key : `${config.image_access_url}${key}`) : "";

/**
 * Client reviews, and the one switch that puts them on the site.
 *
 * Publishing is its own column rather than a field inside the form: deciding a
 * quote goes on the website is a different act from typing it in, and the log
 * records who did it.
 */
const Reviews = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const { data, isFetching } = useGetReviewsQuery({
    page,
    limit,
    searchTerm: search || undefined,
  });
  const [togglePublished] = useToggleReviewPublishedMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const rows = data?.result ?? [];
  const total = data?.meta?.total ?? 0;

  const onPublish = async (id: string) => {
    setBusyId(id);
    try {
      const res: any = await togglePublished(id).unwrap();
      toast.success(res?.message || "Saved");
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not update the review");
    } finally {
      setBusyId(null);
    }
  };

  const onDelete = (id: string, name: string) =>
    confirm({
      title: "Delete this review?",
      content: `${name}'s review will be removed.`,
      okText: "Yes, delete",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteReview(id).unwrap();
          toast.success("Review deleted");
        } catch (e: any) {
          toast.error(e?.data?.message || "Could not delete the review");
        }
      },
    });

  const columns = [
    {
      title: "Client",
      dataIndex: "clientName",
      key: "clientName",
      width: 220,
      render: (name: string, r: any) => (
        <div className="flex items-center gap-3">
          <Avatar src={src(r.photo?.key)} size={36}>
            {name?.[0]}
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium text-secondary-800">{name}</p>
            <p className="truncate text-xs text-secondary-500">{r.role || "—"}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Quote",
      dataIndex: "quote",
      key: "quote",
      render: (quote: string) => (
        <p className="line-clamp-2 text-sm text-secondary-600">{quote}</p>
      ),
    },
    {
      title: "Property",
      dataIndex: "property",
      key: "property",
      width: 180,
      render: (p: any, r: any) =>
        p?.title || r.propertyLabel || <span className="text-secondary-300">—</span>,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      width: 130,
      render: (v: number) => <Rate disabled value={v} className="!text-sm" />,
    },
    {
      title: "On the site",
      dataIndex: "isPublished",
      key: "isPublished",
      width: 130,
      render: (published: boolean, r: any) => (
        <Space size={4}>
          <PermissionGate
            module="Reviews"
            action="Update"
            fallback={<Tag>{published ? "Live" : "Held"}</Tag>}
          >
            <Switch
              size="small"
              checked={published}
              loading={busyId === r._id}
              onChange={() => onPublish(r._id)}
            />
          </PermissionGate>
          {r.featured && <Tag color="gold">Featured</Tag>}
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right" as const,
      width: 120,
      render: (_: unknown, r: any) => (
        <Space>
          <PermissionGate module="Reviews" action="Update">
            <Tooltip title="Edit">
              <Button
                icon={<Edit className="h-4 w-4" />}
                onClick={() => {
                  setEditing(r);
                  setOpen(true);
                }}
              />
            </Tooltip>
          </PermissionGate>
          <PermissionGate module="Reviews" action="Delete">
            <Tooltip title="Delete">
              <Button
                danger
                icon={<Trash2 className="h-4 w-4" />}
                onClick={() => onDelete(r._id, r.clientName)}
              />
            </Tooltip>
          </PermissionGate>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageMeta
        title="Reviews · Zoom Property Admin"
        description="What clients said, and what goes on the website."
        noindex
      />
      <PageHeader
        title="Reviews"
        subtitle="What clients said, and what goes on the site"
        breadcrumbs={[{ title: "Dashboard", path: "/" }, { title: "Reviews" }]}
        extra={
          <PermissionGate module="Reviews" action="Create">
            <Button
              type="primary"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
            >
              Add review
            </Button>
          </PermissionGate>
        }
      />

      <div className="mb-6">
        <Input
          allowClear
          placeholder="Search by client, quote or property"
          prefix={<Search className="h-4 w-4 text-gray-400" />}
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="max-w-sm"
        />
      </div>

      <DataTable
        data={rows}
        columns={columns as any}
        currentPage={page}
        setCurrentPage={setPage}
        limit={limit}
        setLimit={setLimit}
        total={total}
        isPaginate={total > limit}
        loading={isFetching}
        rowKey="_id"
      />

      <ReviewModal
        open={open}
        review={editing}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
      />
    </div>
  );
};

export default Reviews;
