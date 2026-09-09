import { Button, Input, Modal, Progress, Space, Tag, Tooltip } from "antd";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

import PageHeader from "../../components/Common/PageHeader";
import PageMeta from "../../components/Common/PageMeta";
import PermissionGate from "../../components/Common/PermissionGate";
import DataTable from "../../components/Table/DataTable";
import {
  useDeleteProjectMutation,
  useGetProjectsQuery,
} from "../../redux/features/project/projectApi";
import ProjectModal from "./ProjectModal";

const { confirm } = Modal;

const STAGE_COLOUR: Record<string, string> = {
  Piling: "default",
  Structure: "blue",
  Finishing: "gold",
  "Handover ready": "green",
};

const Projects = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const { data, isFetching } = useGetProjectsQuery({
    page,
    limit,
    searchTerm: search || undefined,
  });
  const [deleteProject] = useDeleteProjectMutation();

  const rows = data?.result ?? [];
  const total = data?.meta?.total ?? 0;

  const onDelete = (id: string, name: string) =>
    confirm({
      title: "Delete this project?",
      content: `"${name}" will be removed. Listings inside it must be detached first.`,
      okText: "Yes, delete",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteProject(id).unwrap();
          toast.success("Project deleted");
        } catch (e: any) {
          toast.error(e?.data?.message || "Could not delete the project");
        }
      },
    });

  const columns = [
    {
      title: "Project",
      dataIndex: "name",
      key: "name",
      render: (name: string, r: any) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-secondary-800">{name}</p>
          <p className="truncate text-xs text-secondary-500">
            {r.developer ? `${r.developer} · ` : ""}
            {r.area?.name || r.city}
          </p>
        </div>
      ),
    },
    {
      title: "Stage",
      dataIndex: "stage",
      key: "stage",
      width: 150,
      render: (stage: string) => (
        <Tag color={STAGE_COLOUR[stage] || "default"}>{stage}</Tag>
      ),
    },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      width: 170,
      render: (p: number) => (
        <Progress percent={p ?? 0} size="small" strokeColor="#133050" />
      ),
    },
    {
      title: "Units",
      dataIndex: "units",
      key: "units",
      width: 120,
      align: "center" as const,
      render: (units: number, r: any) => (
        <span className="text-xs">
          {r.unitsLeft ?? 0} / {units ?? 0} left
        </span>
      ),
    },
    {
      title: "Handover",
      dataIndex: "handover",
      key: "handover",
      width: 120,
      render: (v: string) => v || "—",
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right" as const,
      width: 120,
      render: (_: unknown, r: any) => (
        <Space>
          <PermissionGate module="Projects" action="Update">
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
          <PermissionGate module="Projects" action="Delete">
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
        title="Projects · Zoom Property Admin"
        description="Developments under construction and how far along they are."
        noindex
      />
      <PageHeader
        title="Projects"
        subtitle="Developments under construction"
        breadcrumbs={[{ title: "Dashboard", path: "/" }, { title: "Projects" }]}
        extra={
          <PermissionGate module="Projects" action="Create">
            <Button
              type="primary"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
            >
              Add project
            </Button>
          </PermissionGate>
        }
      />

      <div className="mb-6">
        <Input
          allowClear
          placeholder="Search by name, developer or permit no."
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

      <ProjectModal
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

export default Projects;
