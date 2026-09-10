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
 * Joint-venture case studies - the evidence on the landowners page.
 *
 * Publishing is its own column rather than a field inside the form: putting a
 * completed deal on the website is a different act from recording it, and the
 * log keeps who did it.
 */
const Landowners = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const { data, isFetching } = useGetLandownerProjectsQuery({
    page,
    limit,
    searchTerm: search || undefined,
  });
  const [updateProject] = useUpdateLandownerProjectMutation();
  const [deleteProject] = useDeleteLandownerProjectMutation();

  const rows = data?.result ?? [];
  const total = data?.meta?.total ?? 0;

  const onDelete = (id: string, name: string) =>
    confirm({
      title: "Delete this case study?",
      content: `"${name}" will be removed from the landowners page.`,
      okText: "Yes, delete",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteProject(id).unwrap();
          toast.success("Case study deleted");
        } catch (e: any) {
          toast.error(e?.data?.message || "Could not delete the case study");
        }
      },
    });

  const columns = [
    {
      title: "Project",
      dataIndex: "name",
      key: "name",
      render: (name: string, r: any) => (
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
            <p className="truncate font-medium text-secondary-800">{name}</p>
            <p className="truncate text-xs text-secondary-500">
              {r.location || "—"}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Land",
      dataIndex: "landSizeKatha",
      key: "landSizeKatha",
      width: 110,
      align: "center" as const,
      render: (v: number) => (v ? `${v} katha` : "—"),
    },
    {
      title: "Floors",
      dataIndex: "floors",
      key: "floors",
      width: 90,
      align: "center" as const,
      render: (v: number) => v ?? "—",
    },
    {
      title: "Owner share",
      dataIndex: "ownerSharePercent",
      key: "ownerSharePercent",
      width: 120,
      align: "center" as const,
      render: (v: number) =>
        typeof v === "number" ? <Tag color="green">{v}%</Tag> : "—",
    },
    {
      title: "Completed",
      dataIndex: "completedYear",
      key: "completedYear",
      width: 110,
      align: "center" as const,
      render: (v: number) => v ?? "—",
    },
    {
      title: "Published",
      dataIndex: "isPublished",
      key: "isPublished",
      width: 110,
      render: (published: boolean, r: any) => (
        <PermissionGate
          module="Landowners"
          action="Update"
          fallback={<span>{published ? "Yes" : "No"}</span>}
        >
          <Switch
            size="small"
            checked={published}
            onChange={() =>
              updateProject({ id: r._id, data: { isPublished: !published } })
            }
          />
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
        title="Landowners · Zoom Property Admin"
        description="Joint-venture case studies shown to landowners."
        noindex
      />
      <PageHeader
        title="Landowners"
        subtitle="Completed joint ventures, and what the landowner got"
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
              Add case study
            </Button>
          </PermissionGate>
        }
      />

      <div className="mb-6">
        <Input
          allowClear
          placeholder="Search by project name or location"
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
