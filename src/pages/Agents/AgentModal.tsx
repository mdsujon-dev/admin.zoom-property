import { Form, Input, InputNumber, Modal, Select } from "antd";
import { useEffect } from "react";
import { toast } from "react-toastify";
import UploadMedia from "../../components/shared/UploadMedia";
import {
  useCreateAgentMutation,
  useUpdateAgentMutation,
} from "../../redux/features/agent/agentApi";

const translateText = async (text: string) => {
  if (!text) return "";
  try {
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=bn&dt=t&q=${encodeURIComponent(text)}`);
    const data = await res.json();
    return data[0][0][0];
  } catch (err) {
    console.error("Translation error:", err);
    return "";
  }
};

const AgentModal = ({ open, setOpen, editing, setEditing }: any) => {
  const [form] = Form.useForm();
  const [createAgent, { isLoading: isCreating }] = useCreateAgentMutation();
  const [updateAgent, { isLoading: isUpdating }] = useUpdateAgentMutation();

  useEffect(() => {
    if (editing) {
      form.setFieldsValue({
        ...editing,
        imageUrl: editing.image?.url || editing.image?.key,
        image: editing.image?._id,
      });
    } else {
      form.resetFields();
    }
  }, [editing, form]);

  const onFinish = async (values: any) => {
    // Strip the UI preview URL so only the ObjectId goes to the server
    delete values.imageUrl;

    try {
      if (editing) {
        await updateAgent({ id: editing._id, data: values }).unwrap();
        toast.success("Agent updated");
      } else {
        await createAgent(values).unwrap();
        toast.success("Agent created");
      }
      setOpen(false);
      setEditing(null);
      form.resetFields();
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not save agent");
    }
  };

  return (
    <Modal
      open={open}
      title={editing ? "Edit Agent" : "New Agent"}
      onCancel={() => {
        setOpen(false);
        setEditing(null);
        form.resetFields();
      }}
      onOk={() => form.submit()}
      confirmLoading={isCreating || isUpdating}
      width={700}
      okText="Save Agent"
    >
      <Form form={form} onFinish={onFinish} layout="vertical" className="mt-4">
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="name"
            label="Name (English)"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input
              placeholder="John Doe"
              onBlur={async (e) => {
                const text = e.target.value;
                if (text && !form.getFieldValue("nameBn")) {
                  const translated = await translateText(text);
                  if (translated) form.setFieldsValue({ nameBn: translated });
                }
              }}
            />
          </Form.Item>
          <Form.Item name="nameBn" label="Name (Bengali) - Auto translated">
            <Input placeholder="জন ডো" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role (English)"
            rules={[{ required: true, message: "Role is required" }]}
          >
            <Input
              placeholder="Senior Advisor"
              onBlur={async (e) => {
                const text = e.target.value;
                if (text && !form.getFieldValue("roleBn")) {
                  const translated = await translateText(text);
                  if (translated) form.setFieldsValue({ roleBn: translated });
                }
              }}
            />
          </Form.Item>
          <Form.Item name="roleBn" label="Role (Bengali) - Auto translated">
            <Input placeholder="সিনিয়র পরামর্শদাতা" />
          </Form.Item>

          <Form.Item name="patch" label="Patch (Areas covered)">
            <Select mode="tags" placeholder="Gulshan, Banani..." />
          </Form.Item>
          <Form.Item name="languages" label="Languages">
            <Select mode="tags" placeholder="English, Bengali..." />
          </Form.Item>

          <Form.Item name="deals" label="Deals Closed">
            <InputNumber className="w-full" min={0} placeholder="e.g. 50" />
          </Form.Item>
          <Form.Item name="rating" label="Rating (Out of 5)">
            <InputNumber className="w-full" min={0} max={5} step={0.1} placeholder="e.g. 4.9" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: "Phone number is required" }]}
          >
            <Input placeholder="+8801XXXXXXXXX" />
          </Form.Item>
          <Form.Item name="respondsIn" label="Reply Time (Minutes)">
            <InputNumber className="w-full" min={0} placeholder="e.g. 15" />
          </Form.Item>
          <div className="col-span-2">
            <UploadMedia
              form={form}
              fieldPath="imageUrl"
              idFieldPath="image"
              type="image"
            />
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default AgentModal;
