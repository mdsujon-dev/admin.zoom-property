import { Button, Input, Modal, Select, Space, Switch, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import { Edit, FileText, Plus, Search, Tags, Trash2 } from "lucide-react";
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
  useUpdatePostMutation,
} from "../../redux/features/blog/blogApi";
import { mediaSrc } from "../../utils/mediaSrc";
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
  const [updatePost] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();
  const [busyId, setBusyId] = useState<string | null>(null);

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

  const onToggleStatus = async (id: string, currentStatus: string) => {
    setBusyId(id);
    const newStatus = currentStatus === "published" ? "draft" : "published";
    try {
      await updatePost({ id, data: { status: newStatus } }).unwrap();
      toast.success(`Article ${newStatus === "published" ? "published" : "unpublished"}`);
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not update status");
    } finally {
      setBusyId(null);
    }
  };

  const columns = [
    {
      title: "Article",
      dataIndex: "title",
      key: "title",
      // Bounded, so the columns after it stay on screen.
      width: 420,
      ellipsis: true,
      render: (title: string, r: any) => {
        // The card image is what the index shows, so it is what the row shows.
        // Falls back to the banner, the same way the site does.
        const image = mediaSrc(r.thumbnail) || mediaSrc(r.coverImage);

        return (
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative h-11 w-16 shrink-0 overflow-hidden rounded bg-secondary-100">
              {image ? (
                <img
                  src={image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : (
                <FileText className="absolute inset-0 m-auto h-4 w-4 text-secondary-300" />
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium text-secondary-800">{title}</p>
              <p className="truncate text-xs text-secondary-500">
                {r.author?.name || "—"}
                {r.readMinutes ? ` · ${r.readMinutes} min read` : ""}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      title: "Categories",
      dataIndex: "categories",
      key: "categories",
      width: 150,
      render: (cats: any[]) =>
        cats && cats.length > 0 ? (
          <Space size={2} wrap>
            {cats.map((c: any) => (
              <Tag key={c._id}>{c.name}</Tag>
            ))}
          </Space>
        ) : (
          "—"
        ),
    },
    {
      title: "Home",
      dataIndex: "isHome",
      key: "isHome",
      width: 90,
      align: "center" as const,
      render: (isHome: boolean) =>
        isHome ? (
          <Tag color="blue">Home</Tag>
        ) : (
          <span className="text-secondary-300">—</span>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (s: string, r: any) => (
        <Space size={8}>
          <Switch
            checked={s === "published"}
            onChange={() => onToggleStatus(r._id, s)}
            loading={busyId === r._id}
            checkedChildren="Pub"
            unCheckedChildren="Draft"
          />
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
