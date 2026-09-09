import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Switch,
} from "antd";
import { useEffect } from "react";
import { toast } from "react-toastify";

import UploadMedia from "../../components/shared/UploadMedia";
import {
  useCreatePostMutation,
  useGetBlogCategoriesQuery,
  useUpdatePostMutation,
} from "../../redux/features/blog/blogApi";

interface Props {
  open: boolean;
  onClose: () => void;
  post?: any;
}

/**
 * An article.
 *
 * `readMinutes` is absent on purpose: it is computed from the body on save at
 * 200 words a minute, which never disagrees with the article the way a
 * hand-typed number does after an edit.
 */
const PostModal = ({ open, onClose, post }: Props) => {
  const [form] = Form.useForm();
  const [createPost, { isLoading: creating }] = useCreatePostMutation();
  const [updatePost, { isLoading: updating }] = useUpdatePostMutation();
  const { data: categories = [] } = useGetBlogCategoriesQuery({});

  useEffect(() => {
    if (!open) return form.resetFields();
    if (post) {
      form.setFieldsValue({
        ...post,
        category: post.category?._id ?? post.category,
        coverImage: post.coverImage?._id ?? post.coverImage,
        coverImageUrl: post.coverImage?.key,
        authorAvatar: post.author?.avatar?._id ?? post.author?.avatar,
        authorAvatarUrl: post.author?.avatar?.key,
        author: {
          name: post.author?.name,
          nameBn: post.author?.nameBn,
          role: post.author?.role,
          roleBn: post.author?.roleBn,
        },
      });
    }
  }, [open, post, form]);

  const onFinish = async (values: any) => {
    const { coverImageUrl, authorAvatarUrl, authorAvatar, ...rest } = values;
    const body = {
      ...rest,
      author: { ...(rest.author || {}), avatar: authorAvatar || null },
    };
    try {
      const res: any = post
        ? await updatePost({ id: post._id, data: body }).unwrap()
        : await createPost(body).unwrap();
      toast.success(res?.message || "Saved");
      onClose();
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not save the article");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={post ? "Edit article" : "Write an article"}
      footer={null}
      width={860}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ status: "draft", featured: false, trending: false }}
      >
        <Row gutter={16}>
          <Col xs={24} md={16}>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Give the article a title" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Pick a category" }]}
            >
              <Select
                showSearch
                optionFilterProp="label"
                options={(categories || []).map((c: any) => ({
                  value: c._id,
                  label: c.name,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item label="Title (Bangla)" name="titleBn">
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Excerpt"
              name="excerpt"
              tooltip="The card summary. Written, not truncated from the body."
            >
              <Input.TextArea rows={2} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Excerpt (Bangla)" name="excerptBn">
              <Input.TextArea rows={2} />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item label="Body" name="content">
              <Input.TextArea rows={8} />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item label="Body (Bangla)" name="contentBn">
              <Input.TextArea rows={5} />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item label="Cover image" name="coverImageUrl">
              <UploadMedia
                form={form}
                fieldPath="coverImageUrl"
                idFieldPath="coverImage"
                type="image"
              />
            </Form.Item>
            <Form.Item name="coverImage" hidden>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={16}>
            <Row gutter={12}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Author"
                  name={["author", "name"]}
                  rules={[{ required: true, message: "Who wrote it?" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Author (Bangla)" name={["author", "nameBn"]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Author role" name={["author", "role"]}>
                  <Input placeholder="Market Analyst" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Author role (Bangla)" name={["author", "roleBn"]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item label="Author photo" name="authorAvatarUrl">
                  <UploadMedia
                    form={form}
                    fieldPath="authorAvatarUrl"
                    idFieldPath="authorAvatar"
                    type="image"
                  />
                </Form.Item>
                <Form.Item name="authorAvatar" hidden>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col xs={24} md={10}>
            <Form.Item label="Tags" name="tags">
              <Select mode="tags" placeholder="market, gulshan, legal" />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item label="Status" name="status">
              <Select
                options={[
                  { value: "draft", label: "Draft" },
                  { value: "published", label: "Published" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col xs={6} md={4}>
            <Form.Item label="Featured" name="featured" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={6} md={4}>
            <Form.Item label="Trending" name="trending" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={creating || updating}>
            {post ? "Save changes" : "Create article"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default PostModal;
