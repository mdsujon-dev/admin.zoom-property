import { Button, Input, Modal, Space, Tag, Tooltip } from "antd";
import { ArrowDown, ArrowUp, Edit, Plus, Search, Trash2 } from "lucide-react";
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
    sort: "order",
  });
  const [deleteArea] = useDeleteAreaMutation();
  const [updateArea, { isLoading: updatingOrder }] = useUpdateAreaMutation();

  const rows = data?.result ?? [];
  const total = data?.meta?.total ?? 0;

  const handleMoveUp = async (index: number) => {
    if (index <= 0 || updatingOrder) return;
    const current = rows[index];
    const prev = rows[index - 1];

    let currentOrder = typeof current.order === "number" ? current.order : index + 1;
    let prevOrder = typeof prev.order === "number" ? prev.order : index;

    if (currentOrder >= prevOrder) {
      const temp = currentOrder;
      currentOrder = Math.max(0, prevOrder - 1);
      prevOrder = temp;
    }

    try {
      await Promise.all([
        updateArea({ id: current._id, data: { order: currentOrder } }).unwrap(),
        updateArea({ id: prev._id, data: { order: prevOrder } }).unwrap(),
      ]);
      toast.success("Order updated");
    } catch {
      toast.error("Could not update order");
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index >= rows.length - 1 || updatingOrder) return;
    const current = rows[index];
    const next = rows[index + 1];

    let currentOrder = typeof current.order === "number" ? current.order : index + 1;
    let nextOrder = typeof next.order === "number" ? next.order : index + 2;

    if (currentOrder <= nextOrder) {
      const temp = currentOrder;
      currentOrder = nextOrder + 1;
      nextOrder = temp;
    }

    try {
      await Promise.all([
        updateArea({ id: current._id, data: { order: currentOrder } }).unwrap(),
        updateArea({ id: next._id, data: { order: nextOrder } }).unwrap(),
      ]);
      toast.success("Order updated");
    } catch {
      toast.error("Could not update order");
    }
  };

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
      width: 110,
      align: "center" as const,
      render: (ord: number, _: any, index: number) => (
        <div className="flex items-center justify-center gap-1.5">
          <span className="font-semibold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full min-w-[28px] text-center border border-blue-200">
            #{ord ?? index + 1}
          </span>
          <div className="flex flex-col gap-0.5">
            <Button
              type="text"
              size="small"
              disabled={index === 0 || updatingOrder}
              icon={<ArrowUp className="h-3.5 w-3.5" />}
              onClick={() => handleMoveUp(index)}
              className="!p-0.5 !h-5 !w-5 flex items-center justify-center hover:bg-gray-200 rounded"
              title="Move Up"
            />
            <Button
              type="text"
              size="small"
              disabled={index === rows.length - 1 || updatingOrder}
              icon={<ArrowDown className="h-3.5 w-3.5" />}
              onClick={() => handleMoveDown(index)}
              className="!p-0.5 !h-5 !w-5 flex items-center justify-center hover:bg-gray-200 rounded"
              title="Move Down"
            />
          </div>
        </div>
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
