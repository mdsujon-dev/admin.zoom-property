import { Avatar, Button, Input, Modal, Space, Switch, Tag, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { CreditCard, Edit, Key, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import PageHeader from "../../components/Common/PageHeader";
import PageMeta from "../../components/Common/PageMeta";
import PermissionGate from "../../components/Common/PermissionGate";
import ChangePasswordModal from "../../components/modal/user/ChangePasswordModal";
import CreateUserModal from "../../components/modal/user/CreateUserModal";
import UpdateUserModal from "../../components/modal/user/UpdateUserModal";
import DateTimeStacked from "../../components/shared/DateTimeStacked";
import { useNavigate } from "react-router-dom";

import DataTable from "../../components/Table/DataTable";
import { useMe } from "../../hooks/useMe";
import {
  useDeleteUserMutation,
  useGetAllUserQuery,
  useLazyGetAllUserQuery,
  useToggleUserStatusMutation,
} from "../../redux/features/user/userApi";
import ExportMenu from "../../components/Common/ExportMenu";
import IdCardModal from "../../components/shared/IdCardModal";
import { makeSheet } from "../../utils/tableExport";

const { confirm } = Modal;

const Users = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchText, setSearchText] = useState("");
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [isOpenChangePasswordModal, setIsOpenChangePasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [idCardFor, setIdCardFor] = useState<any | null>(null);

  const { me } = useMe();
  const myId = me?._id;

  const { data, isFetching } = useGetAllUserQuery({
    page: currentPage,
    limit,
    search: searchText || undefined,
  });

  const [deleteUser] = useDeleteUserMutation();
  const [toggleUserStatus] = useToggleUserStatusMutation();
  const [fetchAllUsers] = useLazyGetAllUserQuery();
  // Per-row loading so only the toggled row dims, not every switch on the page.
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const users = data?.result || [];
  const meta = data?.meta || {};

  const buildSheet = async () => {
    const all = await fetchAllUsers({
      limit: 10000,
      search: searchText || undefined,
    }).unwrap();

    return makeSheet({
      title: "Employees",
      unit: "employee",
      filters: [searchText && `Search: "${searchText}"`],
      headers: [
        "Name",
        "Email",
        "Role",
        "Designation",
        "Phone",
        "Last login",
        "Status",
      ],
      rows: all?.result || [],
      // A dormant account is the one worth noticing on a printed staff list.
      isLow: (u: any) => !u.isActive,
      cells: (u: any) => [
        u.name || "—",
        u.email || "—",
        u.role ? String(u.role).toUpperCase().replace(/_/g, " ") : "—",
        u.designationId?.name || "—",
        u.phone || "—",
        u.lastLogin ? dayjs(u.lastLogin).format("DD MMM YYYY, h:mm A") : "Never",
        u.isActive ? "Active" : "Inactive",
      ],
    });
  };

  const handleDelete = (userId: string) => {
    confirm({
      title: "Are you sure you want to delete this user?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteUser(userId).unwrap();
          toast.success("User deleted successfully!");
        } catch (error: any) {
          toast.error(error?.data?.message || "Failed to delete user");
        }
      },
    });
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    setTogglingId(userId);
    try {
      await toggleUserStatus(userId).unwrap();
      toast.success(`User ${currentStatus ? "deactivated" : "activated"} successfully!`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update user status");
    } finally {
      setTogglingId(null);
    }
  };

  const handleEdit = (user: any) => {
    // The record has thirty-odd fields across five sections. The dialog showed
    // five of them, so the rest were unreachable and stayed empty.
    navigate(`/employees/edit/${user._id}`);
    void setSelectedUser;
    void setIsOpenUpdateModal;
  };

  const handleChangePassword = (user: any) => {
    setSelectedUser(user);
    setIsOpenChangePasswordModal(true);
  };

  const columns: ColumnsType<any> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: any) => (
        // A face beside the name, the same way the agent list carries one.
        // A staff list is read to find a person, and people are recognised by
        // their photograph long before they are read by their email address.
        <div className="flex items-center gap-2.5">
          <Avatar
            src={record?.profilePhoto || "/assets/default_image.png"}
            size={34}
            className="shrink-0 bg-blue-500 object-cover font-semibold text-white"
          >
            {name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <div className="min-w-0">
            <div className="truncate font-medium text-secondary-800">
              {name || "N/A"}
            </div>
            <div className="truncate text-xs text-secondary-400">
              {record?.email || "N/A"}
            </div>
          </div>
        </div>
      ),
    },
   
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag color="var(--primary)">
          {role ? role.toUpperCase().replace(/_/g, " ") : "N/A"}
        </Tag>
      ),
    },
    {
      title: "Designation",
      dataIndex: "designationId",
      key: "designationId",
      render: (designation: any) => (
        <span className="line-clamp-1">{designation?.name || "N/A"}</span>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone: string) => <span>{phone || "N/A"}</span>,
    },
    {
      title: "Last Login",
      dataIndex: "lastLogin",
      key: "lastLogin",
      width: 150,
      render: (lastLogin: string) => (
        <DateTimeStacked value={lastLogin} emptyText="N/A" />
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 100,
      render: (isActive: boolean, record: any) => {
        const isSelf = myId && String(record._id) === String(myId);
        return (
          <PermissionGate
            module="Employees"
            action="Update"
            fallback={
              <Switch
                checked={isActive}
                disabled
                checkedChildren="Active"
                unCheckedChildren="Inactive"
              />
            }
          >
            <Tooltip
              title={isSelf ? "You cannot change your own status" : ""}
            >
              <Switch
                checked={isActive}
                disabled={!!isSelf || togglingId === record._id}
                loading={togglingId === record._id}
                checkedChildren="Active"
                unCheckedChildren="Inactive"
                onChange={() => handleToggleStatus(record._id, isActive)}
              />
            </Tooltip>
          </PermissionGate>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 200,
      render: (_: any, record: any) => {
        const isSelf = myId && String(record._id) === String(myId);
        return (
          // The row navigates, so the cell holding the buttons has to swallow
          // the click — otherwise pressing Edit opens the page instead.
          <Space onClick={(e) => e.stopPropagation()}>
            {/* Prints on whichever design the office picked for employees in
                Settings → ID Cards. */}
            <Tooltip title="ID card">
              <Button
                icon={<CreditCard className="w-4 h-4" />}
                onClick={() => setIdCardFor(record)}
              />
            </Tooltip>
            <PermissionGate module="Employees" action="Update">
              <Tooltip title="Edit User">
                <Button
                  icon={<Edit className="w-4 h-4" />}
                  onClick={() => handleEdit(record)}
                />
              </Tooltip>
            </PermissionGate>
            <PermissionGate module="Employees" action="Change Password">
              <Tooltip
                title={
                  isSelf
                    ? "Use Profile page to change your own password"
                    : "Change Password"
                }
              >
                <Button
                  icon={<Key className="w-4 h-4" />}
                  disabled={!!isSelf}
                  onClick={() => handleChangePassword(record)}
                />
              </Tooltip>
            </PermissionGate>
            <PermissionGate module="Employees" action="Delete">
              <Tooltip
                title={isSelf ? "You cannot delete yourself" : "Delete User"}
              >
                <Button
                  danger
                  icon={<Trash2 className="w-4 h-4" />}
                  disabled={!!isSelf}
                  onClick={() => handleDelete(record._id)}
                />
              </Tooltip>
            </PermissionGate>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <PageMeta
        title="Employees - Zoom Property Admin"
        description="Manage employees and their permissions"
        keywords="employees, employee management, Zoom Property"
        canonicalUrl={`${window.location.origin}/employees`}
        noindex={true}
      />
      <PageHeader
        title="Employees"
        subtitle="Manage all employees"
        breadcrumbs={[
          { title: "Dashboard", path: "/" },
          { title: "Employee Management" },
          { title: "Employees" },
        ]}
        extra={
          <div className="flex flex-wrap items-center gap-2">
            <ExportMenu sheet={buildSheet} disabled={(meta.total || 0) === 0} />
            <PermissionGate module="Employees" action="Create">
              <Button
                type="primary"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => navigate("/employees/create")}
              >
                Add New User
              </Button>
            </PermissionGate>
          </div>
        }
      />

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search users by name or email..."
          prefix={<Search className="w-4 h-4 text-gray-400" />}
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setCurrentPage(1);
          }}
          className="max-w-md"
        />
      </div>

      <DataTable
        data={users}
        columns={columns}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        limit={limit}
        setLimit={setLimit}
        total={meta.total || 0}
        isPaginate={meta.totalPage > 1}
        loading={isFetching}
        rowKey="_id"
        // The row opens the person, the way every other list here behaves.
        // The action buttons stop the click themselves, so pressing one does
        // not navigate away from the list mid-task.
        onRow={(record: any) => ({
          onClick: () => navigate(`/employees/view/${record._id}`),
          className: "cursor-pointer",
        })}
      />

      <IdCardModal
        person={
          idCardFor
            ? {
                name: idCardFor.name,
                code: idCardFor.employeeId || idCardFor.phone,
                role: idCardFor.designationId?.name || idCardFor.role || "Staff",
                photo: idCardFor.profilePhoto,
                phone: idCardFor.phone,
                department: idCardFor.designationId?.name,
                departmentLabel: "DEPARTMENT",
                group: idCardFor.role
                  ? String(idCardFor.role).replace(/_/g, " ")
                  : undefined,
                groupLabel: "ROLE",
                audience: "employee" as const,
                email: idCardFor.email,
                joinedOn: idCardFor.createdAt,
              }
            : null
        }
        onClose={() => setIdCardFor(null)}
      />

      {isOpenCreateModal && (
        <CreateUserModal
          open={isOpenCreateModal}
          setOpen={setIsOpenCreateModal}
        />
      )}

      {isOpenUpdateModal && selectedUser && (
        <UpdateUserModal
          open={isOpenUpdateModal}
          setOpen={setIsOpenUpdateModal}
          data={selectedUser}
        />
      )}

      {isOpenChangePasswordModal && selectedUser && (
        <ChangePasswordModal
          open={isOpenChangePasswordModal}
          setOpen={setIsOpenChangePasswordModal}
          userId={selectedUser._id}
          userName={selectedUser.name}
        />
      )}
    </div>
  );
};

export default Users;
