import { Button, ColorPicker, Input, Modal, Segmented, Switch } from "antd";
import {
  Check,
  CreditCard,
  Eye,
  GraduationCap,
  Printer,
  RotateCcw,
  Users,
  UserCog,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import PageHeader from "../../../components/Common/PageHeader";
import PageMeta from "../../../components/Common/PageMeta";
import PermissionGate from "../../../components/Common/PermissionGate";
import { Panel, TabBar } from "../../../components/Details/DetailKit";
import {
  DEFAULT_OPTIONS,
  ID_CARD_TEMPLATES,
  SAMPLE_COMPANY,
  renderIdCard,
  SAMPLE_PERSON,
  templateFor,
  withDefaults,
  CARD_FIELDS,
  type CardField,
  type QrMode,
  type IdCardOptions,
} from "../../../components/shared/idCard/templates";
import {
  useGetCompanySettingsQuery,
  useUpdateCompanySettingsMutation,
} from "../../../redux/features/company/companyApi";

type Audience = "agent" | "employee";

const TABS: { key: Audience; label: string; icon: any }[] = [
  { key: "agent", label: "Agent", icon: Users },
  { key: "employee", label: "Employee", icon: UserCog },
];

const blankByAudience = (): Record<Audience, IdCardOptions> => ({
  agent: withDefaults(undefined, "agent"),
  employee: withDefaults(undefined, "employee"),
});

/**
 * How each group's card is tuned (Settings → ID Cards).
 *
 * The card is shown as the card it actually is, drawn by the same renderer that
 * prints it. "View" opens it at full size, and every tweak on the right redraws
 * it live, so nothing here is a promise about what the printer will do.
 *
 * Every knob on this screen changes something on the card — that is the rule
 * this screen is held to. Front and back list the same catalogue of fields, so
 * anything the record knows can be printed on either face, or both, or neither.
 */
const IdCardSettings = () => {
  const { data: company, isFetching } = useGetCompanySettingsQuery();
  const [save, { isLoading }] = useUpdateCompanySettingsMutation();

  const [tab, setTab] = useState<Audience>("agent");
  // Each group starts on its own design — see DEFAULT_BY_AUDIENCE.
  const [picked, setPicked] = useState<Record<Audience, string>>({
    agent: templateFor("agent"),
    employee: templateFor("employee"),
  });
  const [options, setOptions] = useState<Record<Audience, IdCardOptions>>(
    blankByAudience()
  );
  const [viewing, setViewing] = useState<string | null>(null);

  useEffect(() => {
    if (!company) return;
    const saved = company.idCardTemplates;
    if (saved) {
      setPicked({
        agent: saved.agent || templateFor("agent"),
        employee: saved.employee || templateFor("employee"),
      });
    }
    const savedOptions = (company.idCardOptions ?? {}) as Record<
      Audience,
      IdCardOptions
    >;
    setOptions({
      agent: withDefaults(savedOptions.agent, "agent"),
      employee: withDefaults(savedOptions.employee, "employee"),
    });
  }, [company]);

  const opt = options[tab];
  const sample = SAMPLE_PERSON[tab];

  const patch = (next: Partial<IdCardOptions>) =>
    setOptions((all) => ({ ...all, [tab]: { ...all[tab], ...next } }));

  /**
   * Front and back are the same switch over the same catalogue — only the
   * bucket differs, so one function serves both sides.
   */
  const patchSide = (side: "fields" | "backFields") => (key: CardField, on: boolean) =>
    setOptions((all) => ({
      ...all,
      [tab]: { ...all[tab], [side]: { ...all[tab][side], [key]: on } },
    }));
  const patchFront = patchSide("fields");
  const patchBack = patchSide("backFields");

  const onSave = async () => {
    try {
      await save({ idCardTemplates: picked, idCardOptions: options }).unwrap();
      toast.success("Card design saved");
    } catch (err: any) {
      toast.error(err?.data?.message || "Could not save the design");
    }
  };

  // Printing a sample is how somebody checks a colour before printing 200 of
  // them — it goes through the same window and page size the real card does.
  const printSample = (template: string) => {
    const node = document.getElementById(`id-card-view-${template}`);
    if (!node) return;
    
    const win = window.open("", "_blank", "width=760,height=900");
    if (!win) {
      alert("Please allow popups for this site to print the ID card.");
      return;
    }

    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((el) => el.outerHTML)
      .join("\n");

    win.document.write(`<!doctype html><html><head><title>ID card sample</title>
      ${styles}
      <style>
        body { 
          background: #fff; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          min-height: 100vh;
          margin: 0;
        }
        @page { size: auto; margin: 0; }
        @media print {
          body * { visibility: visible !important; }
          * { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
          }
        }
      </style></head><body>
      <div style="display:flex; justify-content:center; gap:20px; padding:20px; transform-origin: top center; transform: scale(1.1);">
        ${node.innerHTML}
      </div>
      </body></html>`);
    
    win.document.close();
    
    setTimeout(() => {
      win.focus();
      win.onafterprint = () => win.close();
      win.print();
    }, 1000);
  };

  const safeInst: any = company || {};
  const mergedInst = {
    ...SAMPLE_COMPANY,
    ...safeInst,
    address: safeInst.address || SAMPLE_COMPANY.address,
    phone: safeInst.phone || SAMPLE_COMPANY.phone,
    email: safeInst.email || SAMPLE_COMPANY.email,
    website: safeInst.website || SAMPLE_COMPANY.website,
    idCardNote: safeInst.idCardNote || SAMPLE_COMPANY.idCardNote,
  };

  const viewCard = viewing
    ? renderIdCard(viewing, {
        person: sample,
        company: mergedInst,
        options: opt,
      })
    : null;

  return (
    <div>
      <PageMeta
        title="ID Cards · Zoom Property Admin"
        description="Choose and adjust the ID card design for each group."
        canonicalUrl={`${window.location.origin}/settings/id-cards`}
        noindex
      />

      <PageHeader
        title="ID Cards"
        subtitle="Pick a design per group and adjust it — printed at 54 × 86 mm"
        breadcrumbs={[
          { title: "Dashboard", path: "/" },
          { title: "Settings" },
          { title: "ID Cards" },
        ]}
        extra={
          <PermissionGate module="Company Settings" action="Update">
            <Button type="primary" onClick={onSave} loading={isLoading}>
              Save design
            </Button>
          </PermissionGate>
        }
      />

      <TabBar active={tab} onChange={(k) => setTab(k as Audience)} tabs={TABS} />

      <div className="mb-4 flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm text-secondary-700">
        <CreditCard className="h-4 w-4 shrink-0 text-blue-500" />
        <span>
          The card fills itself from the company's details and the person's
          record. Set the name, logo and address in{" "}
          <span className="font-medium">Settings → Company</span> — they show
          on the card itself. Anything not set there is shown here as an example
          and is left off the printed card.
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* ── The card ─────────────────────────────────────────────────
            One design, so no two-column chooser: the preview gets the column to
            itself and the switches beside it decide what goes on it. */}
        <div className="grid gap-4 lg:col-span-2">
          {isFetching
            ? ID_CARD_TEMPLATES.map((t) => (
                <div
                  key={t.key}
                  className="h-64 animate-pulse rounded-xl border border-secondary-100 bg-white"
                />
              ))
            : ID_CARD_TEMPLATES.map((t) => {
                const on = picked[tab] === t.key;
                const card = renderIdCard(t.key, {
                  person: sample,
                  company: mergedInst,
                  options: opt,
                });

                return (
                  <div
                    key={t.key}
                    className={`flex flex-col rounded-xl border-2 bg-white p-4 transition-all ${
                      on
                        ? "border-primary shadow-card"
                        : "border-secondary-100 hover:border-primary-200"
                    }`}
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setPicked((p) => ({ ...p, [tab]: t.key }))
                        }
                        className="flex min-w-0 flex-1 items-center gap-2 text-left"
                      >
                        <span
                          className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${
                            on
                              ? "border-primary bg-primary text-white"
                              : "border-secondary-200"
                          }`}
                        >
                          {on && <Check className="h-3 w-3" />}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-secondary-900">
                            {t.name}
                          </span>
                          <span className="block truncate text-xs text-secondary-400">
                            {t.hint}
                          </span>
                        </span>
                      </button>

                      <Button
                        size="small"
                        icon={<Eye className="h-3.5 w-3.5" />}
                        onClick={() => setViewing(t.key)}
                      >
                        View
                      </Button>
                    </div>

                    {/* Both sides, scaled into a fixed box so every tile is the
                        same height whatever the design does. */}
                    <button
                      type="button"
                      onClick={() => setViewing(t.key)}
                      className="relative h-[150px] w-full overflow-hidden rounded-lg bg-secondary-50"
                    >
                      <div
                        className="absolute left-1/2 top-2 flex gap-2"
                        style={{
                          transform: "translateX(-50%) scale(0.42)",
                          transformOrigin: "top center",
                        }}
                      >
                        {card.front}
                        {card.back}
                      </div>
                    </button>
                  </div>
                );
              })}
        </div>

        {/* ── The knobs ────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <Panel
            title="Adjust"
            icon={CreditCard}
            subtitle={`Applies to every ${tab} card`}
            action={
              <Button
                size="small"
                icon={<RotateCcw className="h-3.5 w-3.5" />}
                onClick={() => patch(withDefaults(undefined, tab))}
              >
                Reset
              </Button>
            }
          >
            <div className="space-y-4">
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-secondary-500">
                  Accent colour
                </p>
                <div className="flex items-center gap-2">
                  <ColorPicker
                    value={opt.accent || DEFAULT_OPTIONS.accent}
                    onChange={(c) => patch({ accent: c.toHexString() })}
                    showText
                  />
                  {/* The header, the strip and the wave are all shaded from
                      this one colour, so there is only ever one to pick. */}
                  <span className="text-xs text-secondary-400">
                    Headers, rules and highlights
                  </span>
                </div>
              </div>

              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-secondary-500">
                  Front of the card
                </p>
                <p className="mb-2 text-xs text-secondary-400">
                  Name always prints. Everything else is yours to choose.
                </p>
                <div className="space-y-2">
                  {CARD_FIELDS.map((f) => (
                    <label
                      key={f.key}
                      className="flex items-center justify-between gap-2 text-sm text-secondary-700"
                    >
                      {f.label}
                      <Switch
                        size="small"
                        checked={opt.fields?.[f.key] === true}
                        onChange={(v) => patchFront(f.key, v)}
                      />
                    </label>
                  ))}
                  <label className="flex items-center justify-between gap-2 text-sm text-secondary-700">
                    Photo
                    <Switch
                      size="small"
                      checked={opt.showPhoto !== false}
                      onChange={(v) => patch({ showPhoto: v })}
                    />
                  </label>
                </div>
              </div>

              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-secondary-500">
                  Back of the card
                </p>
                <p className="mb-2 text-xs text-secondary-400">
                  The same list again — a field can print on either side, or on
                  both.
                </p>
                <div className="space-y-2">
                  {CARD_FIELDS.map((f) => (
                    <label
                      key={f.key}
                      className="flex items-center justify-between gap-2 text-sm text-secondary-700"
                    >
                      {f.label}
                      <Switch
                        size="small"
                        checked={opt.backFields?.[f.key] === true}
                        onChange={(v) => patchBack(f.key, v)}
                      />
                    </label>
                  ))}
                  <label className="flex items-center justify-between gap-2 text-sm text-secondary-700">
                    QR code
                    <Switch
                      size="small"
                      checked={opt.showQr === true}
                      onChange={(v) => patch({ showQr: v })}
                    />
                  </label>
                  <label className="flex items-center justify-between gap-2 text-sm text-secondary-700">
                    Signature line
                    <Switch
                      size="small"
                      checked={opt.showSignature !== false}
                      onChange={(v) => patch({ showSignature: v })}
                    />
                  </label>
                </div>
              </div>

              {opt.showQr && (
                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-secondary-500">
                    What the QR holds
                  </p>
                  <Segmented
                    block
                    value={opt.qrMode || "details"}
                    onChange={(v) => patch({ qrMode: v as QrMode })}
                    options={[
                      { label: "All details", value: "details" },
                      { label: "ID only", value: "id" },
                      { label: "Link", value: "url" },
                    ]}
                  />
                  {opt.qrMode === "url" ? (
                    <>
                      <Input
                        className="mt-2"
                        value={opt.qrUrlPattern || ""}
                        onChange={(e) => patch({ qrUrlPattern: e.target.value })}
                        placeholder="https://example.com/verify/{code}"
                      />
                      <p className="mt-1 text-xs text-secondary-400">
                        <span className="font-mono">{"{code}"}</span> is replaced
                        with the person's ID. Empty falls back to all details.
                      </p>
                    </>
                  ) : (
                    <p className="mt-1 text-xs text-secondary-400">
                      {opt.qrMode === "id"
                        ? "Just the ID number — for door scanners and spreadsheets."
                        : "Scanning shows the record as text, with no app or internet. Only the rows switched on above are included."}
                    </p>
                  )}
                </div>
              )}

              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-secondary-500">
                  Terms on the back
                </p>
                <Input.TextArea
                  rows={5}
                  value={(opt.terms ?? []).join("\n")}
                  placeholder={
                    "One line per term.\nLeave empty for the standard wording."
                  }
                  onChange={(e) =>
                    patch({ terms: e.target.value.split("\n") })
                  }
                />
                <p className="mt-1 text-xs text-secondary-400">
                  One line per bullet. Empty falls back to the standard four.
                </p>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {/* ── Full size ─────────────────────────────────────────────────── */}
      <Modal
        title={`${
          ID_CARD_TEMPLATES.find((t) => t.key === viewing)?.name ?? "Card"
        } — ${TABS.find((t) => t.key === tab)?.label}`}
        open={!!viewing}
        onCancel={() => setViewing(null)}
        width={720}
        footer={
          <div className="flex justify-end gap-2">
            <Button onClick={() => setViewing(null)}>Close</Button>
            <Button
              onClick={() => viewing && printSample(viewing)}
              icon={<Printer className="h-4 w-4" />}
            >
              Print a sample
            </Button>
            <Button
              type="primary"
              onClick={() => {
                if (viewing) setPicked((p) => ({ ...p, [tab]: viewing }));
                setViewing(null);
              }}
            >
              Use this design
            </Button>
          </div>
        }
        destroyOnClose
      >
        {viewCard && (
          <>
            <div
              id={`id-card-view-${viewing}`}
              className="flex flex-wrap justify-center gap-5 py-2"
            >
              {viewCard.front}
              {viewCard.back}
            </div>
            <p className="mt-2 text-center text-xs text-secondary-400">
              Shown at print size with a stand-in person — a real card uses the
              record's own details.
            </p>
          </>
        )}
      </Modal>
    </div>
  );
};

export default IdCardSettings;
