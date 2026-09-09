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
} from "antd";
import dayjs from "dayjs";
import { Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "react-toastify";

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
  const [createProject, { isLoading: creating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: updating }] = useUpdateProjectMutation();
  const { data: areaData } = useGetAreasQuery({ limit: 300, activeOnly: true });

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
        description: (project.description || []).join("\n\n"),
        descriptionBn: (project.descriptionBn || []).join("\n\n"),
      });
    }
  }, [open, project, form]);

  const paragraphs = (value?: string) =>
    (value || "")
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);

  const onFinish = async (values: any) => {
    const { coverImageUrl, imageUrls, ...rest } = values;
    const body = {
      ...rest,
      description: paragraphs(values.description),
      descriptionBn: paragraphs(values.descriptionBn),
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
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Name the project" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Name (Bangla)" name="nameBn">
              <Input />
            </Form.Item>
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
          label="Description"
          name="description"
          tooltip="Leave a blank line between paragraphs."
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item label="Description (Bangla)" name="descriptionBn">
          <Input.TextArea rows={3} />
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
