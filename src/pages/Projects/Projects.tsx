import { Button, Input, Modal, Progress, Select, Space, Switch, Tag, Tooltip } from "antd";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import PageHeader from "../../components/Common/PageHeader";
import PageMeta from "../../components/Common/PageMeta";
import PermissionGate from "../../components/Common/PermissionGate";
import DataTable from "../../components/Table/DataTable";
import OrderInputCell from "../../components/shared/OrderInputCell";
import {
  useDeleteProjectMutation,
  useGetProjectsQuery,
  useUpdateProjectMutation,
} from "../../redux/features/project/projectApi";
import { STAGE_COLOUR, STAGES } from "./projectMeta";

const { confirm } = Modal;

const Projects = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data, isFetching } = useGetProjectsQuery({
    page,
    limit,
    searchTerm: search || undefined,
    sort: "order",
  });
  const [deleteProject] = useDeleteProjectMutation();
  const [updateProject] = useUpdateProjectMutation();

  const onToggleProject = async (
    id: string,
    field: "isActive" | "isHome" | "featured",
    value: boolean
  ) => {
    setBusyId(id);
    try {
      await updateProject({ id, data: { [field]: value } }).unwrap();
      const label =
        field === "isHome"
          ? "Home visibility"
          : field === "isActive"
          ? "Status"
          : "Featured";
      toast.success(`${label} updated`);
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not update project");
    } finally {
      setBusyId(null);
    }
  };

  const onStageChange = async (id: string, nextStage: string) => {
    setBusyId(id);
    try {
      await updateProject({ id, data: { stage: nextStage } }).unwrap();
      toast.success("Stage updated");
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not update stage");
    } finally {
      setBusyId(null);
    }
  };

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
      title: "Order",
      dataIndex: "order",
      key: "order",
      width: 120,
      align: "center" as const,
      render: (_: number, r: any, index: number) => (
        <OrderInputCell
          record={r}
          index={index}
          onUpdateOrder={(id, order) =>
            updateProject({ id, data: { order } }).unwrap()
          }
        />
      ),
    },
    {
      title: "Project",
      dataIndex: "name",
      key: "name",
      render: (name: string, r: any) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-secondary-800">
            {name}
            {r.isHome && (
              <Tag color="blue" className="ml-2">
                Home
              </Tag>
            )}
          </p>
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
      width: 160,
      render: (stage: string, r: any) => (
        <PermissionGate
          module="Projects"
          action="Update"
          fallback={
            <Tag color={STAGE_COLOUR[stage] || "default"}>{stage}</Tag>
          }
        >
          <Select
            size="small"
            value={stage || "Planning"}
            className="w-full"
            loading={busyId === r._id}
            options={STAGES}
            onChange={(next) => onStageChange(r._id, next)}
          />
        </PermissionGate>
      ),
    },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      width: 150,
      render: (p: number) => (
        <Progress percent={p ?? 0} size="small" strokeColor="#133050" />
      ),
    },
    {
      title: "Units",
      dataIndex: "units",
      key: "units",
      width: 110,
      align: "center" as const,
      render: (units: number, r: any) => (
        <span className="text-xs">
          {r.unitsLeft ?? 0} / {units ?? 0} left
        </span>
      ),
    },
    {
      title: "Home",
      dataIndex: "isHome",
      key: "isHome",
      width: 85,
      align: "center" as const,
      render: (isHome: boolean, r: any) => (
        <PermissionGate
          module="Projects"
          action="Update"
          fallback={
            <Tag color={isHome ? "blue" : "default"}>
              {isHome ? "Home" : "Off"}
            </Tag>
          }
        >
          <Switch
            size="small"
            checked={!!isHome}
            loading={busyId === r._id}
            onChange={(checked) => onToggleProject(r._id, "isHome", checked)}
          />
        </PermissionGate>
      ),
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      width: 85,
      align: "center" as const,
      render: (isActive: boolean, r: any) => (
        <PermissionGate
          module="Projects"
          action="Update"
          fallback={
            <Tag color={isActive !== false ? "green" : "default"}>
              {isActive !== false ? "Active" : "Off"}
            </Tag>
          }
        >
          <Switch
            size="small"
            checked={isActive !== false}
            loading={busyId === r._id}
            onChange={(checked) => onToggleProject(r._id, "isActive", checked)}
          />
        </PermissionGate>
      ),
    },
    {
      title: "Featured",
      dataIndex: "featured",
      key: "featured",
      width: 85,
      align: "center" as const,
      render: (featured: boolean, r: any) => (
        <PermissionGate
          module="Projects"
          action="Update"
          fallback={
            <Tag color={featured ? "gold" : "default"}>
              {featured ? "Yes" : "No"}
            </Tag>
          }
        >
          <Switch
            size="small"
            checked={!!featured}
            loading={busyId === r._id}
            onChange={(checked) => onToggleProject(r._id, "featured", checked)}
          />
        </PermissionGate>
      ),
    },
    {
      title: "Handover",
      dataIndex: "handover",
      key: "handover",
      width: 110,
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
                onClick={() => navigate(`/projects/edit/${r._id}`)}
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
              onClick={() => navigate("/projects/create")}
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
    </div>
  );
};

export default Projects;
