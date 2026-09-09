import { Button, Modal } from "antd";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

import { Printer } from "lucide-react";

import { useGetCompanySettingsQuery } from "../../redux/features/company/companyApi";
import {
  SAMPLE_COMPANY,
  qrPayload,
  renderIdCard,
  templateFor,
  withDefaults,
  type IdCardOptions,
  type IdCardPerson as TemplatePerson,
} from "./idCard/templates";

/** Which saved design this card should use. */
export type IdCardAudience = "agent" | "employee";

export type IdCardPerson = TemplatePerson & { audience?: IdCardAudience };

/**
 * A printable ID card, front and back.
 *
 * The layout is not decided here — it is whichever design the office picked for
 * this group in Settings → ID Cards, drawn by the shared template renderer. The
 * same renderer draws the previews on that settings screen, so what is chosen
 * there is exactly what comes out of the printer.
 *
 * Printing goes through its own window with an `@page` size, because printing
 * the panel would drag the sidebar and the table onto the paper. The QR is
 * generated on the client rather than fetched, so a card still prints on a
 * machine with no internet — which is usually the machine cards get printed on.
 */
const IdCardModal = ({
  person,
  onClose,
}: {
  person: IdCardPerson | null;
  onClose: () => void;
}) => {
  const { data: company } = useGetCompanySettingsQuery(undefined, {
    skip: !person,
  });

  const print = () => {
    const sheet = document.getElementById("id-card-sheet");
    if (!sheet) return;

    const win = window.open("", "_blank", "width=760,height=900");
    if (!win) {
      alert("Please allow popups for this site to print the ID card.");
      return;
    }

    // Extract only styles and fonts to avoid running React/Vite scripts in the print window
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((el) => el.outerHTML)
      .join("\n");

    win.document.write(`<!doctype html><html><head><title>ID Card</title>
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
      </style>
      </head><body>
      <div style="display:flex; justify-content:center; gap:20px; padding:20px; transform-origin: top center; transform: scale(1.1);">
        ${sheet.innerHTML}
      </div>
      </body></html>`);
    
    win.document.close();
    
    // Wait a brief moment for external fonts/images to load in the new window
    setTimeout(() => {
      win.focus();
      win.onafterprint = () => win.close();
      win.print();
    }, 1000);
  };

  const audience = person?.audience ?? "employee";
  const template =
    company?.idCardTemplates?.[audience] || templateFor(audience);
  // The office's tweaks for this group — colour, which rows print, the terms.
  const options = withDefaults(
    (company?.idCardOptions as Record<string, IdCardOptions>)?.[audience],
    audience
  );
  /**
   * The QR, drawn only when the office has asked for one.
   * A missing QR resolves as an empty string, skipped by the renderer.
   */
  const [qr, setQr] = useState("");
  let payload =
    person && options.showQr ? qrPayload(person, company ?? {}, options) : "";
    
  if (audience === "agent" && person?.code) {
    payload = `${window.location.origin}/agents/${encodeURIComponent(person.code)}`;
  }

  useEffect(() => {
    if (!payload) return setQr("");
    QRCode.toDataURL(payload, {
      margin: 0,
      width: 320,
      // A denser payload needs more forgiving correction to survive a print.
      errorCorrectionLevel: payload.length > 120 ? "M" : "Q",
      color: { dark: "#0a1b2d", light: "#ffffff" },
    })
      .then(setQr)
      // A missing QR is a smaller problem than a card that will not print.
      .catch(() => setQr(""));
  }, [payload]);

  const mergedCompany = {
    ...SAMPLE_COMPANY,
    ...company,
    address: company?.address || SAMPLE_COMPANY.address,
    phone: company?.phone || SAMPLE_COMPANY.phone,
    email: company?.email || SAMPLE_COMPANY.email,
    website: company?.website || SAMPLE_COMPANY.website,
    idCardNote: company?.idCardNote || SAMPLE_COMPANY.idCardNote,
  };

  const card = person
    ? renderIdCard(template, {
        person,
        company: mergedCompany,
        qr,
        options,
      })
    : null;

  return (
    <Modal
      title="ID card"
      open={!!person}
      onCancel={onClose}
      width={720}
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Close</Button>
          <Button
            type="primary"
            icon={<Printer className="h-4 w-4" />}
            onClick={print}
          >
            Print both sides
          </Button>
        </div>
      }
      destroyOnClose
    >
      {card && (
        <div
          id="id-card-sheet"
          className="flex flex-wrap justify-center gap-5 py-2"
        >
          {card.front}
          {card.back}
        </div>
      )}
    </Modal>
  );
};

export default IdCardModal;
