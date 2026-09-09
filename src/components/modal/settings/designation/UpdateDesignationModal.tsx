import { Button, Form, Input, Modal, Switch } from "antd";
import { Save } from "lucide-react";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useUpdateDesignationMutation } from "../../../../redux/features/designation/designationApi";
import { ScopeRadio, type SelectableScope } from "./designationScopes";

interface UpdateDesignationModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  data: {
    _id: string;
    name: string;
    description?: string;
    is_active?: boolean;
    scope?: string;
  };
}

const UpdateDesignationModal: React.FC<UpdateDesignationModalProps> = ({
  open,
  setOpen,
  data,
}) => {
  const [form] = Form.useForm();
  const [updateDesignation, { isLoading }] = useUpdateDesignationMutation();

  useEffect(() => {
    if (open && data) {
      form.setFieldsValue({
        name: data.name,
        description: data.description,
        is_active: data.is_active ?? true,
        // Rows written before scopes existed have no value; they have always
        // behaved as employee designations, so that is what they are.
        scope: data.scope === "agent" ? "agent" : "employee",
      });
    }
  }, [open, data, form]);

  const handleSubmit = async (values: {
    name?: string;
    description?: string;
    is_active?: boolean;
    scope?: SelectableScope;
  }) => {
    try {
      await updateDesignation({ id: data._id, data: values }).unwrap();
      toast.success("Designation updated successfully!");
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update designation");
    }
  };

  return (
    <Modal
      title="Update Designation"
      open={open}
      onCancel={() => setOpen(false)}
      width={600}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="For"
          name="scope"
          tooltip="Moving a designation between the two lists does not change anyone already on it."
        >
          <ScopeRadio />
        </Form.Item>

        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter designation name" }]}
        >
          <Input placeholder="e.g. Accountant, Senior Instructor" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={3} placeholder="Enter description (optional)" />
        </Form.Item>

        <Form.Item label="Status" name="is_active" valuePropName="checked">
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            icon={<Save className="w-4 h-4" />}
            onClick={() => form.submit()}
            loading={isLoading}
            block
          >
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateDesignationModal;
