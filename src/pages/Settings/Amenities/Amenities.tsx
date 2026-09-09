import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Space,
  Switch,
  Table,
  Tooltip,
} from "antd";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import PageHeader from "../../../components/Common/PageHeader";
import PageMeta from "../../../components/Common/PageMeta";
import PermissionGate from "../../../components/Common/PermissionGate";
import {
  useCreatePropertyOptionMutation,
  useDeletePropertyOptionMutation,
  useGetPropertyOptionsQuery,
  useUpdatePropertyOptionMutation,
} from "../../../redux/features/property/propertyApi";

/**
 * The amenity list every listing form picks from.
 *
 * Deleting one that listings still use is refused by the server — their feature
 * lists would come back with holes in them. Switching it off keeps the existing
 * listings honest and stops it being offered on new ones, which is what
 * "we don't advertise that any more" actually means.
 */
const Amenities = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const { data: rows = [], isFetching } = useGetPropertyOptionsQuery({
    kind: "amenities",
  });
  const [createOption, { isLoading: creating }] =
    useCreatePropertyOptionMutation();
  const [updateOption, { isLoading: updating }] =
    useUpdatePropertyOptionMutation();
  const [deleteOption] = useDeletePropertyOptionMutation();

  useEffect(() => {
    if (!open) return form.resetFields();
    if (editing) form.setFieldsValue(editing);
  }, [open, editing, form]);

  const onFinish = async (values: any) => {
    try {
      if (editing) {
        await updateOption({
          kind: "amenities",
          id: editing._id,
          data: values,
        }).unwrap();
        toast.success("Amenity updated");
      } else {
        await createOption({ kind: "amenities", data: values }).unwrap();
        toast.success("Amenity added");
      }
      setOpen(false);
      setEditing(null);
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not save the amenity");
    }
  };

  const onDelete = async (id: string) => {
    try {
      await deleteOption({ kind: "amenities", id }).unwrap();
      toast.success("Amenity deleted");
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not delete the amenity");
    }
  };

  const columns = [
    {
      title: "Amenity",
      dataIndex: "name",
      key: "name",
      render: (name: string, r: any) => (
        <div>
          <p className="font-medium text-secondary-800">{name}</p>
          {r.nameBn && (
            <p className="text-xs text-secondary-400">{r.nameBn}</p>
          )}
        </div>
      ),
    },
    {
      title: "Icon",
      dataIndex: "icon",
      key: "icon",
      width: 160,
      render: (icon: string) =>
        icon ? (
          <span className="font-mono text-xs">{icon}</span>
        ) : (
          <span className="text-secondary-300">—</span>
        ),
    },
    {
      title: "Order",
      dataIndex: "order",
      key: "order",
      width: 90,
      align: "center" as const,
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      width: 100,
      render: (active: boolean, r: any) => (
        <PermissionGate
          module="Properties"
          action="Update"
          fallback={<span>{active ? "Yes" : "No"}</span>}
        >
          <Switch
            size="small"
            checked={active}
            onChange={() =>
              updateOption({
                kind: "amenities",
                id: r._id,
                data: { isActive: !active },
              })
            }
          />
        </PermissionGate>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: unknown, r: any) => (
        <Space>
          <PermissionGate module="Properties" action="Update">
            <Tooltip title="Edit">
              <Button
                icon={<Edit className="h-4 w-4" />}
                onClick={() => {
                  setEditing(r);
                  setOpen(true);
                }}
              />
            </Tooltip>
          </PermissionGate>
          <PermissionGate module="Properties" action="Delete">
            <Popconfirm
              title="Delete this amenity?"
              onConfirm={() => onDelete(r._id)}
            >
              <Button danger icon={<Trash2 className="h-4 w-4" />} />
            </Popconfirm>
          </PermissionGate>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageMeta
        title="Amenities · Zoom Property Admin"
        description="The amenity list every listing form picks from."
        noindex
      />
      <PageHeader
        title="Amenities"
        subtitle="What a listing can say it has"
        breadcrumbs={[
          { title: "Dashboard", path: "/" },
          { title: "Settings" },
          { title: "Amenities" },
        ]}
        extra={
          <PermissionGate module="Properties" action="Create">
            <Button
              type="primary"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
            >
              Add amenity
            </Button>
          </PermissionGate>
        }
      />

      <Table
        dataSource={rows as any[]}
        columns={columns as any}
        loading={isFetching}
        rowKey="_id"
        pagination={false}
        className="rounded-xl bg-white"
      />

      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
          setEditing(null);
        }}
        title={editing ? "Edit amenity" : "Add an amenity"}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ isActive: true, order: 0 }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name the amenity" }]}
          >
            <Input placeholder="Lift" />
          </Form.Item>
          <Form.Item label="Name (Bangla)" name="nameBn">
            <Input placeholder="লিফট" />
          </Form.Item>
          <Form.Item
            label="Icon"
            name="icon"
            tooltip="A lucide icon name, so the website can draw it without a lookup table."
          >
            <Input placeholder="arrow-up-down" />
          </Form.Item>
          <Space size="large">
            <Form.Item label="Order" name="order">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="Active" name="isActive" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Space>

          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                setOpen(false);
                setEditing(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={creating || updating}
            >
              {editing ? "Save changes" : "Add amenity"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Amenities;
