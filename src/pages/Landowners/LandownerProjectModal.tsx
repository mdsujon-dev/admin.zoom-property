import { Button, Col, Form, Input, InputNumber, Modal, Row, Switch } from "antd";
import { useEffect } from "react";
import { toast } from "react-toastify";

import LangInput from "../../components/Common/LangInput";
import UploadMedia from "../../components/shared/UploadMedia";
import {
  useCreateLandownerProjectMutation,
  useUpdateLandownerProjectMutation,
} from "../../redux/features/landowner/landownerApi";

interface Props {
  open: boolean;
  onClose: () => void;
  project?: any;
}

/**
 * One completed joint venture, as evidence for the next landowner.
 *
 * The share and the handover year are the two numbers a landowner reads first
 * - what they got, and whether it arrived when it was promised - so both are
 * required in practice even though the schema tolerates their absence on a
 * half-entered record.
 */
const LandownerProjectModal = ({ open, onClose, project }: Props) => {
  const [form] = Form.useForm();
  const [createProject, { isLoading: creating }] =
    useCreateLandownerProjectMutation();
  const [updateProject, { isLoading: updating }] =
    useUpdateLandownerProjectMutation();

  useEffect(() => {
    if (!open) return form.resetFields();
    if (project) {
      form.setFieldsValue({
        ...project,
        image: project.image?._id ?? project.image,
        imageUrl: project.image?.key,
      });
    }
  }, [open, project, form]);

  const onFinish = async (values: any) => {
    const { imageUrl, ...rest } = values;
    void imageUrl;
    try {
      const res: any = project
        ? await updateProject({ id: project._id, data: rest }).unwrap()
        : await createProject(rest).unwrap();
      toast.success(res?.message || "Saved");
      onClose();
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not save the case study");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={project ? "Edit case study" : "Add a case study"}
      footer={null}
      width={720}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ isPublished: false, isHome: true, order: 0 }}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <LangInput
              label="Project name"
              name="name"
              lang="en"
              required
              placeholder="The Imperial Serenade"
            />
          </Col>
          <Col xs={24} md={12}>
            <LangInput
              label="Project name (Bangla)"
              name="nameBn"
              lang="bn"
              sourceFieldName="name"
              form={form}
              placeholder="বাংলা নাম"
            />
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Location" name="location">
              <Input placeholder="Gulshan Avenue, Dhaka" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Location (Bangla)" name="locationBn">
              <Input placeholder="গুলশান অ্যাভিনিউ, ঢাকা" />
            </Form.Item>
          </Col>

          <Col xs={12} md={6}>
            <Form.Item
              label="Land size (katha)"
              name="landSizeKatha"
              tooltip="As land is measured here. Decimals are fine: 14.5."
            >
              <InputNumber className="!w-full" min={0} step={0.5} />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item label="Floors" name="floors">
              <InputNumber className="!w-full" min={0} />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item
              label="Owner share (%)"
              name="ownerSharePercent"
              tooltip="The landowner's share of the finished building."
            >
              <InputNumber className="!w-full" min={0} max={100} />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item label="Completed" name="completedYear">
              <InputNumber className="!w-full" min={1900} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Photograph" name="imageUrl">
              <UploadMedia
                form={form}
                fieldPath="imageUrl"
                idFieldPath="image"
                type="image"
              />
            </Form.Item>
            <Form.Item name="image" hidden>
              <Input />
            </Form.Item>
          </Col>

          <Col xs={12} md={4}>
            <Form.Item label="Order" name="order">
              <InputNumber className="!w-full" min={0} />
            </Form.Item>
          </Col>
          <Col xs={12} md={4}>
            <Form.Item label="On page" name="isHome" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={12} md={4}>
            <Form.Item
              label="Published"
              name="isPublished"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={creating || updating}>
            {project ? "Save changes" : "Add case study"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default LandownerProjectModal;
