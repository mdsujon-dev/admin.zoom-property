import { Button, Empty, Form, Input, Space, Spin, Tabs, Tag, Tooltip } from "antd";
import { Languages, RotateCcw, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { translateToBanglaApi } from "../../components/Common/LangInput";
import PageHeader from "../../components/Common/PageHeader";
import PageMeta from "../../components/Common/PageMeta";
import PermissionGate from "../../components/Common/PermissionGate";
import {
  useGetCmsContentQuery,
  useResetCmsContentMutation,
  useSaveCmsContentMutation,
  type CmsContentDoc,
  type CmsUpsertItem,
} from "../../redux/features/cms/cmsApi";
import {
  cmsPageById,
  cmsStorageKey,
  type CmsField,
  type CmsSection,
} from "./cmsSchema";

/**
 * The copy on one public page, section by section.
 *
 * One component for all twelve pages rather than twelve near-identical ones:
 * the pages differ only in which fields they carry, and that is data
 * (`cmsSchema.ts`), not code. Adding a section to the site means regenerating
 * the schema — no new screen to write, and no screen left behind when a
 * dictionary key is renamed.
 *
 * Each field is stored twice, once per language, under `<dictionary path>.en`
 * and `.bn`. An empty box is not an empty string on the site: nothing is
 * stored, and the site keeps its built-in text — which is why the built-in
 * text is the placeholder rather than the initial value.
 */
const CmsPage = () => {
  const { pageId = "" } = useParams();
  const page = cmsPageById(pageId);

  const { data: stored = {}, isLoading } = useGetCmsContentQuery(pageId, {
    skip: !page,
  });

  if (!page) {
    return (
      <div className="py-20">
        <Empty description={`No CMS page called "${pageId}"`} />
      </div>
    );
  }

  return (
    <div>
      <PageMeta title={`${page.label} content · Zoom Property Admin`} noindex />
      <PageHeader
        title={`${page.label} content`}
        subtitle={page.description}
        breadcrumbs={[
          { title: "Dashboard", path: "/" },
          { title: "CMS" },
          { title: page.label },
        ]}
      />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spin />
        </div>
      ) : (
        <div className="rounded-xl border border-secondary-100 bg-white p-4">
          <Tabs
            tabPosition="left"
            className="cms-tabs"
            items={page.sections.map((section) => ({
              key: section.id,
              label: <span className="text-sm">{section.label}</span>,
              children: (
                <SectionForm
                  key={`${pageId}-${section.id}`}
                  pageId={pageId}
                  section={section}
                  stored={stored}
                />
              ),
            }))}
          />
        </div>
      )}
    </div>
  );
};

/** The value stored for one field in one language, or "" when untouched. */
const storedValue = (
  stored: Record<string, CmsContentDoc>,
  key: string,
  lang: "en" | "bn"
) => {
  const doc = stored[cmsStorageKey(key, lang)];
  const value = doc?.value;
  return typeof value === "string" ? value : "";
};

const SectionForm = ({
  pageId,
  section,
  stored,
}: {
  pageId: string;
  section: CmsSection;
  stored: Record<string, CmsContentDoc>;
}) => {
  const [form] = Form.useForm();
  const [translatingAll, setTranslatingAll] = useState(false);
  const [save, { isLoading: saving }] = useSaveCmsContentMutation();
  const [reset, { isLoading: resetting }] = useResetCmsContentMutation();

  const initial = useMemo(() => {
    const values: Record<string, string> = {};
    for (const field of section.fields) {
      values[`${field.key}|en`] = storedValue(stored, field.key, "en");
      values[`${field.key}|bn`] = storedValue(stored, field.key, "bn");
    }
    return values;
  }, [section, stored]);

  useEffect(() => {
    form.setFieldsValue(initial);
  }, [initial, form]);

  const overridden = section.fields.filter(
    (f) =>
      storedValue(stored, f.key, "en") || storedValue(stored, f.key, "bn")
  ).length;

  const onTranslateAll = async () => {
    setTranslatingAll(true);
    let count = 0;
    try {
      for (const field of section.fields) {
        const enVal = (form.getFieldValue(`${field.key}|en`) || field.en || "").trim();
        if (enVal) {
          const bnText = await translateToBanglaApi(enVal);
          if (bnText) {
            form.setFieldValue(`${field.key}|bn`, bnText);
            count++;
          }
        }
      }
      if (count > 0) {
        toast.success(`সেকশনের ${count}টি ফিল্ড বাংলায় অনুবাদ করা হয়েছে`);
      } else {
        toast.info("অনুবাদ করার মতো কোনো ইংরেজি টেক্সট পাওয়া যায়নি");
      }
    } catch {
      toast.error("অনুবাদ করতে সমস্যা হয়েছে");
    } finally {
      setTranslatingAll(false);
    }
  };

  const onFinish = async (values: Record<string, string>) => {
    const contents: CmsUpsertItem[] = [];
    const clear: string[] = [];

    for (const field of section.fields) {
      for (const lang of ["en", "bn"] as const) {
        const key = cmsStorageKey(field.key, lang);
        const next = (values[`${field.key}|${lang}`] ?? "").trim();
        const before = storedValue(stored, field.key, lang);
        if (next) {
          // Only what actually changed — a section of forty fields should not
          // write forty rows and forty history entries every time it is saved.
          if (next !== before) {
            contents.push({ key, value: next, group: pageId, type: "text" });
          }
        } else if (before) {
          clear.push(key);
        }
      }
    }

    if (!contents.length && !clear.length) {
      toast.info("Nothing changed");
      return;
    }

    try {
      if (contents.length) await save(contents).unwrap();
      if (clear.length) await reset(clear).unwrap();
      toast.success(`${section.label} saved`);
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not save the content");
    }
  };

  const onResetSection = async () => {
    const keys = section.fields.flatMap((f) =>
      (["en", "bn"] as const)
        .filter((lang) => storedValue(stored, f.key, lang))
        .map((lang) => cmsStorageKey(f.key, lang))
    );
    if (!keys.length) {
      toast.info("This section is already using the site's built-in text");
      return;
    }
    try {
      await reset(keys).unwrap();
      form.resetFields();
      toast.success(`${section.label} reset to the built-in text`);
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not reset the section");
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Space size={8}>
          <p className="text-sm font-medium text-secondary-800">
            {section.label}
          </p>
          <Tag color={overridden ? "blue" : "default"}>
            {overridden
              ? `${overridden} of ${section.fields.length} edited`
              : "Using built-in text"}
          </Tag>
        </Space>
        <Space>
          <Tooltip title="Translate all English fields in this section to Bangla">
            <Button
              icon={<Languages className="h-4 w-4 text-primary-600" />}
              loading={translatingAll}
              onClick={onTranslateAll}
              className="text-primary-700 border-primary-200 hover:bg-primary-50"
            >
              সবগুলো বাংলা করুন
            </Button>
          </Tooltip>
          <PermissionGate module="Dynamic Content" action="Delete">
            <Tooltip title="Clear this section's edits and go back to the text built into the site">
              <Button
                icon={<RotateCcw className="h-4 w-4" />}
                loading={resetting}
                onClick={onResetSection}
              >
                Reset
              </Button>
            </Tooltip>
          </PermissionGate>
          <PermissionGate module="Dynamic Content" action="Update">
            <Button
              type="primary"
              htmlType="submit"
              icon={<Save className="h-4 w-4" />}
              loading={saving}
            >
              Save section
            </Button>
          </PermissionGate>
        </Space>
      </div>

      <div className="space-y-1">
        {section.fields.map((field) => (
          <FieldRow key={field.key} field={field} form={form} />
        ))}
      </div>
    </Form>
  );
};

/**
 * One string, in both languages.
 *
 * Side by side with 1-click English to Bangla auto-translation button.
 */
const FieldRow = ({
  field,
  form,
}: {
  field: CmsField;
  form: any;
}) => {
  const [translating, setTranslating] = useState(false);
  const Control = field.type === "textarea" ? Input.TextArea : Input;

  const handleTranslate = async () => {
    const enVal = (form.getFieldValue(`${field.key}|en`) || field.en || "").trim();
    if (!enVal) {
      toast.warning("অনুবাদ করার জন্য প্রথমে ইংরেজি বক্সে লিখুন");
      return;
    }
    setTranslating(true);
    try {
      const bnText = await translateToBanglaApi(enVal);
      if (bnText) {
        form.setFieldValue(`${field.key}|bn`, bnText);
        toast.success("বাংলায় অনুবাদ সম্পন্ন হয়েছে");
      }
    } catch {
      toast.error("অনুবাদ করতে সমস্যা হয়েছে");
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="grid gap-3 border-b border-secondary-50 py-3 last:border-0 md:grid-cols-2">
      <Form.Item
        label={
          <span className="text-xs font-medium text-secondary-700">
            {field.label}
          </span>
        }
        name={`${field.key}|en`}
        className="!mb-0"
        tooltip={field.key}
      >
        <Control
          placeholder={field.en || "—"}
          autoSize={field.type === "textarea" ? { minRows: 2 } : undefined}
        />
      </Form.Item>
      <Form.Item
        label={
          <div className="flex w-full items-center justify-between">
            <span className="text-xs font-medium text-secondary-500">
              {field.label} (বাংলা)
            </span>
            <Button
              type="link"
              size="small"
              onClick={handleTranslate}
              loading={translating}
              icon={!translating ? <Languages className="h-3.5 w-3.5 text-primary-600" /> : undefined}
              className="!h-auto !p-0 !text-xs !font-medium text-primary-600 hover:text-primary-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              বাংলা করুন
            </Button>
          </div>
        }
        name={`${field.key}|bn`}
        className="!mb-0"
      >
        <Control
          placeholder={field.bn || "—"}
          autoSize={field.type === "textarea" ? { minRows: 2 } : undefined}
        />
      </Form.Item>
    </div>
  );
};

export default CmsPage;
