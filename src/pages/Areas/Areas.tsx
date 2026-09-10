import { Button, Input, Modal, Space, Switch, Tag, Tooltip } from "antd";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

import PageHeader from "../../components/Common/PageHeader";
import PageMeta from "../../components/Common/PageMeta";
import PermissionGate from "../../components/Common/PermissionGate";
import DataTable from "../../components/Table/DataTable";
import {
  useDeleteAreaMutation,
  useGetAreasQuery,
  useUpdateAreaMutation,
} from "../../redux/features/area/areaApi";
import AreaModal from "../../components/modal/area/AreaModal";
import DateTimeStacked from "../../components/shared/DateTimeStacked";
import OrderInputCell from "../../components/shared/OrderInputCell";

const { confirm } = Modal;

/** Neighbourhoods, and how many listings each one is carrying. */
const Areas = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const { data, isLoading } = useGetAreasQuery({
    page,
    limit,
    searchTerm: search || undefined,
    sort: "order",
  });
  const [deleteArea] = useDeleteAreaMutation();
  const [updateArea] = useUpdateAreaMutation();

  const onToggle = async (
    id: string,
    field: "isActive" | "isHome" | "featured",
    value: boolean
  ) => {
    setBusyId(id);
    try {
      await updateArea({ id, data: { [field]: value } }).unwrap();
      const label =
        field === "isHome"
          ? "Home display"
          : field === "isActive"
          ? "Status"
          : "Featured";
      toast.success(`${label} updated`);
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not update area");
    } finally {
      setBusyId(null);
    }
  };

  const rows = data?.result ?? [];
  const total = data?.meta?.total ?? 0;

  const onDelete = (id: string, name: string) =>
    confirm({
      title: "Delete this area?",
      content: `"${name}" will be removed. Areas with listings in them cannot be deleted — deactivate instead.`,
      okText: "Yes, delete",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteArea(id).unwrap();
          toast.success("Area deleted");
        } catch (e: any) {
          toast.error(e?.data?.message || "Could not delete the area");
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
          onUpdateOrder={(id, order) => updateArea({ id, data: { order } }).unwrap()}
        />
      ),
    },
    {
      title: "Area",
      dataIndex: "name",
      key: "name",
      render: (name: string, r: any) => (
        <div>
          <p className="font-medium text-secondary-800">{name}</p>
          <p className="text-xs text-secondary-500">
            {r.city}
            {r.nameBn ? ` · ${r.nameBn}` : ""}
          </p>
        </div>
      ),
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      width: 240,
      render: (note: string, r: any) => {
        const text = note || r.noteBn || "";
        if (!text) return <span className="text-secondary-400">—</span>;
        return (
          <Tooltip title={<div className="max-w-sm whitespace-pre-wrap text-xs">{text}</div>}>
            <div className="line-clamp-2 text-xs text-secondary-700 leading-relaxed cursor-pointer">
              {text}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: "Listings",
      dataIndex: "listings",
      key: "listings",
      width: 110,
      align: "center" as const,
      render: (n: number) => <Tag color={n ? "green" : "default"}>{n ?? 0}</Tag>,
    },
    {
      title: "Created at",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 140,
      render: (v: string) => <DateTimeStacked value={v} />,
    },
    {
      title: "Updated at",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 140,
      render: (v: string) => <DateTimeStacked value={v} />,
    },
    {
      title: "Home",
      dataIndex: "isHome",
      key: "isHome",
      width: 90,
      align: "center" as const,
      render: (isHome: boolean, r: any) => (
        <PermissionGate
          module="Areas"
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
            onChange={(checked) => onToggle(r._id, "isHome", checked)}
          />
        </PermissionGate>
      ),
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      width: 90,
      align: "center" as const,
      render: (isActive: boolean, r: any) => (
        <PermissionGate
          module="Areas"
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
            onChange={(checked) => onToggle(r._id, "isActive", checked)}
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
          <PermissionGate module="Areas" action="Update">
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
          <PermissionGate module="Areas" action="Delete">
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
        title="Areas · Zoom Property Admin"
        description="Neighbourhoods, their market figures and how many listings each carries."
        noindex
      />
      <PageHeader
        title="Areas"
        subtitle="Neighbourhoods and the numbers behind them"
        breadcrumbs={[{ title: "Dashboard", path: "/" }, { title: "Areas" }]}
        extra={
          <PermissionGate module="Areas" action="Create">
            <Button
              type="primary"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
            >
              Add area
            </Button>
          </PermissionGate>
        }
      />

      <div className="mb-6">
        <Input
          allowClear
          placeholder="Search areas"
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
        loading={isLoading}
        rowKey="_id"
      />

      <AreaModal
        open={open}
        area={editing}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
      />
    </div>
  );
};

export default Areas;
