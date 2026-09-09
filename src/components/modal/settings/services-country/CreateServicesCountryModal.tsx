import { Button, Form, Input, Modal, Switch } from "antd";
import { Save } from "lucide-react";
import React from "react";
import { toast } from "react-toastify";
import { useCreateServicesCountryMutation } from "../../../../redux/features/settings/servicesCountryApi";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const CreateServicesCountryModal: React.FC<Props> = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const [createServicesCountry, { isLoading }] =
    useCreateServicesCountryMutation();

  const handleSubmit = async (values: {
    name: string;
    slug?: string;
    isActive?: boolean;
  }) => {
    try {
      const payload = {
        name: values.name.trim(),
        slug: values.slug?.trim() || slugify(values.name),
        isActive: values.isActive ?? true,
      };
      const res = await createServicesCountry(payload).unwrap();
      if (res.success) {
        toast.success(res.message || "Service country created successfully");
        form.resetFields();
        setOpen(false);
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to create service country"
      );
    }
  };

  return (
    <Modal
      title="Create Service Country"
      open={open}
      onCancel={() => setOpen(false)}
      width={520}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ isActive: true }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please enter a country name" },
            { max: 100, message: "Name must be 100 characters or fewer" },
          ]}
        >
          <Input
            placeholder="e.g. Bangladesh"
            onChange={(e) => {
              // Auto-fill slug if untouched
              const current = form.getFieldValue("slug");
              if (!current) {
                form.setFieldValue("slug", slugify(e.target.value));
              }
            }}
          />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          tooltip="URL-safe identifier. Auto-generated from name if left empty."
          rules={[{ max: 120, message: "Slug must be 120 characters or fewer" }]}
        >
          <Input placeholder="e.g. bangladesh" />
        </Form.Item>

        <Form.Item label="Active" name="isActive" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item className="!mb-0">
          <div className="flex justify-end gap-2">
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              icon={<Save className="w-4 h-4" />}
              onClick={() => form.submit()}
              loading={isLoading}
            >
              Create
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateServicesCountryModal;
