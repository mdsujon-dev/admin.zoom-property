import { Button, Input, Modal, Select, Space, Switch, Tag, Tooltip } from "antd";
import { Edit, Eye, Plus, Search, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import PageHeader from "../../components/Common/PageHeader";
import PageMeta from "../../components/Common/PageMeta";
import PermissionGate from "../../components/Common/PermissionGate";
import DataTable from "../../components/Table/DataTable";
import {
  useChangePropertyStatusMutation,
  useDeletePropertyMutation,
  useGetPropertiesQuery,
  useTogglePropertyFeaturedMutation,
} from "../../redux/features/property/propertyApi";
import { useGetAreasQuery } from "../../redux/features/area/areaApi";
import {
  PROPERTY_TYPES,
  PURPOSES,
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
  const [purpose, setPurpose] = useState<string | undefined>();
  const [type, setType] = useState<string | undefined>();
  const [area, setArea] = useState<string | undefined>();
  const [busyId, setBusyId] = useState<string | null>(null);

  const { data, isFetching } = useGetPropertiesQuery({
    page,
    limit,
    searchTerm: search || undefined,
    status,
    purpose,
    type,
    area,
  });
  const { data: areaData } = useGetAreasQuery({ limit: 200, activeOnly: true });

  const [changeStatus] = useChangePropertyStatusMutation();
  const [toggleFeatured] = useTogglePropertyFeaturedMutation();
  const [deleteProperty] = useDeletePropertyMutation();

  const rows = data?.result ?? [];
  const total = data?.meta?.total ?? 0;

  const onStatus = async (id: string, next: string) => {
    setBusyId(id);
    try {
      const res = await changeStatus({ id, status: next as any }).unwrap();
      toast.success(res?.message || "Status updated");
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not update the status");
    } finally {
      setBusyId(null);
    }
  };

  const onFeatured = async (id: string) => {
    setBusyId(id);
    try {
      const res = await toggleFeatured(id).unwrap();
      toast.success(res?.message || "Saved");
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not update the listing");
    } finally {
      setBusyId(null);
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
      render: (title: string, r: any) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-secondary-800">{title}</p>
          <p className="truncate text-xs text-secondary-500">
            {typeLabel(r.type)}
            {r.area?.name ? ` · ${r.area.name}` : ""}
            {r.beds ? ` · ${r.beds} bed` : ""}
            {r.size ? ` · ${money(r.size)} sq ft` : ""}
          </p>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 150,
      align: "right" as const,
      render: (price: number, r: any) => (
        <div className="text-right">
          <p className="font-semibold text-secondary-800">৳ {money(price)}</p>
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
            loading={busyId === r._id}
            options={STATUSES}
            onChange={(next) => onStatus(r._id, next)}
          />
        </PermissionGate>
      ),
    },
    {
      title: "Featured",
      dataIndex: "featured",
      key: "featured",
      width: 110,
      align: "center" as const,
      render: (featured: boolean, r: any) => (
        <PermissionGate
          module="Properties"
          action="Update"
          fallback={featured ? <Star className="mx-auto h-4 w-4" /> : null}
        >
          <Switch
            size="small"
            checked={featured}
            loading={busyId === r._id}
            onChange={() => onFeatured(r._id)}
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

      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          allowClear
          placeholder="Search by title, reference or address"
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
          className="w-40"
          value={status}
          options={STATUSES}
          onChange={(v) => {
            setPage(1);
            setStatus(v);
          }}
        />
        <Select
          allowClear
          placeholder="Purpose"
          className="w-36"
          value={purpose}
          options={PURPOSES}
          onChange={(v) => {
            setPage(1);
            setPurpose(v);
          }}
        />
        <Select
          allowClear
          placeholder="Type"
          className="w-40"
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
          className="w-44"
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

export default Properties;
