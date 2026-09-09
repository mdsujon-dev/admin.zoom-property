/**
 * Who the paperwork comes from.
 *
 * A voucher or an exported register printed from this software should say which
 * agency issued it, and it should say the same thing everywhere — so the
 * strings live here rather than in whichever file needed them first.
 *
 * These are the fallbacks. Where a screen can read Settings → Company it should
 * prefer what the office has entered and fall back to these; the export
 * template uses them directly, because a file is written from a click without
 * waiting on a settings fetch that may not have landed.
 */
export const COMPANY = {
  name: "Zoom Property",
  address: "Dhaka, Bangladesh",
  email: "info@zoomproperty.com",
  website: "www.zoomproperty.com",
  /** Served from `public/`, so it is fetchable at runtime rather than bundled. */
  logo: "/assets/logo.png",
} as const;

/** The one-line contact the voucher and the export letterhead both print. */
export const COMPANY_CONTACT = `${COMPANY.email}, ${COMPANY.website}`;

/** The brand navy, as a hex pair for jsPDF and docx (neither takes CSS). */
export const BRAND = { hex: "133050", rgb: [19, 48, 80] as const };
