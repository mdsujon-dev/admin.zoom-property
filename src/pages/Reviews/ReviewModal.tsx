import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Rate,
  Row,
  Select,
  Switch,
} from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import UploadMedia from "../../components/shared/UploadMedia";
import { useGetPropertiesQuery } from "../../redux/features/property/propertyApi";
import {
  useCreateReviewMutation,
  useUpdateReviewMutation,
} from "../../redux/features/review/reviewApi";

interface Props {
  open: boolean;
  onClose: () => void;
  review?: any;
}

/**
 * A client review.
 *
 * Nothing here publishes it. A review goes up because somebody decided it
 * should, which is the switch on the list — so the form can be filled in by
 * whoever took the call without that being the same as putting it on the site.
 */
const ReviewModal = ({ open, onClose, review }: Props) => {
  const [form] = Form.useForm();
  const [propertySearch, setPropertySearch] = useState("");
  const [createReview, { isLoading: creating }] = useCreateReviewMutation();
  const [updateReview, { isLoading: updating }] = useUpdateReviewMutation();

  const { data: properties } = useGetPropertiesQuery({
    limit: 20,
    searchTerm: propertySearch || undefined,
  });

  useEffect(() => {
    if (!open) return form.resetFields();
    if (review) {
      form.setFieldsValue({
        ...review,
        property: review.property?._id ?? review.property,
        photo: review.photo?._id ?? review.photo,
        photoUrl: review.photo?.key,
        videoPoster: review.video?.poster?._id ?? review.video?.poster,
        videoPosterUrl: review.video?.poster?.key,
        video: {
          youtubeUrl: review.video?.youtubeUrl,
          duration: review.video?.duration,
        },
      });
    }
  }, [open, review, form]);

  const onFinish = async (values: any) => {
    const { photoUrl, videoPosterUrl, videoPoster, ...rest } = values;
    const body = {
      ...rest,
      video: { ...(rest.video || {}), poster: videoPoster || null },
    };
    try {
      const res: any = review
        ? await updateReview({ id: review._id, data: body }).unwrap()
        : await createReview(body).unwrap();
      toast.success(res?.message || "Saved");
      onClose();
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not save the review");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={review ? "Edit review" : "Add a review"}
      footer={null}
      width={720}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ rating: 5, isPublished: false, featured: false, order: 0 }}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Client"
              name="clientName"
              rules={[{ required: true, message: "Who said it?" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Client (Bangla)" name="clientNameBn">
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="What they do" name="role">
              <Input placeholder="Consultant, Dhaka" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="What they do (Bangla)" name="roleBn">
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Quote"
              name="quote"
              rules={[{ required: true, message: "The quote is the review" }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item label="Quote (Bangla)" name="quoteBn">
              <Input.TextArea rows={2} />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item label="Rating" name="rating">
              <Rate />
            </Form.Item>
          </Col>
          <Col xs={24} md={16}>
            <Form.Item
              label="Property"
              name="property"
              tooltip="Ties the quote to something real. Leave blank for older deals."
            >
              <Select
                allowClear
                showSearch
                filterOption={false}
                onSearch={setPropertySearch}
                placeholder="Search listings"
                options={(properties?.result || []).map((p: any) => ({
                  value: p._id,
                  label: `${p.referenceNo} · ${p.title}`,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              label="Property, in words"
              name="propertyLabel"
              tooltip="Used when the deal is not a listing on file."
            >
              <Input placeholder="3-bed apartment, Banani" />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item label="Photo" name="photoUrl">
              <UploadMedia
                form={form}
                fieldPath="photoUrl"
                idFieldPath="photo"
                type="image"
              />
            </Form.Item>
            <Form.Item name="photo" hidden>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={16}>
            <Row gutter={12}>
              <Col xs={24} md={16}>
                <Form.Item label="Video URL" name={["video", "youtubeUrl"]}>
                  <Input placeholder="https://youtube.com/watch?v=…" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="Duration" name={["video", "duration"]}>
                  <Input placeholder="1:24" />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item label="Video poster" name="videoPosterUrl">
                  <UploadMedia
                    form={form}
                    fieldPath="videoPosterUrl"
                    idFieldPath="videoPoster"
                    type="image"
                  />
                </Form.Item>
                <Form.Item name="videoPoster" hidden>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col xs={12} md={8}>
            <Form.Item label="Featured" name="featured" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={12} md={8}>
            <Form.Item label="Order" name="order">
              <InputNumber className="!w-full" />
            </Form.Item>
          </Col>
        </Row>

        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={creating || updating}>
            {review ? "Save changes" : "Add review"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ReviewModal;
