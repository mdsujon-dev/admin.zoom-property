import { Button, Col, Form, Input, InputNumber, Modal, Row, Switch, Tooltip } from "antd";
import { Languages, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import LangInput from "../../components/Common/LangInput";
import RichTextEditor from "../../components/Common/RichEditor/RichTextEditor";
import UploadMedia from "../../components/shared/UploadMedia";
import {
  useCreateLandownerProjectMutation,
  useUpdateLandownerProjectMutation,
} from "../../redux/features/landowner/landownerApi";
import {
  isEmptyRichText,
  translateRichTextToBangla,
} from "../../utils/richText";

interface Props {
  open: boolean;
  onClose: () => void;
  project?: any;
}

/**
 * One block on the landowners page: a photograph, a heading, and a passage.
 *
 * Three fields and no more. The description is the panel's rich-text editor
 * rather than a plain box because the desk writes lists and bold terms in
 * here - the owner share, the escrow, the handover date - and a textarea would
 * flatten all of that on save.
 */
const LandownerProjectModal = ({ open, onClose, project }: Props) => {
  const [form] = Form.useForm();
  const [translating, setTranslating] = useState(false);
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

  const handleTranslate = async () => {
    const enText = form.getFieldValue("description");
    if (isEmptyRichText(enText)) {
      toast.info("অনুবাদের জন্য আগে ইংরেজিতে বিবরণ (English description) লিখুন");
      return;
    }
    setTranslating(true);
    try {
      form.setFieldsValue({
        descriptionBn: await translateRichTextToBangla(enText),
      });
      toast.success("বিবরণ বাংলায় রূপান্তর করা হয়েছে!");
    } catch {
      toast.error("অনুবাদ করতে সমস্যা হয়েছে");
    } finally {
      setTranslating(false);
    }
  };

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
      toast.error(e?.data?.message || "Could not save the block");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={project ? "Edit block" : "Add a block"}
      footer={null}
      width={880}
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
              label="Title"
              name="title"
              lang="en"
              required
              placeholder="Why choose us as a partner for your land?"
            />
          </Col>
          <Col xs={24} md={12}>
            <LangInput
              label="Title (Bangla)"
              name="titleBn"
              lang="bn"
              sourceFieldName="title"
              form={form}
              placeholder="বাংলা শিরোনাম"
            />
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Image"
              name="imageUrl"
              tooltip="Sits beside the text. Landscape reads best — roughly 4:3."
            >
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
            <Form.Item
              label="Order"
              name="order"
              tooltip="Lowest first. Blocks alternate side automatically."
            >
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

          <Col xs={24}>
            <Form.Item label="Description" name="description">
              <RichTextEditor
                placeholder="Write the passage in English..."
                height={500}
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label={
                <div className="flex w-full items-center justify-between gap-2">
                  <span>Description (Bangla)</span>
                  <Tooltip title="ইংরেজিতে লেখা বিবরণ থেকে বাংলায় রূপান্তর করুন">
                    <Button
                      type="link"
                      size="small"
                      className="!h-auto !px-1 !text-xs flex shrink-0 items-center gap-1 whitespace-nowrap"
                      onClick={handleTranslate}
                      loading={translating}
                      icon={
                        translating ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Languages className="h-3.5 w-3.5" />
                        )
                      }
                    >
                      {translating ? "রূপান্তর হচ্ছে..." : "বাংলা করুন"}
                    </Button>
                  </Tooltip>
                </div>
              }
              name="descriptionBn"
            >
              <RichTextEditor placeholder="বাংলায় বিবরণ লিখুন..." height={500} />
            </Form.Item>
          </Col>
        </Row>

        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={creating || updating}>
            {project ? "Save changes" : "Add block"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default LandownerProjectModal;
