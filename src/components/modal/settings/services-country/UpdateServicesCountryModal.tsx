import { Button, Form, Input, Modal, Switch } from "antd";
import { Save } from "lucide-react";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import {
  IServicesCountry,
  useUpdateServicesCountryMutation,
} from "../../../../redux/features/settings/servicesCountryApi";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  data: IServicesCountry;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const UpdateServicesCountryModal: React.FC<Props> = ({
  open,
  setOpen,
  data,
}) => {
  const [form] = Form.useForm();
  const [updateServicesCountry, { isLoading }] =
    useUpdateServicesCountryMutation();

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name,
        slug: data.slug,
        isActive: data.isActive ?? true,
      });
    }
  }, [data, form]);

  const handleSubmit = async (values: {
    name?: string;
    slug?: string;
    isActive?: boolean;
  }) => {
    if (!data?._id) return;
    try {
      const payload: Partial<IServicesCountry> = {
        name: values.name?.trim(),
        slug: values.slug?.trim() || (values.name ? slugify(values.name) : undefined),
        isActive: values.isActive,
      };
      const res = await updateServicesCountry({
        id: data._id,
        data: payload,
      }).unwrap();
      if (res.success) {
        toast.success(res.message || "Service country updated successfully");
        setOpen(false);
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to update service country"
      );
    }
  };

  return (
    <Modal
      title="Update Service Country"
      open={open}
      onCancel={() => setOpen(false)}
      width={520}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please enter a country name" },
            { max: 100, message: "Name must be 100 characters or fewer" },
          ]}
        >
          <Input placeholder="e.g. Bangladesh" />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          tooltip="URL-safe identifier. Leave empty to regenerate from name."
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
              Update
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateServicesCountryModal;
