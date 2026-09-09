import { Button, Col, Form, Input, Modal, Row, Switch } from "antd";
import { useEffect } from "react";
import { toast } from "react-toastify";

import UploadMedia from "../../shared/UploadMedia";
import LangInput from "../../Common/LangInput";
import {
  useCreateAreaMutation,
  useUpdateAreaMutation,
} from "../../../redux/features/area/areaApi";

interface Props {
  open: boolean;
  onClose: () => void;
  /** Undefined when adding. */
  area?: any;
}

/**
 * An area, added or edited.
 *
 * The market figures are typed rather than computed: a median taken from this
 * agency's own listings would swing on a single penthouse and would report what
 * we happen to be selling, not what the area is worth.
 */
const AreaModal = ({ open, onClose, area }: Props) => {
  const [form] = Form.useForm();
  const [createArea, { isLoading: creating }] = useCreateAreaMutation();
  const [updateArea, { isLoading: updating }] = useUpdateAreaMutation();

  useEffect(() => {
    if (!open) return form.resetFields();
    if (area) {
      form.setFieldsValue({
        ...area,
        image: area.image?._id ?? area.image,
        imageUrl: area.image?.key,
      });
    }
  }, [open, area, form]);

  const onFinish = async (values: any) => {
    const { imageUrl, ...rest } = values;
    void imageUrl;
    try {
      const res: any = area
        ? await updateArea({ id: area._id, data: rest }).unwrap()
        : await createArea(rest).unwrap();
      toast.success(res?.message || "Saved");
      onClose();
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not save the area");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={area ? "Edit area" : "Add an area"}
      footer={null}
      width={720}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          city: "Dhaka",
          isActive: true,
          featured: false,
          isHome: false,
        }}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <LangInput
              label="Name"
              name="name"
              lang="en"
              required
              placeholder="Gulshan (1 & 2)"
            />
          </Col>
          <Col xs={24} md={12}>
            <LangInput
              label="Name (Bangla)"
              name="nameBn"
              lang="bn"
              sourceFieldName="name"
              form={form}
              placeholder="গুলশান"
            />
          </Col>

          <Col xs={24} md={12}>
            <LangInput label="Tagline" name="tagline" lang="en" placeholder="Premium service" />
          </Col>
          <Col xs={24} md={12}>
            <LangInput
              label="Tagline (Bangla)"
              name="taglineBn"
              lang="bn"
              sourceFieldName="tagline"
              form={form}
              placeholder="প্রিমিয়াম সার্ভিস ও লাইফস্টাইল"
            />
          </Col>

          <Col xs={24}>
            <LangInput label="City" name="city" lang="en" placeholder="Dhaka" />
          </Col>

          <Col xs={24}>
            <LangInput
              label="Note"
              name="note"
              lang="en"
              isTextArea
              placeholder="Why people choose it"
            />
          </Col>
          <Col xs={24}>
            <LangInput
              label="Note (Bangla)"
              name="noteBn"
              lang="bn"
              isTextArea
              sourceFieldName="note"
              form={form}
              placeholder="কেন মানুষ এই এলাকা পছন্দ করে"
            />
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Image" name="imageUrl">
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
          <Col xs={12} md={6}>
            <Form.Item label="Featured" name="featured" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item
              label="On home page"
              name="isHome"
              valuePropName="checked"
              tooltip="Areas ticked here are the ones the home page shows."
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item label="Active" name="isActive" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={creating || updating}>
            {area ? "Save changes" : "Add area"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AreaModal;
