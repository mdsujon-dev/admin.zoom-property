import { Button, Divider, Form, Input, Modal, Select } from "antd";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import UploadImage from "../../../components/shared/UploadImage";
import CreateDesignationModal from "../../../components/modal/settings/designation/CreateDesignationModal";
import CreateRoleModal from "../../../components/modal/settings/role/CreateRoleModal";
import { useGetDesignationsQuery } from "../../../redux/features/designation/designationApi";
import { useGetRolesQuery } from "../../../redux/features/role/roleApi";
import { useCreateUserMutation } from "../../../redux/features/user/userApi";

interface CreateUserModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);
  const [isCreateDesignationOpen, setIsCreateDesignationOpen] = useState(false);

  const { data: rolesData, isFetching: rolesLoading } = useGetRolesQuery({
    limit: 100,
  });
  const { data: designationsData, isFetching: designationsLoading } =
    useGetDesignationsQuery({ scope: "employee" });

  const roles = (rolesData?.result || [])
    .filter(
      (r: any) =>
        r.isActive !== false && r.role?.toUpperCase() !== "SUPER_ADMIN",
    )
    .map((r: any) => ({ value: r._id, label: r.role }));

  const designations = (designationsData?.data || [])
    .filter((d: any) => d.is_active !== false)
    .map((d: any) => ({ value: d._id, label: d.name }));

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open, form]);

  const handleSubmit = async (values: any) => {
    try {
      const { confirmPassword, profilePhotoId, photoUrl, ...rest } = values;
      void confirmPassword;
      void profilePhotoId;

      const payload = {
        ...rest,
        profilePhoto: photoUrl || values.profilePhoto,
      };

      await createUser(payload).unwrap();
      toast.success("Employee created successfully!");
      form.resetFields();
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create employee");
    }
  };

  return (
    <>
      <Modal
        title={<span className="text-lg font-bold text-secondary-900">Add New Employee</span>}
        open={open}
        onCancel={() => setOpen(false)}
        width={720}
        footer={null}
        destroyOnClose
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          className="pt-2 space-y-4"
        >
          <div className="grid gap-x-4 gap-y-2 md:grid-cols-3">
            <Form.Item
              label={<span className="text-xs font-semibold text-secondary-700">Full Name <span className="text-red-500">*</span></span>}
              name="name"
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input placeholder="Enter full name" />
            </Form.Item>

            <Form.Item
              label={<span className="text-xs font-semibold text-secondary-700">Email <span className="text-red-500">*</span></span>}
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Enter a valid email address" },
              ]}
            >
              <Input placeholder="admin@gmail.com" />
            </Form.Item>

            <Form.Item
              label={<span className="text-xs font-semibold text-secondary-700">Mobile <span className="text-red-500">*</span></span>}
              name="phone"
              rules={[{ required: true, message: "Mobile number is required" }]}
            >
              <Input placeholder="01XXXXXXXXX" />
            </Form.Item>

            <Form.Item
              label={<span className="text-xs font-semibold text-secondary-700">Password <span className="text-red-500">*</span></span>}
              name="password"
              rules={[
                { required: true, message: "Password is required" },
                { min: 6, message: "At least 6 characters" },
              ]}
            >
              <Input.Password placeholder="........" />
            </Form.Item>

            <Form.Item
              label={<span className="text-xs font-semibold text-secondary-700">Permission Role <span className="text-red-500">*</span></span>}
              name="roleId"
              rules={[{ required: true, message: "Pick a role" }]}
            >
              <Select
                showSearch
                optionFilterProp="label"
                loading={rolesLoading}
                options={roles}
                placeholder="Select permission role"
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider className="my-1" />
                    <div className="p-1">
                      <Button
                        type="text"
                        block
                        icon={<Plus className="w-3.5 h-3.5 text-primary-600" />}
                        onClick={() => setIsCreateRoleOpen(true)}
                        className="flex items-center justify-start text-xs font-medium text-primary-600 hover:bg-primary-50"
                      >
                        + Create New Role
                      </Button>
                    </div>
                  </>
                )}
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-xs font-semibold text-secondary-700">Designation</span>}
              name="designationId"
            >
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                loading={designationsLoading}
                options={designations}
                placeholder="Select designation"
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider className="my-1" />
                    <div className="p-1">
                      <Button
                        type="text"
                        block
                        icon={<Plus className="w-3.5 h-3.5 text-primary-600" />}
                        onClick={() => setIsCreateDesignationOpen(true)}
                        className="flex items-center justify-start text-xs font-medium text-primary-600 hover:bg-primary-50"
                      >
                        + Create New Designation
                      </Button>
                    </div>
                  </>
                )}
              />
            </Form.Item>
          </div>

          <div className="pt-2 border-t border-secondary-100">
            <p className="mb-2 text-xs font-semibold text-secondary-700">Photo</p>
            <UploadImage
              form={form}
              fieldPath="photoUrl"
              idFieldPath="profilePhoto"
              mode="single"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-secondary-100">
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              onClick={() => form.submit()}
              loading={isLoading}
            >
              Add Employee
            </Button>
          </div>
        </Form>
      </Modal>

      {isCreateRoleOpen && (
        <CreateRoleModal
          open={isCreateRoleOpen}
          setOpen={setIsCreateRoleOpen}
        />
      )}

      {isCreateDesignationOpen && (
        <CreateDesignationModal
          open={isCreateDesignationOpen}
          setOpen={setIsCreateDesignationOpen}
          defaultScope="employee"
        />
      )}
    </>
  );
};

export default CreateUserModal;
