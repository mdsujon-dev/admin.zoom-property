import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Switch,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import { Languages, Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import LangInput from "../../components/Common/LangInput";
import PageHeader from "../../components/Common/PageHeader";
import PageMeta from "../../components/Common/PageMeta";
import RichTextEditor from "../../components/Common/RichEditor/RichTextEditor";
import UploadMedia from "../../components/shared/UploadMedia";
import { useGetAreasQuery } from "../../redux/features/area/areaApi";
import { normalizeUrl } from "../../utils/normalizeUrl";
import {
  isEmptyRichText,
  normalizeDescriptionForEditor,
  toDescriptionArray,
  translateRichTextToBangla,
} from "../../utils/richText";
import { STAGES } from "./projectMeta";

interface Props {
  /** Undefined when creating. */
  initial?: any;
  saving: boolean;
  onSubmit: (values: any) => Promise<void>;
  heading: string;
  submitLabel: string;
}

/**
 * A development, and the programme behind it.
 *
 * There is no "progress" field. The percentage on the site is the sum of the
 * milestones ticked here, computed on the server — a page that lets somebody
 * type 85% beside a list adding to 40% is a page that has stopped meaning
 * anything.
 *
 * One form for creating and editing, for the same reason the listing form is
 * one: two would be two places to add a field, and the second one is always
 * the one that gets forgotten.
 */
const ProjectForm = ({
  initial,
  saving,
  onSubmit,
  heading,
  submitLabel,
}: Props) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [translatingDescBn, setTranslatingDescBn] = useState(false);

  const { data: areaData } = useGetAreasQuery({ limit: 300, activeOnly: true });

  const handleTranslateDescription = async () => {
    const enText = form.getFieldValue("description");
    if (isEmptyRichText(enText)) {
      toast.info("অনুবাদের জন্য আগে ইংরেজিতে বিবরণ (English description) লিখুন");
      return;
    }
    setTranslatingDescBn(true);
    try {
      const bnText = await translateRichTextToBangla(enText);
      form.setFieldsValue({ descriptionBn: bnText });
      toast.success("বিবরণ বাংলায় রূপান্তর করা হয়েছে!");
    } catch {
      toast.error("অনুবাদ করতে সমস্যা হয়েছে");
    } finally {
      setTranslatingDescBn(false);
    }
  };

  useEffect(() => {
    if (!initial) return;
    form.setFieldsValue({
      ...initial,
      area: initial.area?._id ?? initial.area,
      coverImage: initial.coverImage?._id ?? initial.coverImage,
      coverImageUrl: initial.coverImage?.key,
      images: (initial.images || []).map((i: any) => i?._id ?? i),
      imageUrls: (initial.images || []).map((i: any) => i?.key).filter(Boolean),
      lastInspected: initial.lastInspected
        ? dayjs(initial.lastInspected)
        : undefined,
      description: normalizeDescriptionForEditor(initial.description),
      descriptionBn: normalizeDescriptionForEditor(initial.descriptionBn),
    });
  }, [initial, form]);

  const handleFinish = async (values: any) => {
    const { coverImageUrl, imageUrls, ...rest } = values;
    void coverImageUrl;
    void imageUrls;
    await onSubmit({
      ...rest,
      video: rest.video
        ? { ...rest.video, youtubeUrl: normalizeUrl(rest.video.youtubeUrl) }
        : undefined,
      description: toDescriptionArray(values.description),
      descriptionBn: toDescriptionArray(values.descriptionBn),
      lastInspected: values.lastInspected
        ? values.lastInspected.toISOString()
        : null,
    });
  };

  return (
    <div>
      <PageMeta title={`${heading} · Zoom Property Admin`} noindex />
      <PageHeader
        title={heading}
        subtitle="Everything the website shows about this development"
        breadcrumbs={[
          { title: "Dashboard", path: "/" },
          { title: "Projects", path: "/projects" },
          { title: heading },
        ]}
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          city: "Dhaka",
          stage: "Planning",
          isActive: true,
          featured: false,
          cctvStreamActive: false,
          units: 0,
          unitsLeft: 0,
        }}
        className="space-y-4"
      >
        <Card title="The basics">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <LangInput
                label="Name"
                name="name"
                lang="en"
                required
                placeholder="e.g. Navana Platinum"
              />
            </Col>
            <Col xs={24} md={12}>
              <LangInput
                label="Name (Bangla)"
                name="nameBn"
                lang="bn"
                sourceFieldName="name"
                form={form}
                placeholder="প্রজেক্টের নাম"
              />
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label="Developer" name="developer">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Area"
                name="area"
                rules={[{ required: true, message: "Pick the area" }]}
              >
                <Select
                  showSearch
                  optionFilterProp="label"
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
          </Row>
        </Card>

        <Card title="The build">
          <Row gutter={16}>
            <Col xs={12} md={6}>
              <Form.Item label="Stage" name="stage">
                <Select options={STAGES} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item label="Handover" name="handover">
                <Input placeholder="Q4 2027" />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item label="Units" name="units">
                <InputNumber className="!w-full" min={0} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item label="Units left" name="unitsLeft">
                <InputNumber className="!w-full" min={0} />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label="Size range" name="sizeRange">
                <Input placeholder="1,450 – 2,300 sq ft" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Starting price (৳)" name="startingPrice">
                <InputNumber className="!w-full" min={0} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="RAJUK permit no." name="rajukPermitNo">
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Last inspected"
                name="lastInspected"
                tooltip="The day somebody from the agency last walked the site."
              >
                <DatePicker className="w-full" format="DD-MM-YYYY" />
              </Form.Item>
            </Col>
            <Col xs={12} md={5}>
              <Form.Item
                label="CCTV live"
                name="cctvStreamActive"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={12} md={5}>
              <Form.Item
                label="Featured"
                name="featured"
                valuePropName="checked"
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

          {/* The build programme. Each line carries its share of the whole, and
              the ticked ones add up to what the site reports. */}
          <Form.List name="milestones">
            {(fields, { add, remove }) => (
              <div className="rounded-lg border border-secondary-100 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-medium text-secondary-700">
                    Build programme
                  </p>
                  <Button
                    size="small"
                    icon={<Plus className="h-3.5 w-3.5" />}
                    onClick={() => add({ percent: 10, completed: false })}
                  >
                    Add milestone
                  </Button>
                </div>

                {fields.length === 0 && (
                  <p className="py-2 text-xs text-secondary-400">
                    No milestones yet — progress stays at 0%.
                  </p>
                )}

                {fields.map((field) => (
                  <Row
                    key={field.key}
                    gutter={8}
                    align="middle"
                    className="mb-1"
                  >
                    <Col xs={24} md={11}>
                      <Form.Item
                        {...field}
                        key={`${field.key}-label`}
                        name={[field.name, "label"]}
                        rules={[{ required: true, message: "Name it" }]}
                        className="!mb-1"
                      >
                        <Input placeholder="Foundation complete" />
                      </Form.Item>
                    </Col>
                    <Col xs={12} md={7}>
                      <Form.Item
                        key={`${field.key}-labelBn`}
                        name={[field.name, "labelBn"]}
                        className="!mb-1"
                      >
                        <Input placeholder="বাংলা" />
                      </Form.Item>
                    </Col>
                    <Col xs={6} md={3}>
                      <Form.Item
                        key={`${field.key}-percent`}
                        name={[field.name, "percent"]}
                        className="!mb-1"
                      >
                        <InputNumber
                          className="!w-full"
                          min={0}
                          max={100}
                          addonAfter="%"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={4} md={2}>
                      <Form.Item
                        key={`${field.key}-completed`}
                        name={[field.name, "completed"]}
                        valuePropName="checked"
                        className="!mb-1"
                      >
                        <Switch size="small" />
                      </Form.Item>
                    </Col>
                    <Col xs={2} md={1}>
                      <Button
                        type="text"
                        danger
                        icon={<Trash2 className="h-4 w-4" />}
                        onClick={() => remove(field.name)}
                      />
                    </Col>
                  </Row>
                ))}
              </div>
            )}
          </Form.List>
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
          </Row>
        </Card>

        <Card title="The description">
          <Form.Item
            label="Description (English)"
            name="description"
            tooltip="Detailed project description with rich formatting."
          >
            <RichTextEditor
              placeholder="Enter description in English..."
              height={420}
            />
          </Form.Item>
          <Form.Item
            label={
              <div className="flex items-center justify-between w-full gap-2">
                <span>Description (Bangla)</span>
                <Tooltip title="ইংরেজিতে লেখা বিবরণ থেকে বাংলায় রূপান্তর করুন">
                  <Button
                    type="link"
                    size="small"
                    className="!px-1 !h-auto !text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 shrink-0 whitespace-nowrap"
                    onClick={handleTranslateDescription}
                    loading={translatingDescBn}
                    icon={
                      translatingDescBn ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Languages className="w-3.5 h-3.5" />
                      )
                    }
                  >
                    {translatingDescBn ? "রূপান্তর হচ্ছে..." : "বাংলা করুন"}
                  </Button>
                </Tooltip>
              </div>
            }
            name="descriptionBn"
            tooltip="বাংলায় বিস্তারিত বিবরণ"
          >
            <RichTextEditor placeholder="বাংলায় বিবরণ লিখুন..." height={420} />
          </Form.Item>
        </Card>

        <div className="flex justify-end gap-2 pb-6">
          <Button onClick={() => navigate("/projects")}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={saving}>
            {submitLabel}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ProjectForm;
