import { Button, Col, Form, Input, InputNumber, Modal, Row, Switch } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import UploadMedia from "../../shared/UploadMedia";
import LangInput from "../../Common/LangInput";
import {
  useCreateAreaMutation,
  useUpdateAreaMutation,
} from "../../../redux/features/area/areaApi";

interface Props {
  open: boolean;
  onClose: () => void;
  /** Undefined when adding. */
  area?: any;
}

/**
 * An area, added or edited.
 *
 * The market figures are typed rather than computed: a median taken from this
 * agency's own listings would swing on a single penthouse and would report what
 * we happen to be selling, not what the area is worth.
 */
const AreaModal = ({ open, onClose, area }: Props) => {
  const [form] = Form.useForm();
  const [createArea, { isLoading: creating }] = useCreateAreaMutation();
  const [updateArea, { isLoading: updating }] = useUpdateAreaMutation();
  const [monthlyRent, setMonthlyRent] = useState<number | null>(null);

  useEffect(() => {
    if (!open) {
      setMonthlyRent(null);
      return form.resetFields();
    }
    if (area) {
      form.setFieldsValue({
        ...area,
        image: area.image?._id ?? area.image,
        imageUrl: area.image?.key,
      });
      // Try to estimate monthly rent if medianPrice and yield are present
      if (area.medianPrice && area.rentalYield) {
        const pct = parseFloat(String(area.rentalYield).replace(/[^0-9.]/g, ""));
        if (!isNaN(pct) && pct > 0) {
          const estimatedYearly = (area.medianPrice * pct) / 100;
          setMonthlyRent(Math.round(estimatedYearly / 12));
        }
      }
    }
  }, [open, area, form]);

  const handleMonthlyRentChange = (rent: number | null) => {
    setMonthlyRent(rent);
    const median = form.getFieldValue("medianPrice");
    if (rent && median && median > 0) {
      const yearly = rent * 12;
      const calculatedYield = ((yearly / median) * 100).toFixed(1) + "%";
      form.setFieldsValue({ rentalYield: calculatedYield });
    }
  };

  const handleMedianPriceChange = (price: number | null) => {
    if (monthlyRent && price && price > 0) {
      const yearly = monthlyRent * 12;
      const calculatedYield = ((yearly / price) * 100).toFixed(1) + "%";
      form.setFieldsValue({ rentalYield: calculatedYield });
    }
  };

  const onFinish = async (values: any) => {
    const { imageUrl, ...rest } = values;
    void imageUrl;
    if (rest.medianPrice !== undefined && rest.medianPrice !== null) {
      rest.medianPrice = Number(rest.medianPrice) || 0;
    }
    if (rest.pricePerSqft !== undefined && rest.pricePerSqft !== null) {
      rest.pricePerSqft = Number(rest.pricePerSqft) || 0;
    }
    try {
      const res: any = area
        ? await updateArea({ id: area._id, data: rest }).unwrap()
        : await createArea(rest).unwrap();
      toast.success(res?.message || "Saved");
      onClose();
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not save the area");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={area ? "Edit area" : "Add an area"}
      footer={null}
      width={760}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          city: "Dhaka",
          isActive: true,
          featured: false,
          isHome: false,
        }}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <LangInput
              label="Name"
              name="name"
              lang="en"
              required
              placeholder="Gulshan (1 & 2)"
            />
          </Col>
          <Col xs={24} md={12}>
            <LangInput
              label="Name (Bangla)"
              name="nameBn"
              lang="bn"
              sourceFieldName="name"
              form={form}
              placeholder="গুলশান"
            />
          </Col>

          <Col xs={24} md={12}>
            <LangInput label="Tagline" name="tagline" lang="en" placeholder="Premium service" />
          </Col>
          <Col xs={24} md={12}>
            <LangInput
              label="Tagline (Bangla)"
              name="taglineBn"
              lang="bn"
              sourceFieldName="tagline"
              form={form}
              placeholder="প্রিমিয়াম সার্ভিস ও লাইফস্টাইল"
            />
          </Col>

          <Col xs={24}>
            <LangInput label="City" name="city" lang="en" placeholder="Dhaka" />
          </Col>

          <Col xs={24}>
            <LangInput
              label="Note"
              name="note"
              lang="en"
              isTextArea
              placeholder="Why people choose it"
            />
          </Col>
          <Col xs={24}>
            <LangInput
              label="Note (Bangla)"
              name="noteBn"
              lang="bn"
              isTextArea
              sourceFieldName="note"
              form={form}
              placeholder="কেন মানুষ এই এলাকা পছন্দ করে"
            />
          </Col>

          {/* Market & Comparison Metrics */}
          <Col xs={24}>
            <div className="my-2 rounded-lg border border-border/80 bg-muted/20 p-3.5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                  Market & Comparison Metrics (বাজার বিশ্লেষণ ও তুলনামূলক ডেটা)
                </p>
                <span className="text-[11px] text-muted-foreground">
                  💡 ভাড়া দিলে Rental Yield অটো হিসাব হবে
                </span>
              </div>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Median Price (গড় দাম - BDT)"
                    name="medianPrice"
                    tooltip="Asking median price in BDT. Example: 42500000 for ৳4.25 Cr"
                  >
                    <InputNumber
                      className="w-full"
                      placeholder="e.g. 42500000"
                      min={0}
                      onChange={handleMedianPriceChange}
                      formatter={(value) =>
                        value ? `৳ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""
                      }
                      parser={(value) =>
                        value ? Number(value.replace(/৳\s?|(,*)/g, "")) : (undefined as any)
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Price Per Sq Ft (প্রতি বর্গফুটের গড় রেট - BDT)"
                    name="pricePerSqft"
                    tooltip="Average price per sq ft in BDT. Example: 36000"
                  >
                    <InputNumber
                      className="w-full"
                      placeholder="e.g. 36000"
                      min={0}
                      formatter={(value) =>
                        value ? `৳ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""
                      }
                      parser={(value) =>
                        value ? Number(value.replace(/৳\s?|(,*)/g, "")) : (undefined as any)
                      }
                    />
                  </Form.Item>
                </Col>

                {/* Auto Monthly Rent Input Helper */}
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Estimated Monthly Rent (আনুমানিক মাসিক ভাড়া - BDT)"
                    tooltip="সাধারণ মাসিক ভাড়া লিখলে স্বয়ংক্রিয়ভাবে ১২ দিয়ে গুণ হয়ে বার্ষিক ভাড়া এবং Rental Yield (%) হিসাব হয়ে যাবে।"
                    extra={
                      monthlyRent
                        ? `বার্ষিক ভাড়া: ৳ ${(monthlyRent * 12).toLocaleString()} (${monthlyRent.toLocaleString()} × ১২ মাস)`
                        : undefined
                    }
                  >
                    <InputNumber
                      className="w-full"
                      placeholder="e.g. 25000"
                      min={0}
                      value={monthlyRent}
                      onChange={handleMonthlyRentChange}
                      formatter={(value) =>
                        value ? `৳ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""
                      }
                      parser={(value) =>
                        value ? Number(value.replace(/৳\s?|(,*)/g, "")) : (undefined as any)
                      }
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Rental Yield (বার্ষিক ভাড়া আয়ের শতকরা হার)"
                    name="rentalYield"
                    tooltip="মাসিক ভাড়া লিখলে এটি ১২ মাসের হিসাবে স্বয়ংক্রিয়ভাবে বসে যাবে অথবা আপনি সরাসরি পরিবর্তনও করতে পারেন। Example: 6.0%"
                    extra="টেবিলে এই শতকরা হারটি দেখাবে"
                  >
                    <Input placeholder="e.g. 6.0%" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Security Tier (নিরাপত্তা ব্যবস্থা)"
                    name="securityTier"
                    tooltip="Security setup. Example: 24/7 Diplomatic Police"
                  >
                    <Input placeholder="e.g. 24/7 Diplomatic Police" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Metro Connectivity (মেট্রোরেল যোগাযোগ)"
                    name="metroConnectivity"
                    tooltip="Example: 10 mins to MRT Line 6"
                  >
                    <Input placeholder="e.g. 10 mins to MRT Line 6" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Image" name="imageUrl">
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
            <Form.Item label="Featured" name="featured" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={12} md={4}>
            <Form.Item
              label="On home page"
              name="isHome"
              valuePropName="checked"
              tooltip="Areas ticked here are the ones the home page shows."
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={12} md={4}>
            <Form.Item label="Active" name="isActive" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={creating || updating}>
            {area ? "Save changes" : "Add area"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AreaModal;
