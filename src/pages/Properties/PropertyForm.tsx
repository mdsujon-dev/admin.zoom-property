import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Switch,
} from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import PageHeader from "../../components/Common/PageHeader";
import PageMeta from "../../components/Common/PageMeta";
import UploadMedia from "../../components/shared/UploadMedia";
import { useGetAreasQuery } from "../../redux/features/area/areaApi";
import { useGetProjectsQuery } from "../../redux/features/project/projectApi";
import { useGetPropertyOptionsQuery } from "../../redux/features/property/propertyApi";
import {
  BADGES,
  FURNISHINGS,
  PROPERTY_TYPES,
  PURPOSES,
  STATUSES,
} from "./propertyMeta";

interface Props {
  /** Undefined when creating. */
  initial?: any;
  saving: boolean;
  onSubmit: (values: any) => Promise<void>;
  heading: string;
  submitLabel: string;
}

/**
 * One form for creating and editing a listing.
 *
 * Two forms would be two places to add a field, and the second one is always
 * the one that gets forgotten — so the create and edit pages differ only in
 * what they hand in and what they do with the result.
 *
 * Paragraph copy is entered as one textarea and split on blank lines. The API
 * stores an array because the site renders paragraphs, and asking a desk to
 * manage a repeating field for something they think of as "the description"
 * is how descriptions end up as one long unbroken block.
 */
const PropertyForm = ({
  initial,
  saving,
  onSubmit,
  heading,
  submitLabel,
}: Props) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { data: areaData } = useGetAreasQuery({ limit: 300, activeOnly: true });
  const { data: projectData } = useGetProjectsQuery({ limit: 300, activeOnly: true });
  const { data: amenities = [] } = useGetPropertyOptionsQuery({
    kind: "amenities",
    activeOnly: true,
  });

  useEffect(() => {
    if (!initial) return;
    form.setFieldsValue({
      ...initial,
      area: initial.area?._id ?? initial.area,
      project: initial.project?._id ?? initial.project,
      amenities: (initial.amenities || []).map((a: any) => a?._id ?? a),
      coverImage: initial.coverImage?._id ?? initial.coverImage,
      coverImageUrl: initial.coverImage?.key,
      images: (initial.images || []).map((i: any) => i?._id ?? i),
      imageUrls: (initial.images || []).map((i: any) => i?.key).filter(Boolean),
      expiresAt: initial.expiresAt ? dayjs(initial.expiresAt) : undefined,
      description: (initial.description || []).join("\n\n"),
      descriptionBn: (initial.descriptionBn || []).join("\n\n"),
    });
  }, [initial, form]);

  const paragraphs = (value?: string) =>
    (value || "")
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);

  const handleFinish = async (values: any) => {
    const { coverImageUrl, imageUrls, ...rest } = values;
    await onSubmit({
      ...rest,
      description: paragraphs(values.description),
      descriptionBn: paragraphs(values.descriptionBn),
      expiresAt: values.expiresAt ? values.expiresAt.toISOString() : null,
    });
  };

  return (
    <div>
      <PageMeta title={`${heading} · Zoom Property Admin`} noindex />
      <PageHeader
        title={heading}
        subtitle="Everything the website shows about this property"
        breadcrumbs={[
          { title: "Dashboard", path: "/" },
          { title: "Listings", path: "/properties" },
          { title: heading },
        ]}
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          purpose: "sale",
          type: "apartment",
          status: "draft",
          city: "Dhaka",
          furnishing: "Unfurnished",
          rajukApproved: false,
          hasVirtualTour: false,
          featured: false,
          beds: 0,
          baths: 0,
        }}
        className="space-y-4"
      >
        <Card title="The basics">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: "Give the listing a title" }]}
              >
                <Input placeholder="e.g. Harbour View Loft" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Title (Bangla)"
                name="titleBn"
                tooltip="Shown on the Bangla site. Falls back to the English title."
              >
                <Input placeholder="বাংলা শিরোনাম" />
              </Form.Item>
            </Col>

            <Col xs={12} md={6}>
              <Form.Item label="Purpose" name="purpose" rules={[{ required: true }]}>
                <Select options={PURPOSES} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item label="Type" name="type" rules={[{ required: true }]}>
                <Select options={PROPERTY_TYPES} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item
                label="Status"
                name="status"
                tooltip="A draft is not on the website. Nothing goes live by being saved."
              >
                <Select options={STATUSES} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item label="Badge" name="badge">
                <Select allowClear options={BADGES} placeholder="None" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Price (৳)"
                name="price"
                rules={[{ required: true, message: "Enter the asking price" }]}
                tooltip="Monthly rent when the purpose is To rent."
              >
                <InputNumber className="!w-full" min={0} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Service charge (৳ / month)" name="serviceCharge">
                <InputNumber className="!w-full" min={0} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Mandate ends"
                name="expiresAt"
                tooltip="Past this date the nightly sweep archives the listing."
              >
                <DatePicker className="w-full" format="DD-MM-YYYY" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Where it is">
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Area"
                name="area"
                rules={[{ required: true, message: "Pick the area" }]}
              >
                <Select
                  showSearch
                  optionFilterProp="label"
                  placeholder="Select an area"
                  options={(areaData?.result || []).map((a: any) => ({
                    value: a._id,
                    label: a.name,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="City" name="city">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Address"
                name="addressLine"
                tooltip="Only what the owner is happy to publish."
              >
                <Input placeholder="House 12, Road 7" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="The property">
          <Row gutter={16}>
            <Col xs={12} md={4}>
              <Form.Item label="Beds" name="beds">
                <InputNumber className="!w-full" min={0} />
              </Form.Item>
            </Col>
            <Col xs={12} md={4}>
              <Form.Item label="Baths" name="baths">
                <InputNumber className="!w-full" min={0} />
              </Form.Item>
            </Col>
            <Col xs={12} md={4}>
              <Form.Item
                label="Size (sq ft)"
                name="size"
                rules={[{ required: true, message: "Enter the covered area" }]}
              >
                <InputNumber className="!w-full" min={0} />
              </Form.Item>
            </Col>
            <Col xs={12} md={4}>
              <Form.Item label="Land (katha)" name="katha">
                <InputNumber className="!w-full" min={0} />
              </Form.Item>
            </Col>
            <Col xs={12} md={4}>
              <Form.Item label="Floor" name="floor">
                <Input placeholder="e.g. 7th" />
              </Form.Item>
            </Col>
            <Col xs={12} md={4}>
              <Form.Item label="Parking" name="parking">
                <InputNumber className="!w-full" min={0} />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label="Furnishing" name="furnishing">
                <Select options={FURNISHINGS} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Handover"
                name="handover"
                tooltip="Free text — most of them are a quarter, not a date."
              >
                <Input placeholder="Ready · Q4 2027" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Amenities" name="amenities">
                <Select
                  mode="multiple"
                  allowClear
                  optionFilterProp="label"
                  placeholder="Lift, generator, gym…"
                  options={(amenities || []).map((a: any) => ({
                    value: a._id,
                    label: a.name,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider className="!my-2" />

          <Row gutter={16}>
            <Col xs={12} md={6}>
              <Form.Item
                label="RAJUK approved"
                name="rajukApproved"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item
                label="Virtual tour"
                name="hasVirtualTour"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Virtual tour URL" name="virtualTourUrl">
                <Input placeholder="https://…" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Media">
          <Row gutter={16}>
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
              <Form.Item label="Gallery" name="imageUrls">
                <UploadMedia
                  form={form}
                  fieldPath="imageUrls"
                  idFieldPath="images"
                  mode="multiple"
                  type="image"
                />
              </Form.Item>
              <Form.Item name="images" hidden>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                label="Walkthrough video"
                name="videoUrl"
                tooltip="A YouTube or Vimeo link. The player only loads when somebody presses play."
              >
                <Input placeholder="https://youtube.com/watch?v=…" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Project Association">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Project"
                name="project"
                tooltip="Set when the unit belongs to a development on the books."
              >
                <Select
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  placeholder="Not part of a project"
                  options={(projectData?.result || []).map((p: any) => ({
                    value: p._id,
                    label: p.name,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Featured"
                name="featured"
                valuePropName="checked"
                tooltip="Carries the listing onto the home page."
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Description">
          <Form.Item
            label="English"
            name="description"
            tooltip="Leave a blank line between paragraphs."
          >
            <Input.TextArea rows={6} />
          </Form.Item>
          <Form.Item label="Bangla" name="descriptionBn">
            <Input.TextArea rows={6} />
          </Form.Item>
        </Card>

        <div className="flex justify-end gap-2 pb-6">
          <Button onClick={() => navigate("/properties")}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={saving}>
            {submitLabel}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PropertyForm;
