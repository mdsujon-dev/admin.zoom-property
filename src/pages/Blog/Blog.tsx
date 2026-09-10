import { Button, Input, Modal, Select, Space, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import { Edit, Plus, Search, Tags, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

import PageHeader from "../../components/Common/PageHeader";
import PageMeta from "../../components/Common/PageMeta";
import PermissionGate from "../../components/Common/PermissionGate";
import DataTable from "../../components/Table/DataTable";
import {
  useDeletePostMutation,
  useGetBlogCategoriesQuery,
  useGetPostsQuery,
} from "../../redux/features/blog/blogApi";
import BlogCategoriesModal from "./BlogCategoriesModal";
import { useNavigate } from "react-router-dom";

const { confirm } = Modal;

const Blog = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>();
  const [category, setCategory] = useState<string | undefined>();
  const navigate = useNavigate();
  const [catsOpen, setCatsOpen] = useState(false);

  const { data, isFetching } = useGetPostsQuery({
    page,
    limit,
    searchTerm: search || undefined,
    status,
    category,
  });
  const { data: categories = [] } = useGetBlogCategoriesQuery({});
  const [deletePost] = useDeletePostMutation();

  const rows = data?.result ?? [];
  const total = data?.meta?.total ?? 0;

  const onDelete = (id: string, title: string) =>
    confirm({
      title: "Delete this article?",
      content: `"${title}" will be taken off the site.`,
      okText: "Yes, delete",
      okType: "danger",
      onOk: async () => {
        try {
          await deletePost(id).unwrap();
          toast.success("Article deleted");
        } catch (e: any) {
          toast.error(e?.data?.message || "Could not delete the article");
        }
      },
    });

  const columns = [
    {
      title: "Article",
      dataIndex: "title",
      key: "title",
      render: (title: string, r: any) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-secondary-800">{title}</p>
          <p className="truncate text-xs text-secondary-500">
            {r.author?.name || "—"}
            {r.readMinutes ? ` · ${r.readMinutes} min read` : ""}
          </p>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 150,
      render: (c: any) => (c?.name ? <Tag>{c.name}</Tag> : "—"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (s: string, r: any) => (
        <Space size={4}>
          <Tag color={s === "published" ? "green" : "default"}>{s}</Tag>
          {r.featured && <Tag color="gold">Featured</Tag>}
        </Space>
      ),
    },
    {
      title: "Published",
      dataIndex: "publishedAt",
      key: "publishedAt",
      width: 130,
      render: (d: string) => (d ? dayjs(d).format("DD MMM YYYY") : "—"),
    },
    {
      title: "Views",
      dataIndex: "views",
      key: "views",
      width: 90,
      align: "center" as const,
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right" as const,
      width: 120,
      render: (_: unknown, r: any) => (
        <Space>
          <PermissionGate module="Blog" action="Update">
            <Tooltip title="Edit">
              <Button
                icon={<Edit className="h-4 w-4" />}
                onClick={() => navigate(`/blog/edit/${r._id}`)}
              />
            </Tooltip>
          </PermissionGate>
          <PermissionGate module="Blog" action="Delete">
            <Tooltip title="Delete">
              <Button
                danger
                icon={<Trash2 className="h-4 w-4" />}
                onClick={() => onDelete(r._id, r.title)}
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
        title="Blog · Zoom Property Admin"
        description="Market insight, guides and news published to the website."
        noindex
      />
      <PageHeader
        title="Blog"
        subtitle="Market insight, guides and news"
        breadcrumbs={[{ title: "Dashboard", path: "/" }, { title: "Blog" }]}
        extra={
          <Space>
            <PermissionGate module="Blog" action="Update">
              <Button
                icon={<Tags className="h-4 w-4" />}
                onClick={() => setCatsOpen(true)}
              >
                Categories
              </Button>
            </PermissionGate>
            <PermissionGate module="Blog" action="Create">
              <Button
                type="primary"
                icon={<Plus className="h-4 w-4" />}
                onClick={() => navigate("/blog/create")}
              >
                Write article
              </Button>
            </PermissionGate>
          </Space>
        }
      />

      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          allowClear
          placeholder="Search articles"
          prefix={<Search className="h-4 w-4 text-gray-400" />}
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="max-w-sm"
        />
        <Select
          allowClear
          placeholder="Status"
          className="w-36"
          value={status}
          options={[
            { value: "draft", label: "Draft" },
            { value: "published", label: "Published" },
          ]}
          onChange={(v) => {
            setPage(1);
            setStatus(v);
          }}
        />
        <Select
          allowClear
          showSearch
          optionFilterProp="label"
          placeholder="Category"
          className="w-44"
          value={category}
          options={(categories || []).map((c: any) => ({
            value: c._id,
            label: c.name,
          }))}
          onChange={(v) => {
            setPage(1);
            setCategory(v);
          }}
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

      <BlogCategoriesModal open={catsOpen} onClose={() => setCatsOpen(false)} />
    </div>
  );
};

export default Blog;
