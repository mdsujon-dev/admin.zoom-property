import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Space, Switch, Tag, Tooltip } from "antd";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import PageHeader from "../../../components/Common/PageHeader";
import PageMeta from "../../../components/Common/PageMeta";
import PermissionGate from "../../../components/Common/PermissionGate";
import CreateServicesCountryModal from "../../../components/modal/settings/services-country/CreateServicesCountryModal";
import UpdateServicesCountryModal from "../../../components/modal/settings/services-country/UpdateServicesCountryModal";
import DataTable from "../../../components/Table/DataTable";
import {
  IServicesCountry,
  useDeleteServicesCountryMutation,
  useGetServicesCountriesQuery,
  useUpdateServicesCountryMutation,
} from "../../../redux/features/settings/servicesCountryApi";
import ExportMenu from "../../../components/Common/ExportMenu";
import { makeSheet } from "../../../utils/tableExport";

const { confirm } = Modal;

const ServicesCountries: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchText, setSearchText] = useState("");
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [selected, setSelected] = useState<IServicesCountry | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const { data: response, isFetching } = useGetServicesCountriesQuery(
    searchText ? { keyword: searchText } : {}
  );
  const items: IServicesCountry[] = response?.data ?? [];

  const [deleteServicesCountry] = useDeleteServicesCountryMutation();
  const [updateServicesCountry] = useUpdateServicesCountryMutation();

  const handleDelete = (record: IServicesCountry) => {
    confirm({
      title: `Delete "${record.name}"?`,
      icon: <ExclamationCircleOutlined />,
      content:
        "This action cannot be undone. Deletion will be blocked if any service is still using this country.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        if (!record._id) return;
        try {
          const res = await deleteServicesCountry(record._id).unwrap();
          if (res.success) {
            toast.success(res.message || "Service country deleted");
          }
        } catch (error: any) {
          toast.error(
            error?.data?.message ||
              "Failed to delete — may be referenced by existing services"
          );
        }
      },
    });
  };

  const handleEdit = (record: IServicesCountry) => {
    setSelected(record);
    setIsOpenUpdateModal(true);
  };

  const handleToggleActive = async (record: IServicesCountry) => {
    if (!record._id) return;
    setTogglingId(record._id);
    try {
      const res = await updateServicesCountry({
        id: record._id,
        data: { isActive: !record.isActive },
      }).unwrap();
      if (res.success) {
        toast.success(
          `Marked as ${!record.isActive ? "active" : "inactive"}`
        );
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <span className="font-medium text-secondary-900">{text}</span>
      ),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      render: (text: string) =>
        text ? (
          <Tag color="blue" className="!font-mono">
            {text}
          </Tag>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 130,
      align: "center" as const,
      render: (isActive: boolean, record: IServicesCountry) => (
        <Switch
          checked={!!isActive}
          loading={togglingId === record._id}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          onChange={() => handleToggleActive(record)}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 140,
      align: "right" as const,
      render: (_: unknown, record: IServicesCountry) => (
        <Space>
          <PermissionGate module="Services Countries" action="Update">
            <Tooltip title="Edit">
              <Button
                icon={<Edit className="w-4 h-4" />}
                onClick={() => handleEdit(record)}
              />
            </Tooltip>
          </PermissionGate>
          <PermissionGate module="Services Countries" action="Delete">
            <Tooltip title="Delete">
              <Button
                danger
                icon={<Trash2 className="w-4 h-4" />}
                onClick={() => handleDelete(record)}
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
        title="Services Countries - Zoom Property Admin"
        description="Manage country tags used to scope services."
        keywords="services countries, Zoom Property"
        canonicalUrl={`${window.location.origin}/settings/services-countries`}
        noindex={true}
      />
      <PageHeader
        title="Services Countries"
        subtitle="Manage country tags that services can target"
        breadcrumbs={[
          { title: "Dashboard", path: "/" },
          { title: "Settings" },
          { title: "Services Countries" },
        ]}
        extra={
          <div className="flex flex-wrap items-center gap-2">
            {/* The query is not paginated, so what is held is the whole list. */}
            <ExportMenu
              sheet={() =>
                makeSheet({
                  title: "Services Countries",
                  unit: "country",
                  filters: [searchText && `Search: "${searchText}"`],
                  headers: ["Name", "Slug", "Status"],
                  rows: items,
                  isLow: (c: IServicesCountry) => !c.isActive,
                  cells: (c: IServicesCountry) => [
                    c.name || "—",
                    c.slug || "—",
                    c.isActive ? "Active" : "Inactive",
                  ],
                })
              }
              disabled={items.length === 0}
            />
            <PermissionGate module="Services Countries" action="Create">
              <Button
                type="primary"
                icon={<Plus className="w-4 h-4" />}
                size="middle"
                onClick={() => setIsOpenCreateModal(true)}
              >
                Add New
              </Button>
            </PermissionGate>
          </div>
        }
      />

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search by name or slug..."
          prefix={<Search className="w-4 h-4 text-gray-400" />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="max-w-md"
        />
      </div>

      <DataTable
        data={items}
        columns={columns}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        limit={limit}
        setLimit={setLimit}
        total={items.length}
        isPaginate={items.length > limit}
        loading={isFetching}
        rowKey="_id"
      />

      {isOpenCreateModal && (
        <CreateServicesCountryModal
          open={isOpenCreateModal}
          setOpen={setIsOpenCreateModal}
        />
      )}

      {isOpenUpdateModal && selected && (
        <UpdateServicesCountryModal
          open={isOpenUpdateModal}
          setOpen={setIsOpenUpdateModal}
          data={selected}
        />
      )}
    </div>
  );
};

export default ServicesCountries;
