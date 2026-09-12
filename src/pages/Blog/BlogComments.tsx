import { Button, Modal, Space, Tag, Tooltip, Typography } from "antd";
import dayjs from "dayjs";
import { Check, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

import PageHeader from "../../components/Common/PageHeader";
import PageMeta from "../../components/Common/PageMeta";
import PermissionGate from "../../components/Common/PermissionGate";
import DataTable from "../../components/Table/DataTable";
import {
  useDeleteBlogCommentMutation,
  useGetBlogCommentsQuery,
  useUpdateBlogCommentStatusMutation,
} from "../../redux/features/blog/blogApi";

const { confirm } = Modal;
const { Text } = Typography;

const BlogComments = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const { data, isFetching } = useGetBlogCommentsQuery({
    page,
    limit,
  });
  const [updateStatus] = useUpdateBlogCommentStatusMutation();
  const [deleteComment] = useDeleteBlogCommentMutation();
  const [busyId, setBusyId] = useState<string | null>(null);

  const rows = data?.result ?? [];
  const total = data?.meta?.total ?? 0;

  const onDelete = (id: string, name: string) =>
    confirm({
      title: "Delete this comment?",
      content: `The comment from "${name}" will be permanently deleted.`,
      okText: "Yes, delete",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteComment(id).unwrap();
          toast.success("Comment deleted");
        } catch (e: any) {
          toast.error(e?.data?.message || "Could not delete the comment");
        }
      },
    });

  const onUpdateStatus = async (id: string, newStatus: string) => {
    setBusyId(id);
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success(`Comment ${newStatus}`);
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not update status");
    } finally {
      setBusyId(null);
    }
  };

  const columns = [
    {
      title: "Commenter",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (name: string, r: any) => (
        <div className="min-w-0">
          <p className="font-medium text-secondary-800">{name}</p>
          <p className="text-xs text-secondary-500">{r.email}</p>
        </div>
      ),
    },
    {
      title: "Comment",
      dataIndex: "content",
      key: "content",
      width: 350,
      render: (content: string) => (
        <Tooltip title={content}>
          <div className="max-w-sm">
            <Text ellipsis className="text-secondary-600 w-full block">
              {content}
            </Text>
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Article",
      dataIndex: "post",
      key: "post",
      width: 200,
      render: (post: any) => (
        <Text ellipsis className="w-full block text-secondary-600">
          {post?.title || "Unknown Article"}
        </Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => {
        let color = "default";
        if (status === "approved") color = "green";
        if (status === "pending") color = "gold";
        if (status === "rejected") color = "red";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 130,
      render: (d: string) => (d ? dayjs(d).format("DD MMM YYYY") : "—"),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right" as const,
      width: 150,
      render: (_: unknown, r: any) => (
        <Space>
          <PermissionGate module="Blog" action="Update">
            {r.status !== "approved" && (
              <Tooltip title="Approve">
                <Button
                  icon={<Check className="h-4 w-4" />}
                  type="primary"
                  ghost
                  loading={busyId === r._id}
                  onClick={() => onUpdateStatus(r._id, "approved")}
                />
              </Tooltip>
            )}
            {r.status !== "rejected" && (
              <Tooltip title="Reject">
                <Button
                  icon={<X className="h-4 w-4" />}
                  danger
                  ghost
                  loading={busyId === r._id}
                  onClick={() => onUpdateStatus(r._id, "rejected")}
                />
              </Tooltip>
            )}
          </PermissionGate>
          <PermissionGate module="Blog" action="Delete">
            <Tooltip title="Delete">
              <Button
                danger
                icon={<Trash2 className="h-4 w-4" />}
                onClick={() => onDelete(r._id, r.name)}
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
        title="Blog Comments · Zoom Property Admin"
        description="Manage comments on blog articles."
        noindex
      />
      <PageHeader
        title="Blog Comments"
        subtitle="Manage comments submitted by readers on your articles."
        breadcrumbs={[{ title: "Dashboard", path: "/" }, { title: "Blog" }, { title: "Comments" }]}
      />

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
    </div>
  );
};

export default BlogComments;
