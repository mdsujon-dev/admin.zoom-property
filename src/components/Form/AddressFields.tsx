import { AutoComplete, Checkbox, Divider, Form, Input, Select } from "antd";
import type { FormInstance } from "antd";
import { useState } from "react";

import { postCodeOf } from "../../data/bdPostOffices";
import { useAddressData } from "../../hooks/useAddressData";

interface Props {
  form: FormInstance;
  /**
   * Whether the present address is compulsory.
   *
   * A client's is — the company files forms that ask for it. An agent's and
   * an employee's are not, because a staff record is useful the moment the name
   * and the phone number are in it, and refusing to save one for want of a post
   * office is how half the office ends up unrecorded.
   */
  required?: boolean;
}

/**
 * The present and permanent address, the same way on every form.
 *
 * Written once because there are three of them — client, agent, employee —
 * and all three store the identical fourteen fields. Kept as three copies they
 * had already begun to differ: only the client's form offered them at all, and
 * the other two showed a single free-text line while their records carried the
 * structured columns unused.
 *
 * The division/district pair cascades: choosing a division narrows the
 * districts, and changing it clears what was chosen underneath, because a
 * district left over from the previous division is a wrong answer that looks
 * like a filled-in one.
 */
const AddressFields = ({ form, required }: Props) => {
  const [sameAsPresent, setSameAsPresent] = useState(false);

  const presentDivision = Form.useWatch("presentDivision", form);
  const presentDistrict = Form.useWatch("presentDistrict", form);
  const permanentDivision = Form.useWatch("permanentDivision", form);
  const permanentDistrict = Form.useWatch("permanentDistrict", form);

  const {
    divisions: presentDivs,
    districts: presentDists,
    upazilas: presentThanas,
    postOffices: presentOffices,
    divLoading: pDivLoading,
    distLoading: pDistLoading,
  } = useAddressData(presentDivision, presentDistrict);

  const {
    divisions: permanentDivs,
    districts: permanentDists,
    upazilas: permanentThanas,
    postOffices: permanentOffices,
    divLoading: perDivLoading,
    distLoading: perDistLoading,
  } = useAddressData(permanentDivision, permanentDistrict);

  /* Matches on any part of the name, not just the start: somebody looking for
     "Cumilla Sadar Dakshin" types "dakshin". The post office list is labelled
     with its code, so searching by the number works too. */
  const contains = (input: string, option?: { value: string; label?: string }) =>
    `${option?.label || option?.value || ""}`
      .toLowerCase()
      .includes(input.toLowerCase());

  /**
   * Fills the postcode when a known office is picked, and only then.
   *
   * Never overwrites a code already in the box: the list is the head offices
   * and the larger branches, not the whole directory, so somebody who typed
   * their own is more likely to be right than we are.
   */
  const fillCode = (which: "present" | "permanent") => (office: string) => {
    const district = form.getFieldValue(`${which}District`);
    const code = postCodeOf(district, office);
    if (code) form.setFieldsValue({ [`${which}PostalCode`]: code });
  };

  /** Copies the present address across, and keeps it copied while ticked. */
  const handleSameAsPresent = (checked: boolean) => {
    setSameAsPresent(checked);
    if (!checked) return;
    const v = form.getFieldsValue();
    form.setFieldsValue({
      permanentDivision: v.presentDivision,
      permanentDistrict: v.presentDistrict,
      permanentCity: v.presentCity,
      permanentPoliceStation: v.presentPoliceStation,
      permanentPostOffice: v.presentPostOffice,
      permanentPostalCode: v.presentPostalCode,
      permanentDetailedAddress: v.presentDetailedAddress,
    });
  };

  const req = (message: string) =>
    required ? [{ required: true, message }] : [];

  return (
    <>
      <Divider orientation="left" orientationMargin={0}>
        <span className="text-base font-semibold">Address Information</span>
      </Divider>

      <div className="mt-4 grid gap-x-8 md:grid-cols-2">
        <div>
          <h3 className="mb-4 text-base font-semibold text-gray-800">
            Present Address
          </h3>
          <div className="grid gap-x-4 md:grid-cols-2">
            <Form.Item
              label="Division"
              name="presentDivision"
              rules={req("Division is required")}
            >
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                loading={pDivLoading}
                options={presentDivs}
                placeholder="Select division"
                onChange={() =>
                  form.setFieldsValue({
                    presentDistrict: undefined,
                    presentPoliceStation: undefined,
                  })
                }
              />
            </Form.Item>
            <Form.Item
              label="District"
              name="presentDistrict"
              rules={req("District is required")}
            >
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                loading={pDistLoading}
                options={presentDists}
                placeholder={
                  presentDivision ? "Select district" : "Pick a division first"
                }
                disabled={!presentDivision}
                onChange={() =>
                  form.setFieldsValue({ presentPoliceStation: undefined })
                }
              />
            </Form.Item>
            <Form.Item label="City / Village" name="presentCity">
              <Input placeholder="City or village" />
            </Form.Item>
            {/* Suggested, not restricted. The list is close but not official,
                so the box takes anything typed — a thana missing from it must
                never be a thana nobody can enter. */}
            <Form.Item
              label="Police Station (Thana)"
              name="presentPoliceStation"
              rules={req("Thana is required")}
            >
              <AutoComplete
                options={presentThanas}
                filterOption={contains}
                placeholder={
                  presentDistrict ? "Type or pick a thana" : "e.g. Keraniganj"
                }
              />
            </Form.Item>
            {/* Picking a listed office fills the code below. Typing one that
                is not listed is fine — the list is the head offices and the
                larger branches, not the whole directory. */}
            <Form.Item label="Post Office" name="presentPostOffice">
              <AutoComplete
                options={presentOffices}
                filterOption={contains}
                onSelect={fillCode("present")}
                placeholder={
                  presentDistrict ? "Type or pick a post office" : "e.g. Dhanmondi"
                }
              />
            </Form.Item>
            <Form.Item label="Postal Code" name="presentPostalCode">
              <Input placeholder="e.g. 1209" maxLength={4} />
            </Form.Item>
            <Form.Item
              label="Detailed Address"
              name="presentDetailedAddress"
              className="md:col-span-2"
              rules={req("Detailed address is required")}
            >
              <Input.TextArea
                rows={2}
                placeholder="House no., Road no., Village etc."
              />
            </Form.Item>
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-800">
              Permanent Address
            </h3>
            <Checkbox
              checked={sameAsPresent}
              onChange={(e) => handleSameAsPresent(e.target.checked)}
              className="text-xs"
            >
              Same as Present
            </Checkbox>
          </div>
          <div className="grid gap-x-4 md:grid-cols-2">
            <Form.Item label="Division" name="permanentDivision">
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                loading={perDivLoading}
                options={permanentDivs}
                placeholder="Select division"
                disabled={sameAsPresent}
                onChange={() =>
                  form.setFieldsValue({
                    permanentDistrict: undefined,
                    permanentPoliceStation: undefined,
                  })
                }
              />
            </Form.Item>
            <Form.Item label="District" name="permanentDistrict">
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                loading={perDistLoading}
                options={permanentDists}
                placeholder={
                  permanentDivision ? "Select district" : "Pick a division first"
                }
                disabled={sameAsPresent || !permanentDivision}
                onChange={() =>
                  form.setFieldsValue({ permanentPoliceStation: undefined })
                }
              />
            </Form.Item>
            <Form.Item label="City / Village" name="permanentCity">
              <Input disabled={sameAsPresent} placeholder="City or village" />
            </Form.Item>
            <Form.Item
              label="Police Station (Thana)"
              name="permanentPoliceStation"
            >
              <AutoComplete
                options={permanentThanas}
                filterOption={contains}
                disabled={sameAsPresent}
                placeholder={
                  permanentDistrict ? "Type or pick a thana" : "e.g. Keraniganj"
                }
              />
            </Form.Item>
            <Form.Item label="Post Office" name="permanentPostOffice">
              <AutoComplete
                options={permanentOffices}
                filterOption={contains}
                onSelect={fillCode("permanent")}
                disabled={sameAsPresent}
                placeholder={
                  permanentDistrict
                    ? "Type or pick a post office"
                    : "e.g. Dhanmondi"
                }
              />
            </Form.Item>
            <Form.Item label="Postal Code" name="permanentPostalCode">
              <Input
                disabled={sameAsPresent}
                placeholder="e.g. 1209"
                maxLength={4}
              />
            </Form.Item>
            <Form.Item
              label="Detailed Address"
              name="permanentDetailedAddress"
              className="md:col-span-2"
            >
              <Input.TextArea
                rows={2}
                disabled={sameAsPresent}
                placeholder="House no., Road no., Village etc."
              />
            </Form.Item>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressFields;
