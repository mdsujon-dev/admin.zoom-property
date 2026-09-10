import { Button, Input, Modal, Space, Switch, Tag, Tooltip } from "antd";
import { Building2, Edit, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

import PageHeader from "../../components/Common/PageHeader";
import PageMeta from "../../components/Common/PageMeta";
import PermissionGate from "../../components/Common/PermissionGate";
import DataTable from "../../components/Table/DataTable";
import {
  useDeleteLandownerProjectMutation,
  useGetLandownerProjectsQuery,
  useUpdateLandownerProjectMutation,
} from "../../redux/features/landowner/landownerApi";
import { mediaSrc } from "../../utils/mediaSrc";
import LandownerProjectModal from "./LandownerProjectModal";

const { confirm } = Modal;

/**
 * A one-line preview of an HTML passage.
 *
 * Tags out, then the handful of entities the editor emits turned back into
 * characters — otherwise the row reads "Gulshan &mdash; 52% owner share".
 */
const plainText = (html?: string) =>
  String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

/**
 * The blocks on the landowners page - a photograph, a heading, a passage.
 *
 * Publishing is its own column rather than a field inside the form: putting a
 * block on the website is a different act from writing it, and the log keeps
 * who did it.
 */
const Landowners = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<any>(null);
  const [open, setOpen] = useState(false);
  /** Which row is mid-save, so only its switch spins. */
  const [savingId, setSavingId] = useState<string | null>(null);

  const { data, isFetching } = useGetLandownerProjectsQuery({
    page,
    limit,
    searchTerm: search || undefined,
  });
  const [updateProject] = useUpdateLandownerProjectMutation();
  const [deleteProject] = useDeleteLandownerProjectMutation();

  const rows = data?.result ?? [];
  const total = data?.meta?.total ?? 0;

  /**
   * Publish or unpublish from the row.
   *
   * The row is the natural place for it: deciding a block goes on the website
   * is a different act from writing it, and going through the form to flip one
   * switch means opening an editor to make an editorial decision.
   */
  const onTogglePublished = async (row: any) => {
    const next = !row.isPublished;
    setSavingId(row._id);
    try {
      await updateProject({ id: row._id, data: { isPublished: next } }).unwrap();
      toast.success(next ? "Block published" : "Block unpublished");
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not change the publish state");
    } finally {
      setSavingId(null);
    }
  };

  const onDelete = (id: string, name: string) =>
    confirm({
      title: "Delete this block?",
      content: `"${name}" will be removed from the landowners page.`,
      okText: "Yes, delete",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteProject(id).unwrap();
          toast.success("Block deleted");
        } catch (e: any) {
          toast.error(e?.data?.message || "Could not delete the block");
        }
      },
    });

  const columns = [
    {
      title: "Block",
      dataIndex: "title",
      key: "title",
      // Bounded on purpose: with no width the passage stretches this column
      // until every other one is pushed off the right edge.
      width: 460,
      ellipsis: true,
      render: (title: string, r: any) => (
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-11 w-16 shrink-0 overflow-hidden rounded bg-secondary-100">
            {mediaSrc(r.image) ? (
              <img
                src={mediaSrc(r.image)}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <Building2 className="absolute inset-0 m-auto h-4 w-4 text-secondary-300" />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-secondary-800">{title}</p>
            {/* The passage is HTML, so the preview is its text with the tags
                taken out — a row is not the place to render markup. */}
            <p className="truncate text-xs text-secondary-500">
              {plainText(r.description) || "—"}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Order",
      dataIndex: "order",
      key: "order",
      width: 90,
      align: "center" as const,
    },
    {
      title: "On page",
      dataIndex: "isHome",
      key: "isHome",
      width: 100,
      align: "center" as const,
      render: (isHome: boolean) =>
        isHome ? (
          <Tag color="blue">On page</Tag>
        ) : (
          <span className="text-secondary-300">—</span>
        ),
    },
    {
      title: "Published",
      dataIndex: "isPublished",
      key: "isPublished",
      width: 150,
      fixed: "right" as const,
      render: (published: boolean, r: any) => (
        <PermissionGate
          module="Landowners"
          action="Update"
          fallback={
            <Tag color={published ? "green" : "default"}>
              {published ? "Published" : "Draft"}
            </Tag>
          }
        >
          <Space size={8}>
            <Switch
              size="small"
              checked={published}
              loading={savingId === r._id}
              onChange={() => onTogglePublished(r)}
            />
            {/* The word beside the switch: a lone toggle tells you its state
                only if you already know which way is on. */}
            <Tag
              color={published ? "green" : "default"}
              className="!m-0 !text-[11px]"
            >
              {published ? "Published" : "Draft"}
            </Tag>
          </Space>
        </PermissionGate>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right" as const,
      width: 120,
      render: (_: unknown, r: any) => (
        <Space>
          <PermissionGate module="Landowners" action="Update">
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
          <PermissionGate module="Landowners" action="Delete">
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
        title="Landowners · Zoom Property Admin"
        description="The blocks on the landowners page."
        noindex
      />
      <PageHeader
        title="Landowners"
        subtitle="A photograph, a heading and a passage, in the order they appear"
        breadcrumbs={[{ title: "Dashboard", path: "/" }, { title: "Landowners" }]}
        extra={
          <PermissionGate module="Landowners" action="Create">
            <Button
              type="primary"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
            >
              Add block
            </Button>
          </PermissionGate>
        }
      />

      <div className="mb-6">
        <Input
          allowClear
          placeholder="Search by title"
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

      <LandownerProjectModal
        open={open}
        project={editing}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
      />
    </div>
  );
};

export default Landowners;
