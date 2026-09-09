import { Button, Dropdown, Modal, Radio, Tooltip } from "antd";
import type { ButtonProps } from "antd";
import { Download, FileSpreadsheet, FileText, FileType2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

import {
  exportToExcel,
  exportToPdf,
  exportToWord,
  type ExportSheet,
  type PdfOrientation,
  type PdfPageSize,
} from "../../utils/tableExport";

export type ExportFormat = "xlsx" | "pdf" | "docx";

/**
 * The three files every list in the panel offers, in one button.
 *
 * Pages hand over a `sheet` — a title and a plain grid — and nothing else: the
 * menu, the file names, the "building your file" wait, the empty-list guard and
 * the failure toast all live here. Before this, each list that wanted an export
 * grew its own dropdown, and they drifted: different wording, different
 * formats offered, some silently doing nothing when the list was empty.
 *
 *   <ExportMenu sheet={buildSheet} disabled={rows.length === 0} />
 *
 * `sheet` may be a function, and may be async — a list that only holds the page
 * it is showing can fetch every matching row at the moment Export is clicked
 * rather than keeping them all in memory for a button nobody may press.
 */
const FORMATS: {
  key: ExportFormat;
  label: string;
  icon: typeof FileSpreadsheet;
  /** The one most people want; picked out so the eye lands on it. */
  primary?: boolean;
  run: (sheet: ExportSheet) => void | Promise<void>;
}[] = [
  {
    key: "xlsx",
    label: "Excel (.xlsx)",
    icon: FileSpreadsheet,
    run: exportToExcel,
  },
  {
    key: "pdf",
    label: "PDF (.pdf)",
    icon: FileText,
    primary: true,
    // Never called directly: PDF asks for a paper size first, and the answer
    // has to reach `exportToPdf`. See `pending` below.
    run: exportToPdf,
  },
  { key: "docx", label: "Word (.docx)", icon: FileType2, run: exportToWord },
];


/**
 * The papers on offer, with what each is for.
 *
 * A page size is not a preference, it is a question about the printer the file
 * is going to — so the choice is made at the moment of export, by the person
 * who knows the answer, rather than fixed in the code at A4 landscape for
 * everybody.
 */
const PAPERS: { value: PdfPageSize; label: string; hint: string }[] = [
  { value: "a4", label: "A4", hint: "210 × 297 mm — the usual" },
  { value: "a3", label: "A3", hint: "297 × 420 mm — wide registers" },
  { value: "a5", label: "A5", hint: "148 × 210 mm — short lists" },
  { value: "letter", label: "Letter", hint: "8.5 × 11 in" },
  { value: "legal", label: "Legal", hint: "8.5 × 14 in" },
];

type Props = {
  /**
   * The grid to write out, or a (possibly async) builder called on click.
   *
   * The builder is told which file was chosen, so a page can hand Excel the
   * whole record and the printed formats the columns that fit on a page — see
   * `makeSheet`'s `columns` / `detail`.
   */
  sheet:
    | ExportSheet
    | ((format: ExportFormat) => ExportSheet | Promise<ExportSheet>);
  /** Narrow the menu — defaults to all three. */
  formats?: ExportFormat[];
  label?: string;
  disabled?: boolean;
  size?: ButtonProps["size"];
  type?: ButtonProps["type"];
  className?: string;
};

const ExportMenu = ({
  sheet,
  formats,
  label = "Export",
  disabled,
  size = "middle",
  type = "default",
  className,
}: Props) => {
  // Building can mean a round trip for every matching row, so the button says
  // so rather than looking dead for a second or two.
  const [busy, setBusy] = useState(false);

  /* A built sheet waiting on a paper size. Held rather than rebuilt after the
     dialog: building can be a fetch of every matching row, and doing it twice
     — once to find out it is empty, once after the questions — would double
     the wait for no reason. */
  const [pending, setPending] = useState<ExportSheet | null>(null);
  const [paper, setPaper] = useState<PdfPageSize>("a4");
  const [orientation, setOrientation] = useState<PdfOrientation>("landscape");

  const items = FORMATS.filter(
    (f) => !formats || formats.includes(f.key)
  ).map((f) => ({
    key: f.key,
    label: (
      <span
        className={`flex items-center gap-2 ${
          f.primary ? "font-semibold text-primary" : ""
        }`}
      >
        <f.icon className="h-3.5 w-3.5" />
        {f.label}
      </span>
    ),
  }));

  const handle = async (key: string) => {
    const format = FORMATS.find((f) => f.key === key);
    if (!format || busy) return;

    setBusy(true);
    try {
      const built =
        typeof sheet === "function" ? await sheet(format.key) : sheet;

      // Writing an empty file looks like a broken export. Say why instead.
      if (!built?.rows?.length) {
        toast.warn("Nothing to export — the list is empty");
        return;
      }

      if (format.key === "pdf") {
        /* Wide tables want a landscape page and narrow ones do not, so the
           dialog opens on whichever is the better guess for this sheet — and
           the person exporting can still say otherwise. */
        setOrientation(built.headers.length > 6 ? "landscape" : "portrait");
        setPending(built);
        return;
      }

      await format.run(built);
      toast.success(
        `Exported ${built.rows.length} row${built.rows.length === 1 ? "" : "s"}`
      );
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Could not export");
    } finally {
      setBusy(false);
    }
  };

  const writePdf = async () => {
    if (!pending) return;
    setBusy(true);
    try {
      await exportToPdf(pending, { size: paper, orientation });
      toast.success(
        `Exported ${pending.rows.length} row${
          pending.rows.length === 1 ? "" : "s"
        }`
      );
      setPending(null);
    } catch (err: any) {
      toast.error(err?.message || "Could not export");
    } finally {
      setBusy(false);
    }
  };

  const paperDialog = (
    <Modal
      open={!!pending}
      title="Page setup"
      okText="Download PDF"
      confirmLoading={busy}
      onOk={writePdf}
      onCancel={() => setPending(null)}
      width={460}
    >
      <p className="mb-3 text-xs text-secondary-400">
        {pending?.title} · {pending?.rows.length ?? 0} row
        {pending?.rows.length === 1 ? "" : "s"}
      </p>

      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-secondary-500">
        Paper size
      </p>
      <Radio.Group
        value={paper}
        onChange={(e) => setPaper(e.target.value)}
        className="mb-4 flex flex-col gap-1"
      >
        {PAPERS.map((p) => (
          <Radio key={p.value} value={p.value}>
            <span className="font-medium">{p.label}</span>{" "}
            <span className="text-xs text-secondary-400">{p.hint}</span>
          </Radio>
        ))}
      </Radio.Group>

      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-secondary-500">
        Orientation
      </p>
      <Radio.Group
        value={orientation}
        onChange={(e) => setOrientation(e.target.value)}
        optionType="button"
        buttonStyle="solid"
        options={[
          { label: "Landscape", value: "landscape" },
          { label: "Portrait", value: "portrait" },
        ]}
      />
    </Modal>
  );

  const button = (
    <Button
      size={size}
      type={type}
      className={className}
      disabled={disabled}
      loading={busy}
      icon={!busy && <Download className="h-3.5 w-3.5" />}
    >
      {busy ? "Preparing..." : label}
    </Button>
  );

  // A greyed-out button with no explanation reads as broken. Antd swallows
  // hover events on a disabled button, so the tooltip goes on a wrapper.
  if (disabled) {
    return (
      <Tooltip title="Nothing to export — this list is empty">
        <span className="inline-block cursor-not-allowed">{button}</span>
      </Tooltip>
    );
  }

  return (
    <>
      <Dropdown
        trigger={["click"]}
        disabled={busy}
        menu={{ items, onClick: ({ key }) => handle(key) }}
      >
        {button}
      </Dropdown>
      {paperDialog}
    </>
  );
};

export default ExportMenu;
