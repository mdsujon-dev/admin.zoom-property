import { Button, Input, Modal, Select, Space, Switch, Tag, Tooltip } from "antd";
import { Edit, Eye, Plus, Search, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import PageHeader from "../../components/Common/PageHeader";
import PageMeta from "../../components/Common/PageMeta";
import PermissionGate from "../../components/Common/PermissionGate";
import DataTable from "../../components/Table/DataTable";
import OrderInputCell from "../../components/shared/OrderInputCell";
import AntImage from "../../components/shared/AntImage";
import Money from "../../components/shared/Money";
import { mediaSrc } from "../../utils/mediaSrc";
import {
  useChangePropertyStatusMutation,
  useDeletePropertyMutation,
  useGetPropertiesQuery,
  useUpdatePropertyMutation,
} from "../../redux/features/property/propertyApi";
import { useGetAreasQuery } from "../../redux/features/area/areaApi";
import {
  PROPERTY_TYPES,
  STATUSES,
  STATUS_COLOUR,
  money,
  typeLabel,
} from "./propertyMeta";

const { confirm } = Modal;

/**
 * The listing book.
 *
 * Status is editable from the row rather than only from the form: "this one
 * just went under offer" is the most common edit in the building, and making
 * somebody open a twelve-field form to record it is how the book falls behind
 * what the desk actually knows.
 */
const Properties = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>();
  const [purpose] = useState<string | undefined>();
  const [type, setType] = useState<string | undefined>();
  const [area, setArea] = useState<string | undefined>();
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const { data, isLoading } = useGetPropertiesQuery({
    page,
    limit,
    searchTerm: search || undefined,
    status,
    purpose,
    type,
    area,
    sort: "order",
  });
  const { data: areaData } = useGetAreasQuery({ limit: 200, activeOnly: true });

  const [changeStatus] = useChangePropertyStatusMutation();
  const [deleteProperty] = useDeletePropertyMutation();
  const [updateProperty] = useUpdatePropertyMutation();

  const rows = data?.result ?? [];
  const total = data?.meta?.total ?? 0;

  const onStatus = async (id: string, next: string) => {
    setBusyKey(`${id}-status`);
    try {
      const res = await changeStatus({ id, status: next as any }).unwrap();
      toast.success(res?.message || "Status updated");
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not update the status");
    } finally {
      setBusyKey(null);
    }
  };

  const onToggleField = async (
    id: string,
    field: "isHome" | "featured",
    value: boolean
  ) => {
    setBusyKey(`${id}-${field}`);
    try {
      await updateProperty({ id, data: { [field]: value } }).unwrap();
      toast.success(
        `${field === "isHome" ? "Home visibility" : "Featured"} updated`
      );
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not update the listing");
    } finally {
      setBusyKey(null);
    }
  };

  const onDelete = (id: string, title: string) =>
    confirm({
      title: "Delete this listing?",
      content: `"${title}" will be removed from the book. Anything already recorded against it — enquiries, ledger entries — is kept.`,
      okText: "Yes, delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteProperty(id).unwrap();
          toast.success("Listing deleted");
        } catch (e: any) {
          toast.error(e?.data?.message || "Could not delete the listing");
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
            updateProperty({ id, data: { order } }).unwrap()
          }
        />
      ),
    },
    {
      title: "Reference",
      dataIndex: "referenceNo",
      key: "referenceNo",
      width: 140,
      render: (ref: string, r: any) => (
        <Link
          to={`/properties/view/${r._id}`}
          className="font-mono text-xs font-semibold text-primary hover:underline"
        >
          {ref}
        </Link>
      ),
    },
    {
      title: "Listing",
      dataIndex: "title",
      key: "title",
      render: (title: string, r: any) => {
        const imgUrl = mediaSrc(r.coverImage);
        return (
          <div className="flex items-center gap-3">
            {imgUrl ? (
              <div className="w-11 h-11 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                <AntImage
                  src={imgUrl}
                  alt={title}
                  width="100%"
                  height="100%"
                  className="!w-full !h-full !object-cover"
                  preview={true}
                />
              </div>
            ) : null}
            <div className="min-w-0">
              <p className="truncate font-medium text-secondary-800">{title}</p>
              <p className="truncate text-xs text-secondary-500">
                {typeLabel(r.type)}
                {r.area?.name ? ` · ${r.area.name}` : ""}
                {r.beds ? ` · ${r.beds} bed` : ""}
                {r.size ? ` · ${money(r.size)} sq ft` : ""}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 150,
      align: "right" as const,
      render: (price: number, r: any) => (
        <div className="text-right">
          <p className="font-semibold text-secondary-800"><Money value={price} /></p>
          {r.purpose === "rent" && (
            <p className="text-[11px] text-secondary-400">per month</p>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (value: string, r: any) => (
        <PermissionGate
          module="Properties"
          action="Update"
          fallback={<Tag color={STATUS_COLOUR[value]}>{value}</Tag>}
        >
          <Select
            size="small"
            value={value}
            className="w-full"
            loading={busyKey === `${r._id}-status`}
            options={STATUSES}
            onChange={(next) => onStatus(r._id, next)}
          />
        </PermissionGate>
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
          module="Properties"
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
            loading={busyKey === `${r._id}-isHome`}
            onChange={(checked) => onToggleField(r._id, "isHome", checked)}
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
          module="Properties"
          action="Update"
          fallback={featured ? <Star className="mx-auto h-4 w-4" /> : null}
        >
          <Switch
            size="small"
            checked={!!featured}
            loading={busyKey === `${r._id}-featured`}
            onChange={(checked) => onToggleField(r._id, "featured", checked)}
          />
        </PermissionGate>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right" as const,
      width: 140,
      render: (_: unknown, r: any) => (
        <Space>
          <Tooltip title="Open">
            <Button
              icon={<Eye className="h-4 w-4" />}
              onClick={() => navigate(`/properties/view/${r._id}`)}
            />
          </Tooltip>
          <PermissionGate module="Properties" action="Update">
            <Tooltip title="Edit">
              <Button
                icon={<Edit className="h-4 w-4" />}
                onClick={() => navigate(`/properties/edit/${r._id}`)}
              />
            </Tooltip>
          </PermissionGate>
          <PermissionGate module="Properties" action="Delete">
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
        title="Listings · Zoom Property Admin"
        description="Every property on the book — for sale, to rent, sold and let."
        canonicalUrl={`${window.location.origin}/properties`}
        noindex
      />
      <PageHeader
        title="Listings"
        subtitle="Every property on the book"
        breadcrumbs={[{ title: "Dashboard", path: "/" }, { title: "Listings" }]}
        extra={
          <PermissionGate module="Properties" action="Create">
            <Button
              type="primary"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => navigate("/properties/create")}
            >
              Add listing
            </Button>
          </PermissionGate>
        }
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        {/* Left side: Search Input */}
        <div className="w-full sm:w-auto">
          <Input
            allowClear
            placeholder="Search by title, reference or address"
            prefix={<Search className="h-4 w-4 text-gray-400" />}
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="w-full sm:w-80 md:w-96"
          />
        </div>

        {/* Right side: Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <Select
            allowClear
            placeholder="Status"
            className="w-36"
            value={status}
            options={STATUSES}
            onChange={(v) => {
              setPage(1);
              setStatus(v);
            }}
          />
          <Select
            allowClear
            placeholder="Type"
            className="w-36"
            value={type}
            options={PROPERTY_TYPES}
            onChange={(v) => {
              setPage(1);
              setType(v);
            }}
          />
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder="Area"
            className="w-40"
            value={area}
            options={(areaData?.result || []).map((a: any) => ({
              value: a._id,
              label: a.name,
            }))}
            onChange={(v) => {
              setPage(1);
              setArea(v);
            }}
          />
        </div>
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
    </div>
  );
};

export default Properties;
