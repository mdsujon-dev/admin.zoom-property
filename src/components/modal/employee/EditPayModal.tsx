import { Button, Form, InputNumber, Modal, Select } from "antd";
import { useEffect } from "react";
import { toast } from "react-toastify";

import { useUpdateUserMutation } from "../../../redux/features/user/userApi";

interface Props {
  /** The staff member whose pay arrangement this is. */
  person: any;
  open: boolean;
  onClose: () => void;
}

const SALARY_TYPES = [
  { value: "monthly", label: "Monthly" },
  { value: "commission", label: "Commission only" },
  { value: "monthly-plus-commission", label: "Monthly + commission" },
];

/**
 * What the agency agreed to pay somebody.
 *
 * The agreed figure is not a payment — it is the arrangement a payment is
 * checked against, which is why it lives on the person and is edited here
 * rather than being typed into the pay dialog each time.
 */
const EditPayModal = ({ person, open, onClose }: Props) => {
  const [form] = Form.useForm();
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  useEffect(() => {
    if (open && person) {
      form.setFieldsValue({
        salary: person.salary,
        salaryType: person.salaryType || "monthly",
      });
    } else {
      form.resetFields();
    }
  }, [open, person, form]);

  const onFinish = async (values: any) => {
    try {
      await updateUser({ id: person._id, data: values }).unwrap();
      toast.success("Pay information updated");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update");
    }
  };

  return (
    <Modal
      title="Edit Pay Information"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
        <div className="grid gap-4 md:grid-cols-2">
          <Form.Item label="Agreed Salary" name="salary">
            <InputNumber className="!w-full" min={0} placeholder="0" />
          </Form.Item>
          <Form.Item label="Paid" name="salaryType">
            <Select options={SALARY_TYPES} />
          </Form.Item>
        </div>

        <p className="text-xs text-secondary-400">
          This is the arrangement, not a payment. Money is recorded on the
          Salary tab and lands in Income &amp; Expense.
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

export default EditPayModal;
