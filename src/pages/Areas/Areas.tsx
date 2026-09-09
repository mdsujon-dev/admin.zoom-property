import { Button, Input, Modal, Space, Tag, Tooltip } from "antd";
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
} from "../../redux/features/area/areaApi";
import AreaModal from "./AreaModal";

const { confirm } = Modal;

const money = (v?: number) =>
  typeof v === "number" ? v.toLocaleString("en-BD") : "—";

/** Neighbourhoods, and how many listings each one is carrying. */
const Areas = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const { data, isFetching } = useGetAreasQuery({
    page,
    limit,
    searchTerm: search || undefined,
  });
  const [deleteArea] = useDeleteAreaMutation();

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
      title: "Listings",
      dataIndex: "listings",
      key: "listings",
      width: 110,
      align: "center" as const,
      render: (n: number) => <Tag color={n ? "green" : "default"}>{n ?? 0}</Tag>,
    },
    {
      title: "Median price",
      dataIndex: "medianPrice",
      key: "medianPrice",
      width: 150,
      align: "right" as const,
      render: (v: number) => `৳ ${money(v)}`,
    },
    {
      title: "Per sq ft",
      dataIndex: "pricePerSqft",
      key: "pricePerSqft",
      width: 120,
      align: "right" as const,
      render: (v: number) => `৳ ${money(v)}`,
    },
    {
      title: "Yield",
      dataIndex: "rentalYield",
      key: "rentalYield",
      width: 90,
      render: (v: string) => v || "—",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 110,
      render: (active: boolean, r: any) => (
        <Space size={4}>
          <Tag color={active ? "green" : "default"}>
            {active ? "Active" : "Off"}
          </Tag>
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
        loading={isFetching}
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
