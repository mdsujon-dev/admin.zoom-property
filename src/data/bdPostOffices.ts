/**
 * Post offices and their postcodes, by district.
 *
 * ⚠️ **Partial on purpose.** Bangladesh has upwards of seven hundred post
 * offices. This holds the head office of every district plus the branch offices
 * of the larger cities — roughly a hundred and thirty — and stops there.
 *
 * The reason is the shape of the mistake. A thana missing from a list is
 * obvious: the person types it and moves on. A postcode that is merely *wrong*
 * looks exactly like one that is right — four digits, correctly formatted,
 * silently filed against an address that will never receive post. Guessing the
 * remaining six hundred to make the list look complete would trade a visible
 * gap for an invisible error, which is the worse of the two.
 *
 * So: what is here is worth trusting, the field accepts anything typed, and the
 * code box stays editable after a post office is picked. Replace this file
 * wholesale if you get the official Bangladesh Post directory — the form does
 * not care where the list comes from.
 */
export interface PostOffice {
  /** The office name as people write it on an envelope. */
  name: string;
  /** Its four-digit postcode. */
  code: string;
}

export const BD_POST_OFFICES: Record<string, PostOffice[]> = {
  /* ── Dhaka ─────────────────────────────────────────────────────────── */
  Dhaka: [
    { name: "Dhaka GPO", code: "1000" },
    { name: "Cantonment", code: "1206" },
    { name: "Demra", code: "1360" },
    { name: "Dhamrai", code: "1350" },
    { name: "Dhanmondi", code: "1209" },
    { name: "Dohar", code: "1330" },
    { name: "Gulshan", code: "1212" },
    { name: "Keraniganj", code: "1310" },
    { name: "Mirpur", code: "1216" },
    { name: "Mohammadpur", code: "1207" },
    { name: "Nawabganj", code: "1320" },
    { name: "Sabujbagh", code: "1214" },
    { name: "Savar", code: "1340" },
    { name: "Tejgaon", code: "1215" },
    { name: "Uttara", code: "1230" },
  ],
  Gazipur: [
    { name: "Gazipur Sadar", code: "1700" },
    { name: "Kaliakair", code: "1750" },
    { name: "Kaliganj", code: "1720" },
    { name: "Kapasia", code: "1730" },
    { name: "Sreepur", code: "1740" },
    { name: "Tongi", code: "1710" },
  ],
  Narayanganj: [
    { name: "Narayanganj Sadar", code: "1400" },
    { name: "Araihazar", code: "1450" },
    { name: "Bandar", code: "1410" },
    { name: "Rupganj", code: "1460" },
    { name: "Sonargaon", code: "1440" },
  ],
  Narsingdi: [{ name: "Narsingdi Sadar", code: "1600" }],
  Manikganj: [{ name: "Manikganj Sadar", code: "1800" }],
  Munshiganj: [{ name: "Munshiganj Sadar", code: "1500" }],
  Tangail: [{ name: "Tangail Sadar", code: "1900" }],
  Kishoreganj: [{ name: "Kishoreganj Sadar", code: "2300" }],
  Faridpur: [{ name: "Faridpur Sadar", code: "7800" }],
  Gopalganj: [{ name: "Gopalganj Sadar", code: "8100" }],
  Madaripur: [{ name: "Madaripur Sadar", code: "7900" }],
  Rajbari: [{ name: "Rajbari Sadar", code: "7700" }],
  Shariatpur: [{ name: "Shariatpur Sadar", code: "8000" }],

  /* ── Chattogram ────────────────────────────────────────────────────── */
  Chattogram: [
    { name: "Chattogram GPO", code: "4000" },
    { name: "Agrabad", code: "4100" },
    { name: "Halishahar", code: "4216" },
    { name: "Hathazari", code: "4330" },
    { name: "Pahartali", code: "4202" },
    { name: "Patiya", code: "4370" },
    { name: "Sitakunda", code: "4310" },
  ],
  "Cox's Bazar": [
    { name: "Cox's Bazar Sadar", code: "4700" },
    { name: "Chakaria", code: "4740" },
    { name: "Teknaf", code: "4760" },
  ],
  Cumilla: [{ name: "Cumilla Sadar", code: "3500" }],
  Brahmanbaria: [{ name: "Brahmanbaria Sadar", code: "3400" }],
  Chandpur: [{ name: "Chandpur Sadar", code: "3600" }],
  Feni: [{ name: "Feni Sadar", code: "3900" }],
  Noakhali: [{ name: "Maijdee Court", code: "3800" }],
  Lakshmipur: [{ name: "Lakshmipur Sadar", code: "3700" }],
  Rangamati: [{ name: "Rangamati Sadar", code: "4500" }],
  Bandarban: [{ name: "Bandarban Sadar", code: "4600" }],
  Khagrachhari: [{ name: "Khagrachhari Sadar", code: "4400" }],

  /* ── Rajshahi ──────────────────────────────────────────────────────── */
  Rajshahi: [
    { name: "Rajshahi GPO", code: "6000" },
    { name: "Rajshahi University", code: "6205" },
  ],
  Bogura: [{ name: "Bogura Sadar", code: "5800" }],
  Chapainawabganj: [{ name: "Chapainawabganj Sadar", code: "6300" }],
  Joypurhat: [{ name: "Joypurhat Sadar", code: "5900" }],
  Naogaon: [{ name: "Naogaon Sadar", code: "6500" }],
  Natore: [{ name: "Natore Sadar", code: "6400" }],
  Pabna: [{ name: "Pabna Sadar", code: "6600" }],
  Sirajganj: [{ name: "Sirajganj Sadar", code: "6700" }],

  /* ── Khulna ────────────────────────────────────────────────────────── */
  Khulna: [
    { name: "Khulna GPO", code: "9000" },
    { name: "Daulatpur", code: "9202" },
    { name: "Khalishpur", code: "9000" },
  ],
  Bagerhat: [{ name: "Bagerhat Sadar", code: "9300" }],
  Chuadanga: [{ name: "Chuadanga Sadar", code: "7200" }],
  Jashore: [{ name: "Jashore Sadar", code: "7400" }],
  Jhenaidah: [{ name: "Jhenaidah Sadar", code: "7300" }],
  Kushtia: [{ name: "Kushtia Sadar", code: "7000" }],
  Magura: [{ name: "Magura Sadar", code: "7600" }],
  Meherpur: [{ name: "Meherpur Sadar", code: "7100" }],
  Narail: [{ name: "Narail Sadar", code: "7500" }],
  Satkhira: [{ name: "Satkhira Sadar", code: "9400" }],

  /* ── Barishal ──────────────────────────────────────────────────────── */
  Barishal: [{ name: "Barishal GPO", code: "8200" }],
  Barguna: [{ name: "Barguna Sadar", code: "8700" }],
  Bhola: [{ name: "Bhola Sadar", code: "8300" }],
  Jhalokati: [{ name: "Jhalokati Sadar", code: "8400" }],
  Patuakhali: [{ name: "Patuakhali Sadar", code: "8600" }],
  Pirojpur: [{ name: "Pirojpur Sadar", code: "8500" }],

  /* ── Sylhet ────────────────────────────────────────────────────────── */
  Sylhet: [{ name: "Sylhet GPO", code: "3100" }],
  Habiganj: [{ name: "Habiganj Sadar", code: "3300" }],
  Moulvibazar: [{ name: "Moulvibazar Sadar", code: "3200" }],
  Sunamganj: [{ name: "Sunamganj Sadar", code: "3000" }],

  /* ── Rangpur ───────────────────────────────────────────────────────── */
  Rangpur: [{ name: "Rangpur Sadar", code: "5400" }],
  Dinajpur: [{ name: "Dinajpur Sadar", code: "5200" }],
  Gaibandha: [{ name: "Gaibandha Sadar", code: "5700" }],
  Kurigram: [{ name: "Kurigram Sadar", code: "5600" }],
  Lalmonirhat: [{ name: "Lalmonirhat Sadar", code: "5500" }],
  Nilphamari: [{ name: "Nilphamari Sadar", code: "5300" }],
  Panchagarh: [{ name: "Panchagarh Sadar", code: "5000" }],
  Thakurgaon: [{ name: "Thakurgaon Sadar", code: "5100" }],

  /* ── Mymensingh ────────────────────────────────────────────────────── */
  Mymensingh: [{ name: "Mymensingh Sadar", code: "2200" }],
  Jamalpur: [{ name: "Jamalpur Sadar", code: "2000" }],
  Netrokona: [{ name: "Netrokona Sadar", code: "2400" }],
  Sherpur: [{ name: "Sherpur Sadar", code: "2100" }],
};

/** The post offices of a district; empty when none is chosen or none are known. */
export const postOfficesOf = (district?: string): PostOffice[] =>
  (district && BD_POST_OFFICES[district]) || [];

/**
 * The postcode for a post office in a district, when it is one we hold.
 *
 * Undefined for anything typed by hand, which is deliberate: the form fills the
 * code in as a convenience and never overwrites what somebody entered
 * themselves.
 */
export const postCodeOf = (district?: string, office?: string) =>
  postOfficesOf(district).find(
    (p) => p.name.toLowerCase() === (office || "").trim().toLowerCase(),
  )?.code;
