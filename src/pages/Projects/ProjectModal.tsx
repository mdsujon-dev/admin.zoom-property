import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Switch,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import { Languages, Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import LangInput, { translateToBanglaApi } from "../../components/Common/LangInput";
import RichTextEditor from "../../components/Common/RichEditor/RichTextEditor";
import UploadMedia from "../../components/shared/UploadMedia";
import { useGetAreasQuery } from "../../redux/features/area/areaApi";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from "../../redux/features/project/projectApi";

interface Props {
  open: boolean;
  onClose: () => void;
  project?: any;
}

export const STAGES = [
  { value: "Piling", label: "Piling" },
  { value: "Structure", label: "Structure" },
  { value: "Finishing", label: "Finishing" },
  { value: "Handover ready", label: "Handover ready" },
];

const normalizeDescriptionForEditor = (desc?: string[] | string) => {
  if (!desc) return "";
  if (typeof desc === "string") return desc;
  if (Array.isArray(desc)) {
    return desc
      .map((p) => (p.trim().startsWith("<") ? p : `<p>${p}</p>`))
      .join("");
  }
  return "";
};

const toDescriptionArray = (value?: string) => {
  if (!value || !value.trim()) return [];
  return [value.trim()];
};

const translateNodeText = async (node: Node) => {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent?.trim();
    if (text) {
      const translated = await translateToBanglaApi(text);
      node.textContent = translated;
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    for (const child of Array.from(node.childNodes)) {
      await translateNodeText(child);
    }
  }
};

const translateRichTextToBangla = async (html: string): Promise<string> => {
  if (!html || !html.trim()) return "";
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  await translateNodeText(tempDiv);
  return tempDiv.innerHTML || (await translateToBanglaApi(html));
};

/**
 * A development, and the programme behind it.
 *
 * There is no "progress" field. The percentage on the site is the sum of the
 * milestones ticked here, computed on the server — a page that lets somebody
 * type 85% beside a list adding to 40% is a page that has stopped meaning
 * anything.
 */
const ProjectModal = ({ open, onClose, project }: Props) => {
  const [form] = Form.useForm();
  const [translatingDescBn, setTranslatingDescBn] = useState(false);
  const [createProject, { isLoading: creating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: updating }] = useUpdateProjectMutation();
  const { data: areaData } = useGetAreasQuery({ limit: 300, activeOnly: true });

  const handleTranslateDescription = async () => {
    const enText = form.getFieldValue("description");
    if (!enText || !enText.trim() || enText === "<p><br></p>" || enText === "<p></p>") {
      toast.info("অনুবাদের জন্য আগে ইংরেজিতে বিবরণ (English description) লিখুন");
      return;
    }
    setTranslatingDescBn(true);
    try {
      const bnText = await translateRichTextToBangla(enText);
      form.setFieldsValue({ descriptionBn: bnText });
      toast.success("বিবরণ বাংলায় রূপান্তর করা হয়েছে!");
    } catch {
      toast.error("অনুবাদ করতে সমস্যা হয়েছে");
    } finally {
      setTranslatingDescBn(false);
    }
  };

  useEffect(() => {
    if (!open) return form.resetFields();
    if (project) {
      form.setFieldsValue({
        ...project,
        area: project.area?._id ?? project.area,
        coverImage: project.coverImage?._id ?? project.coverImage,
        coverImageUrl: project.coverImage?.key,
        images: (project.images || []).map((i: any) => i?._id ?? i),
        imageUrls: (project.images || []).map((i: any) => i?.key).filter(Boolean),
        lastInspected: project.lastInspected
          ? dayjs(project.lastInspected)
          : undefined,
        description: normalizeDescriptionForEditor(project.description),
        descriptionBn: normalizeDescriptionForEditor(project.descriptionBn),
      });
    }
  }, [open, project, form]);

  const onFinish = async (values: any) => {
    const { coverImageUrl, imageUrls, ...rest } = values;
    void coverImageUrl;
    void imageUrls;
    const body = {
      ...rest,
      description: toDescriptionArray(values.description),
      descriptionBn: toDescriptionArray(values.descriptionBn),
      lastInspected: values.lastInspected
        ? values.lastInspected.toISOString()
        : null,
    };
    try {
      const res: any = project
        ? await updateProject({ id: project._id, data: body }).unwrap()
        : await createProject(body).unwrap();
      toast.success(res?.message || "Saved");
      onClose();
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not save the project");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={project ? "Edit project" : "Add a project"}
      footer={null}
      width={820}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          city: "Dhaka",
          stage: "Piling",
          isActive: true,
          featured: false,
          cctvStreamActive: false,
          units: 0,
          unitsLeft: 0,
        }}
      >
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
            <Form.Item label="Featured" name="featured" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item label="Active" name="isActive" valuePropName="checked">
              <Switch />
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

        {/* The build programme. Each line carries its share of the whole, and
            the ticked ones add up to what the site reports. */}
        <Form.List name="milestones">
          {(fields, { add, remove }) => (
            <div className="mb-4 rounded-lg border border-secondary-100 p-3">
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
                <Row key={field.key} gutter={8} align="middle" className="mb-1">
                  <Col xs={24} md={11}>
                    <Form.Item
                      {...field}
                      key={`${field.key}-label`}
                      name={[field.name, "label"]}
                      rules={[{ required: true, message: "Name it" }]}
                      className="!mb-1"
                    >
                      <Input placeholder="Piling complete" />
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
                      <InputNumber className="!w-full" min={0} max={100} addonAfter="%" />
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

        <Form.Item
          label="Description (English)"
          name="description"
          tooltip="Detailed project description with rich formatting."
        >
          <RichTextEditor placeholder="Enter description in English..." height={420} />
        </Form.Item>
        <Form.Item
          label={
            <div className="flex items-center justify-between w-full gap-2">
              <span>Description (Bangla)</span>
              <Tooltip title="ইংরেজিতে লেখা বিবরণ থেকে বাংলায় রূপান্তর করুন">
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

        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={creating || updating}>
            {project ? "Save changes" : "Add project"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ProjectModal;
