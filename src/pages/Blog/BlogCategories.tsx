import { Button, Form, Input, List, Popconfirm, Space, Switch } from "antd";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

import PageHeader from "../../components/Common/PageHeader";
import PageMeta from "../../components/Common/PageMeta";
import {
  useCreateBlogCategoryMutation,
  useDeleteBlogCategoryMutation,
  useGetBlogCategoriesQuery,
  useUpdateBlogCategoryMutation,
} from "../../redux/features/blog/blogApi";

const BlogCategories = () => {
  const [form] = Form.useForm();
  const { data: categories = [], isFetching } = useGetBlogCategoriesQuery({});
  const [createCategory, { isLoading: creating }] =
    useCreateBlogCategoryMutation();
  const [updateCategory] = useUpdateBlogCategoryMutation();
  const [deleteCategory] = useDeleteBlogCategoryMutation();
  const [busyId, setBusyId] = useState<string | null>(null);

  const onAdd = async (values: any) => {
    try {
      await createCategory(values).unwrap();
      toast.success("Category added");
      form.resetFields();
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not add the category");
    }
  };

  const onToggle = async (id: string, isActive: boolean) => {
    setBusyId(id);
    try {
      await updateCategory({ id, data: { isActive: !isActive } }).unwrap();
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not update the category");
    } finally {
      setBusyId(null);
    }
  };

  const onDelete = async (id: string) => {
    try {
      await deleteCategory(id).unwrap();
      toast.success("Category deleted");
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not delete the category");
    }
  };

  return (
    <div>
      <PageMeta title="Blog Categories · Zoom Property Admin" noindex />
      <PageHeader
        title="Blog Categories"
        subtitle="Manage categories for your blog articles"
        breadcrumbs={[
          { title: "Dashboard", path: "/" },
          { title: "Blog", path: "/blog" },
          { title: "Categories" },
        ]}
      />

      <div className="max-w-2xl bg-white p-6 rounded-lg border border-secondary-100">
        <Form form={form} layout="inline" onFinish={onAdd} className="!mb-6 gap-2">
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Name it" }]}
            className="!flex-1"
          >
            <Input placeholder="Category Name (e.g., Market)" />
          </Form.Item>
          <Form.Item name="nameBn">
            <Input placeholder="বাংলা" />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<Plus className="h-4 w-4" />}
            loading={creating}
          >
            Add
          </Button>
        </Form>

        <List
          loading={isFetching}
          dataSource={categories as any[]}
          locale={{ emptyText: "No categories yet" }}
          renderItem={(c: any) => (
            <List.Item
              className="hover:bg-gray-50 px-4 -mx-4 rounded-md transition-colors"
              actions={[
                <Switch
                  key="active"
                  size="small"
                  checked={c.isActive}
                  loading={busyId === c._id}
                  onChange={() => onToggle(c._id, c.isActive)}
                />,
                <Popconfirm
                  key="delete"
                  title="Delete this category?"
                  onConfirm={() => onDelete(c._id)}
                >
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<Trash2 className="h-4 w-4" />}
                  />
                </Popconfirm>,
              ]}
            >
              <Space direction="vertical" size={0}>
                <span className="font-medium text-secondary-800">{c.name}</span>
                {c.nameBn && (
                  <span className="text-xs text-secondary-400">{c.nameBn}</span>
                )}
              </Space>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default BlogCategories;
