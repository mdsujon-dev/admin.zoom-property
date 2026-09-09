import { Button, Form, Input } from "antd";
import {
  Building2,
  Image as ImageIcon,
  Receipt,
  ScrollText,
} from "lucide-react";
import { useEffect } from "react";
import { toast } from "react-toastify";

import PageHeader from "../../../components/Common/PageHeader";
import PageMeta from "../../../components/Common/PageMeta";
import PermissionGate from "../../../components/Common/PermissionGate";
import { Panel } from "../../../components/Details/DetailKit";
import {
  useGetCompanySettingsQuery,
  useUpdateCompanySettingsMutation,
} from "../../../redux/features/company/companyApi";

/**
 * The company's own details, in one place.
 *
 * Everything here is written once and read everywhere: the ID card, the money
 * receipt, the ID card and the reports all take the company's
 * name, logo and session from this document rather than each holding their own
 * copy — which is how three screens end up disagreeing about the phone number.
 */
const CompanySettings = () => {
  const [form] = Form.useForm();
  const { data, isFetching } = useGetCompanySettingsQuery();
  const [save, { isLoading }] = useUpdateCompanySettingsMutation();

  useEffect(() => {
    if (data) form.setFieldsValue(data);
  }, [data, form]);

  const onFinish = async (values: any) => {
    try {
      await save(values).unwrap();
      toast.success("Settings saved");
    } catch (err: any) {
      toast.error(err?.data?.message || "Could not save the settings");
    }
  };

  const logo = Form.useWatch("logo", form);

  return (
    <div>
      <PageMeta
        title="Company Settings - Zoom Property Admin"
        description="The company's name, logo and contact details."
        canonicalUrl={`${window.location.origin}/settings/company`}
        noindex
      />

      <PageHeader
        title="Company Settings"
        subtitle="Name, logo, contact and the lines that go on printed documents"
        breadcrumbs={[
          { title: "Dashboard", path: "/" },
          { title: "Settings" },
          { title: "Company" },
        ]}
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        disabled={isFetching}
        className="space-y-4"
      >
        <Panel title="Identity" icon={Building2}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Form.Item
              label="Company name"
              name="name"
              rules={[{ required: true, message: "The company needs a name" }]}
            >
              <Input placeholder="Ayat Zoom Property" />
            </Form.Item>
            <Form.Item
              label="Short name"
              name="shortName"
              tooltip="Used where space is tight — the ID card, for one"
            >
              <Input placeholder="ATI" />
            </Form.Item>
            <Form.Item label="Tagline" name="tagline" className="sm:col-span-2">
              <Input placeholder="Skills that get people hired" />
            </Form.Item>
          </div>
        </Panel>

        <Panel title="Logo" icon={ImageIcon}>
          <div className="flex flex-wrap items-start gap-4">
            <Form.Item
              label="Logo URL"
              name="logo"
              className="min-w-0 flex-1"
              tooltip="Paste the address of an image already in the media library"
            >
              <Input placeholder="https://…/logo.png" />
            </Form.Item>
            {/* A preview rather than a promise: a wrong URL is obvious here and
                invisible on a printed ID card. */}
            <div className="grid h-[76px] w-[76px] shrink-0 place-items-center overflow-hidden rounded-xl border border-secondary-100 bg-secondary-50">
              {logo ? (
                <img
                  src={logo}
                  alt="Company logo"
                  className="h-full w-full object-contain"
                />
              ) : (
                <ImageIcon className="h-5 w-5 text-secondary-300" />
              )}
            </div>
          </div>
        </Panel>

        <Panel title="Contact" icon={Receipt}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Form.Item label="Email" name="email">
              <Input placeholder="office@example.com" />
            </Form.Item>
            <Form.Item label="Phone" name="phone">
              <Input placeholder="+8801700000000" />
            </Form.Item>
            <Form.Item label="Website" name="website">
              <Input placeholder="https://example.com" />
            </Form.Item>
            <Form.Item label="Trading licence / BIN" name="licenceNo">
              <Input placeholder="TRAD/DNCC/000000/2026" />
            </Form.Item>
            <Form.Item label="Address" name="address" className="sm:col-span-2">
              <Input.TextArea rows={2} placeholder="House, road, city" />
            </Form.Item>
          </div>
        </Panel>

        <Panel title="Printed documents" icon={ScrollText}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Form.Item
              label="Receipt number prefix"
              name="invoicePrefix"
              tooltip="Money receipts are numbered PREFIX-0001"
            >
              <Input placeholder="INV" />
            </Form.Item>
            <Form.Item label="ID card note" name="idCardNote">
              <Input placeholder="If found, please return to the address above" />
            </Form.Item>
            <Form.Item label="Receipt footer" name="invoiceFooter">
              <Input.TextArea rows={2} placeholder="Fees once paid are not refundable" />
            </Form.Item>
            <Form.Item label="Report footer" name="reportFooter">
              <Input.TextArea rows={2} placeholder="Printed from the Zoom Property panel" />
            </Form.Item>
          </div>
        </Panel>

        <PermissionGate module="Company Settings" action="Update">
          <div className="flex justify-end">
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Save settings
            </Button>
          </div>
        </PermissionGate>
      </Form>

    </div>
  );
};

export default CompanySettings;
