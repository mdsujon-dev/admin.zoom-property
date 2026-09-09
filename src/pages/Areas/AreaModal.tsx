import { Button, Col, Form, Input, InputNumber, Modal, Row, Switch } from "antd";
import { useEffect } from "react";
import { toast } from "react-toastify";

import UploadMedia from "../../components/shared/UploadMedia";
import {
  useCreateAreaMutation,
  useUpdateAreaMutation,
} from "../../redux/features/area/areaApi";

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
        initialValues={{ city: "Dhaka", isActive: true, featured: false, order: 0 }}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Name the area" }]}
            >
              <Input placeholder="Gulshan (1 & 2)" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Name (Bangla)" name="nameBn">
              <Input placeholder="গুলশান" />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item label="City" name="city">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Tagline" name="tagline">
              <Input placeholder="Premium service" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Tagline (Bangla)" name="taglineBn">
              <Input />
            </Form.Item>
          </Col>

          <Col xs={12} md={8}>
            <Form.Item label="Median price (৳)" name="medianPrice">
              <InputNumber className="!w-full" min={0} />
            </Form.Item>
          </Col>
          <Col xs={12} md={8}>
            <Form.Item label="Price per sq ft (৳)" name="pricePerSqft">
              <InputNumber className="!w-full" min={0} />
            </Form.Item>
          </Col>
          <Col xs={12} md={8}>
            <Form.Item label="Rental yield" name="rentalYield">
              <Input placeholder="5.2%" />
            </Form.Item>
          </Col>

          <Col xs={12} md={8}>
            <Form.Item label="Security tier" name="securityTier">
              <Input placeholder="Diplomatic zone" />
            </Form.Item>
          </Col>
          <Col xs={12} md={8}>
            <Form.Item label="Metro connectivity" name="metroConnectivity">
              <Input placeholder="MRT-6, 800m" />
            </Form.Item>
          </Col>
          <Col xs={12} md={8}>
            <Form.Item
              label="Order"
              name="order"
              tooltip="The home page shows the first ten, lowest first."
            >
              <InputNumber className="!w-full" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item label="Note" name="note">
              <Input.TextArea rows={2} placeholder="Why people choose it" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item label="Note (Bangla)" name="noteBn">
              <Input.TextArea rows={2} />
            </Form.Item>
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
