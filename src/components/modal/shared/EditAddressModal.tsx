import { AutoComplete, Button, Checkbox, Form, Input, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useUpdateUserMutation } from "../../../redux/features/user/userApi";
import { postCodeOf } from "../../../data/bdPostOffices";
import { useAddressData } from "../../../hooks/useAddressData";

/**
 * An address, for anybody the agency keeps one for.
 *
 * A division narrows a district, a district narrows a thana, and "same as
 * present" copies one to the other. Written out once, in one place, so those
 * rules cannot drift apart.
 */
interface Props {
  /** The person whose address this is. */
  record: any;
  open: boolean;
  onClose: () => void;
}

const EditAddressModal = ({ record, open, onClose }: Props) => {
  const [form] = Form.useForm();
  const [save, { isLoading }] = useUpdateUserMutation();
  const [sameAsPresent, setSameAsPresent] = useState(false);

  const presentDivision = Form.useWatch("presentDivision", form);
  const {
    divisions: presentDivs,
    upazilas: presentThanas,
    postOffices: presentOffices,
    districts: presentDists,
    divLoading: pDivLoading,
    distLoading: pDistLoading,
  } = useAddressData(presentDivision, Form.useWatch("presentDistrict", form));

  const permanentDivision = Form.useWatch("permanentDivision", form);
  const {
    divisions: permanentDivs,
    upazilas: permanentThanas,
    postOffices: permanentOffices,
    districts: permanentDists,
    divLoading: perDivLoading,
    distLoading: perDistLoading,
  } = useAddressData(
    permanentDivision,
    Form.useWatch("permanentDistrict", form)
  );

  /* Matches anywhere in the name, so "dakshin" finds "Cumilla Sadar Dakshin",
     and the post office list — labelled with its code — is searchable by
     number as well. */
  const contains = (input: string, option?: { value: string; label?: string }) =>
    `${option?.label || option?.value || ""}`
      .toLowerCase()
      .includes(input.toLowerCase());

  /** Fills the code for a listed office, and never overwrites a typed one. */
  const fillCode = (which: "present" | "permanent") => (office: string) => {
    const code = postCodeOf(form.getFieldValue(`${which}District`), office);
    if (code) form.setFieldsValue({ [`${which}PostalCode`]: code });
  };

  useEffect(() => {
    if (open && record) {
      form.setFieldsValue({
        presentDivision: record.presentDivision,
        presentDistrict: record.presentDistrict,
        presentCity: record.presentCity,
        presentPoliceStation: record.presentPoliceStation,
        presentPostOffice: record.presentPostOffice,
        presentPostalCode: record.presentPostalCode,
        presentDetailedAddress: record.presentDetailedAddress,
        presentAddress: record.presentAddress, // legacy

        permanentDivision: record.permanentDivision,
        permanentDistrict: record.permanentDistrict,
        permanentCity: record.permanentCity,
        permanentPoliceStation: record.permanentPoliceStation,
        permanentPostOffice: record.permanentPostOffice,
        permanentPostalCode: record.permanentPostalCode,
        permanentDetailedAddress: record.permanentDetailedAddress,
        permanentAddress: record.permanentAddress, // legacy
      });
      setSameAsPresent(false);
    } else {
      form.resetFields();
    }
  }, [open, record, form]);

  const handleSameAsPresentChange = (e: any) => {
    const checked = e.target.checked;
    setSameAsPresent(checked);
    if (checked) {
      const currentValues = form.getFieldsValue();
      form.setFieldsValue({
        permanentDivision: currentValues.presentDivision,
        permanentDistrict: currentValues.presentDistrict,
        permanentCity: currentValues.presentCity,
        permanentPoliceStation: currentValues.presentPoliceStation,
        permanentPostOffice: currentValues.presentPostOffice,
        permanentPostalCode: currentValues.presentPostalCode,
        permanentDetailedAddress: currentValues.presentDetailedAddress,
        permanentAddress: currentValues.presentAddress,
      });
    }
  };

  const onFinish = async (values: any) => {
    try {
      await save({ id: record._id, data: values }).unwrap();
      toast.success("Address information updated");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update");
    }
  };

  return (
    <Modal
      title="Edit Address Information"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={700}
    >
      <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
        <div className="mb-4">
          <h3 className="mb-2 font-medium">Present Address</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Form.Item label="Division" name="presentDivision">
              <Select allowClear showSearch optionFilterProp="label" loading={pDivLoading} options={presentDivs} placeholder="Select Division" onChange={() => { form.setFieldsValue({ presentDistrict: undefined, presentPoliceStation: undefined }); }} />
            </Form.Item>
            <Form.Item label="District" name="presentDistrict">
              <Select allowClear showSearch optionFilterProp="label" loading={pDistLoading} options={presentDists} placeholder="Select District" disabled={!presentDivision} onChange={() => form.setFieldsValue({ presentPoliceStation: undefined })} />
            </Form.Item>
            <Form.Item label="City / Village" name="presentCity">
              <Input placeholder="City or village" />
            </Form.Item>
            {/* Suggests the district's thanas but takes anything typed — the
                list is close, not official. Same control as the forms. */}
            <Form.Item label="Police Station (Thana)" name="presentPoliceStation">
              <AutoComplete
                options={presentThanas}
                filterOption={contains}
                placeholder="Type or pick a thana"
              />
            </Form.Item>
            <Form.Item label="Post Office" name="presentPostOffice">
              <AutoComplete
                options={presentOffices}
                filterOption={contains}
                onSelect={fillCode("present")}
                placeholder="Type or pick a post office"
              />
            </Form.Item>
            <Form.Item label="Postal Code" name="presentPostalCode">
              <Input placeholder="e.g. 1209" />
            </Form.Item>
            <Form.Item label="Detailed Address" name="presentDetailedAddress" className="md:col-span-2">
              <Input.TextArea rows={2} placeholder="House no., Road no., Village etc." />
            </Form.Item>
          </div>
        </div>

        <div className="mb-4 border-t pt-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-medium">Permanent Address</h3>
            <Checkbox checked={sameAsPresent} onChange={handleSameAsPresentChange}>
              Same as Present Address
            </Checkbox>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Form.Item label="Division" name="permanentDivision">
              <Select allowClear showSearch optionFilterProp="label" loading={perDivLoading} options={permanentDivs} placeholder="Select Division" disabled={sameAsPresent} onChange={() => { form.setFieldsValue({ permanentDistrict: undefined, permanentPoliceStation: undefined }); }} />
            </Form.Item>
            <Form.Item label="District" name="permanentDistrict">
              <Select allowClear showSearch optionFilterProp="label" loading={perDistLoading} options={permanentDists} placeholder="Select District" disabled={sameAsPresent || !permanentDivision} onChange={() => form.setFieldsValue({ permanentPoliceStation: undefined })} />
            </Form.Item>
            <Form.Item label="City / Village" name="permanentCity">
              <Input placeholder="City or village" disabled={sameAsPresent} />
            </Form.Item>
            <Form.Item label="Police Station (Thana)" name="permanentPoliceStation">
              <AutoComplete
                options={permanentThanas}
                filterOption={contains}
                disabled={sameAsPresent}
                placeholder="Type or pick a thana"
              />
            </Form.Item>
            <Form.Item label="Post Office" name="permanentPostOffice">
              <AutoComplete
                options={permanentOffices}
                filterOption={contains}
                onSelect={fillCode("permanent")}
                disabled={sameAsPresent}
                placeholder="Type or pick a post office"
              />
            </Form.Item>
            <Form.Item label="Postal Code" name="permanentPostalCode">
              <Input disabled={sameAsPresent} placeholder="e.g. 1209" />
            </Form.Item>
            <Form.Item label="Detailed Address" name="permanentDetailedAddress" className="md:col-span-2">
              <Input.TextArea rows={2} disabled={sameAsPresent} placeholder="House no., Road no., Village etc." />
            </Form.Item>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Save Changes
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditAddressModal;
