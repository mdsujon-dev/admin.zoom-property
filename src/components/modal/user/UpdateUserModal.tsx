import { Button, Form, Input, Modal, Select } from "antd";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { FormInput } from "../../../components/Form/FormInput";
import { FormSelect } from "../../../components/Form/FormSelect";
import UploadImage from "../../../components/shared/UploadImage";
import { useGetDesignationsQuery } from "../../../redux/features/designation/designationApi";
import { useGetRolesQuery } from "../../../redux/features/role/roleApi";
import { useUpdateUserMutation } from "../../../redux/features/user/userApi";

/** Sunday-first, the order a week is read in and the order the server keys on. */
const WEEKDAY_OPTIONS = [
  { value: "sun", label: "Sunday" },
  { value: "mon", label: "Monday" },
  { value: "tue", label: "Tuesday" },
  { value: "wed", label: "Wednesday" },
  { value: "thu", label: "Thursday" },
  { value: "fri", label: "Friday" },
  { value: "sat", label: "Saturday" },
];

interface UpdateUserModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  data: any;
}

const UpdateUserModal: React.FC<UpdateUserModalProps> = ({
  open,
  setOpen,
  data,
}) => {
  const [form] = Form.useForm();
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const { data: rolesData, isFetching: rolesLoading } = useGetRolesQuery({
    limit: 100,
  });
  // Employee designations only — an agent's belong to the agent form, and the
  // client one is issued by the system and never listed.
  const { data: designationsData, isFetching: designationsLoading } =
    useGetDesignationsQuery({ scope: "employee" });
  // Exclude the protected SUPER_ADMIN role — it can never be assigned here.
  const roles: any[] = (rolesData?.result || []).filter(
    (r: any) =>
      r.isActive !== false && r.role?.toUpperCase() !== "SUPER_ADMIN"
  );
  const designations: any[] = (designationsData?.data || []).filter(
    (d: any) => d.is_active !== false
  );

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name,
        email: data.email,
        roleId: data.roleId?._id || data.roleId,
        designationId: data.designationId?._id || data.designationId,
        phone: data.phone,
        profilePhoto: data.profilePhoto,
        weekendDays: data.weekendDays || [],
        note: data.note,
      });
    }
  }, [data, form]);

  const handleSubmit = async (values: any) => {
    try {
      const { profilePhotoId, ...rest } = values;
      void profilePhotoId;
      await updateUser({ id: data._id, data: rest }).unwrap();
      toast.success("User updated successfully!");
      form.resetFields();
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update user");
    }
  };

  return (
    <Modal
      title="Update User"
      open={open}
      onCancel={() => setOpen(false)}
      width={600}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="mb-4">
          <UploadImage
            form={form}
            fieldPath="profilePhoto"
            idFieldPath="profilePhotoId"
            mode="single"
          />
          <div className="text-xs text-secondary-500 mt-1">
            <p>Upload a square photo for the ID card.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 mb-4">
          <FormInput
            label="Name"
            name="name"
            placeholder="Enter user name"
            rules={[{ required: true, message: "Please enter user name" }]}
          />

          <FormInput
            label="Email"
            name="email"
            placeholder="Enter email address"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          />

          <FormSelect
            label="Role"
            name="roleId"
            placeholder={rolesLoading ? "Loading roles..." : "Select role"}
            rules={[{ required: true, message: "Please select a role" }]}
            options={roles.map((r: any) => ({
              value: r._id,
              label: r.role,
            }))}
          />

          <FormSelect
            label="Designation"
            name="designationId"
            placeholder={
              designationsLoading
                ? "Loading designations..."
                : "Select designation"
            }
            options={designations.map((d: any) => ({
              value: d._id,
              label: d.name,
            }))}
          />

          <FormInput
            label="Phone"
            name="phone"
            placeholder="Enter phone number (optional)"
          />

          {/* Their own days off, not the company's.
              The office does not all take the same day — the accountant is off
              Friday and Saturday, the caretaker on a Sunday because somebody
              has to open the building on Friday. Held against one shared week,
              every one of those reads as a month of absences. */}
          <Form.Item
            label="Weekly off days"
            name="weekendDays"
            className="md:col-span-2"
            extra="Leave empty to follow the company's week (Friday)."
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="Company default"
              options={WEEKDAY_OPTIONS}
            />
          </Form.Item>

          <Form.Item label="Notes" name="note" className="md:col-span-2">
            <Input.TextArea
              rows={2}
              placeholder="Anything the office needs to remember (optional)"
            />
          </Form.Item>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={isLoading}
            className="w-fit"
          >
            Update
          </Button>
          <Button
            onClick={() => setOpen(false)}
            className="w-fit"
            type="default"
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default UpdateUserModal;
