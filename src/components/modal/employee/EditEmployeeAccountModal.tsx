import { Button, Form, Input, Modal, Select } from "antd";
import { useEffect } from "react";
import { toast } from "react-toastify";

import { useGetDesignationsQuery } from "../../../redux/features/designation/designationApi";
import { useUpdateUserMutation } from "../../../redux/features/user/userApi";

interface Props {
  employee: any;
  open: boolean;
  onClose: () => void;
}

/**
 * The employee's own details, edited from their page.
 *
 * Their role and permissions are not here. Those are granted, not typed in —
 * they belong to Employee Management, where the person doing the granting can
 * see the whole set at once. Mixing them into a "fix the phone number" dialog
 * is how somebody changes a permission by accident.
 */
const EditEmployeeAccountModal = ({ employee, open, onClose }: Props) => {
  const [form] = Form.useForm();
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const { data: designationsData } = useGetDesignationsQuery({
    scope: "employee",
  });
  const designations: any[] = (designationsData?.data || []).filter(
    (d: any) => d.is_active !== false
  );

  useEffect(() => {
    if (open && employee) {
      form.setFieldsValue({
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        designationId: employee.designationId?._id || employee.designationId,
      });
    } else {
      form.resetFields();
    }
  }, [open, employee, form]);

  const onFinish = async (values: any) => {
    try {
      await updateUser({ id: employee._id, data: values }).unwrap();
      toast.success("Account information updated");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update");
    }
  };

  return (
    <Modal
      title="Edit Account Information"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={640}
    >
      <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
        <div className="grid gap-4 md:grid-cols-2">
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            {/* This is how they sign in, so it is worth saying plainly. */}
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="Designation" name="designationId">
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="Select"
              options={designations.map((d: any) => ({
                value: d._id,
                label: d.name,
              }))}
            />
          </Form.Item>
        </div>

        <p className="text-xs text-secondary-400">
          Role and permissions are granted under Employee Management, not here.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Save Changes
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditEmployeeAccountModal;
