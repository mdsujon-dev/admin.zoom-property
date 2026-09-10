/**
 * What the CMS can edit, page by page.
 *
 * Generated from the public site's dictionaries
 * (`frontend.zoom-property/src/i18n/messages/{en,bn}.json`) by
 * `scripts/gen_cms_schema.py`. Regenerate rather than hand-editing: a list
 * typed out by hand goes stale the first time a dictionary key is added, and
 * a CMS that offers a field the site does not read is worse than no field.
 *
 * `en` and `bn` carry what the site says today. They are shown as the input's
 * placeholder, so an empty box means "unchanged, still using the built-in
 * text" rather than "blank on the site".
 *
 * A key here is the dictionary path (`hero.title`). Stored per language as
 * `<path>.<lang>` in the Dynamic Content collection, grouped by page id.
 */

export type CmsFieldType = "text" | "textarea" | "url" | "image";

export interface CmsField {
  /** Dictionary path, e.g. `hero.trust.rajuk`. */
  key: string;
  label: string;
  type: CmsFieldType;
  /** What the site says today, in each language. Used as placeholder text. */
  en: string;
  bn: string;
  /**
   * Starts a titled block within the section. Set on the first field of the
   * block; the editor groups everything after it until the next header.
   */
  groupHeader?: string;
  /** Overrides the default guidance shown beside an `image` field. */
  hint?: string;
}

/**
 * `image` and `url` fields hold one address, not one string per language, so
 * the editor shows a single control and stores the same value under both
 * languages.
 */

/**
 * A field inside a repeatable item - the "title" or "body" of one step, one
 * benefit, one stat. `suffix` is what goes after the index, so
 * `pages.buying.steps.2.title` addresses the third step's title.
 */
export interface CmsRepeatableField {
  suffix: string;
  label: string;
  type: CmsFieldType;
  defaultEn?: string;
  defaultBn?: string;
}

/**
 * A section whose content is a list rather than a fixed set of fields - the
 * buying steps, the stats band, the FAQ. The editor renders add / remove
 * controls and numbers each item as it goes.
 */
export interface CmsRepeatable {
  /** Key prefix the index is appended to, e.g. `pages.buying.steps`. */
  itemPrefix: string;
  /** Singular noun for the add button and the item headings: "Step". */
  itemName: string;
  addButtonText?: string;
  /** How many blank items to show before anything has been saved. */
  initialCount?: number;
  itemFields: CmsRepeatableField[];
  /** What the site ships today, so an untouched list still has its text. */
  defaultItems?: Record<string, string>[];
}

export interface CmsSection {
  id: string;
  label: string;
  fields: CmsField[];
  /**
   * Present when the section is a list. Set by hand in this file rather than
   * generated: the dictionary stores these as JSON arrays, and which of their
   * keys are editable is an editorial decision, not something the shape can
   * be read off.
   */
  repeatable?: CmsRepeatable;
}

export interface CmsPageDef {
  id: string;
  label: string;
  description: string;
  sections: CmsSection[];
}

export const cmsPages: CmsPageDef[] = [
  {
    id: "home",
    label: "Home",
    description: "The landing page, top to bottom.",
    sections: [
      {
        id: "hero",
        label: "Hero",
        fields: [
          { key: "hero.badge", label: "Badge", type: "text", en: "RAJUK plan & title deed cleared", bn: "রাজউক নকশা ও দলিল যাচাই করা" },
          { key: "hero.title", label: "Title", type: "text", en: "Every property vetted before you step inside", bn: "ঘরে পা রাখার আগেই প্রতিটি সম্পত্তি যাচাই করা" },
          { key: "hero.lead", label: "Lead", type: "textarea", en: "Dhaka and Chattogram property, with the papers checked first. Live construction milestones, verified records and no hidden markup.", bn: "ঢাকা ও চট্টগ্রামের সম্পত্তি, কাগজপত্র আগে দেখে নেওয়া। নির্মাণের অগ্রগতি সরাসরি, দলিল যাচাই করা, কোনো লুকানো খরচ নেই।" },
        ],
      },
      {
        id: "hero.trust",
        label: "Hero · Trust",
        fields: [
          { key: "hero.trust.rajuk", label: "Rajuk", type: "text", en: "RAJUK plan verified", bn: "রাজউক নকশা যাচাই করা" },
          { key: "hero.trust.reply", label: "Reply", type: "text", en: "Advisors reply in ~11 min", bn: "উত্তর আসে ~১১ মিনিটে" },
          { key: "hero.trust.photos", label: "Photos", type: "text", en: "Photos dated this month", bn: "এ মাসেই তোলা ছবি" },
          { key: "hero.trust.fees", label: "Fees", type: "text", en: "Stamp duty itemised", bn: "স্ট্যাম্প ডিউটি আলাদা করে লেখা" },
        ],
      },
      {
        id: "showcase",
        label: "Showcase",
        fields: [
          { key: "showcase.eyebrow", label: "Eyebrow", type: "text", en: "Film", bn: "চিত্র" },
          { key: "showcase.title", label: "Title", type: "text", en: "A rooftop in Gulshan, at dusk", bn: "গুলশানের এক ছাদ, গোধূলিতে" },
          { key: "showcase.description", label: "Description", type: "textarea", en: "Three minutes on one building — the pool deck, the sky lounge and the view that sells it. Shot by our team, not the developer.", bn: "একটি ভবন নিয়ে তিন মিনিট — পুল ডেক, স্কাই লাউঞ্জ আর যে দৃশ্য দেখে মানুষ রাজি হয়। ডেভেলপার নয়, আমাদের দলের তোলা।" },
          { key: "showcase.play", label: "Play", type: "text", en: "Play the film", bn: "চিত্রটি দেখুন" },
          { key: "showcase.duration", label: "Duration", type: "text", en: "3 min", bn: "৩ মিনিট" },
          { key: "showcase.poster", label: "Poster", type: "image", en: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2400&q=80", bn: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2400&q=80" },
          { key: "showcase.video", label: "Video", type: "url", en: "https://www.youtube.com/watch?v=ScMzIvxBSi4", bn: "https://www.youtube.com/watch?v=ScMzIvxBSi4" },
        ],
      },
      {
        id: "features",
        label: "Features",
        fields: [
          { key: "features.eyebrow", label: "Eyebrow", type: "text", en: "Institutional integrity", bn: "প্রাতিষ্ঠানিক সততা" },
          { key: "features.title", label: "Title", type: "text", en: "The quality and legal safeguard", bn: "মান ও আইনি সুরক্ষা" },
          { key: "features.description", label: "Description", type: "textarea", en: "The vetting that separates us from an unmoderated classifieds portal. None of it is clever — it is the work most portals skip because nobody checks.", bn: "যে যাচাই আমাদের সাধারণ বিজ্ঞাপন পোর্টাল থেকে আলাদা করে। এর কোনোটাই কঠিন কাজ নয় — শুধু বেশিরভাগ পোর্টাল এড়িয়ে যায়, কারণ কেউ দেখতে আসে না।" },
        ],
      },
      {
        id: "gallery",
        label: "Gallery",
        fields: [
          { key: "gallery.eyebrow", label: "Eyebrow", type: "text", en: "Architectural photography", bn: "স্থাপত্য আলোকচিত্র" },
          { key: "gallery.title", label: "Title", type: "text", en: "Our photographs, not CGI renders", bn: "আমাদের তোলা ছবি, কম্পিউটারের নকশা নয়" },
          { key: "gallery.description", label: "Description", type: "textarea", en: "Click any photograph for the full-screen pinch-and-zoom viewer.", bn: "যেকোনো ছবিতে ক্লিক করলে পূর্ণ পর্দায় জুম করে দেখা যাবে।" },
        ],
      },
      {
        id: "faq",
        label: "Faq",
        fields: [
          { key: "faq.eyebrow", label: "Eyebrow", type: "text", en: "FAQ", bn: "সাধারণ প্রশ্ন" },
          { key: "faq.title", label: "Title", type: "text", en: "Legal, financial and handover questions", bn: "আইনি, আর্থিক ও হস্তান্তর সংক্রান্ত প্রশ্ন" },
          { key: "faq.description", label: "Description", type: "textarea", en: "Something specific about deed mutation or consular power of attorney? Call the desk — someone picks up.", bn: "নামজারি বা কনস্যুলার আমমোক্তারনামা নিয়ে নির্দিষ্ট কিছু জানার আছে? ফোন করুন — কেউ না কেউ ধরবেন।" },
        ],
      },
      {
        id: "rooms",
        label: "Rooms",
        fields: [
          { key: "rooms.pill", label: "Pill", type: "text", en: "Room details", bn: "ঘরের বিবরণ" },
          { key: "rooms.title", label: "Title", type: "text", en: "Comfortable rooms", bn: "আরামদায়ক ঘর" },
          { key: "rooms.description", label: "Description", type: "textarea", en: "A walkthrough of a representative three-bedroom home in Gulshan — what each room actually measures, and what comes with it.", bn: "গুলশানের একটি তিন-বেডরুম ফ্ল্যাট ঘুরে দেখা — কোন ঘর আসলে কত বড়, আর সাথে কী কী থাকছে।" },
          { key: "rooms.readMore", label: "Read More", type: "text", en: "Read more", bn: "বিস্তারিত" },
          { key: "rooms.expand", label: "Expand", type: "text", en: "Show details for", bn: "বিস্তারিত দেখুন:" },
        ],
      },
      {
        id: "statsBanner",
        label: "Stats Banner",
        fields: [
          { key: "statsBanner.backgroundImage", label: "Background Image", type: "image", en: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85", bn: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85" },
          { key: "statsBanner.stat1Value", label: "Stat1 Value", type: "text", en: "8", bn: "8" },
          { key: "statsBanner.stat1Suffix", label: "Stat1 Suffix", type: "text", en: "k+", bn: "k+" },
          { key: "statsBanner.stat1Label", label: "Stat1 Label", type: "text", en: "Projects completed", bn: "সম্পূর্ণ প্রজেক্ট" },
          { key: "statsBanner.stat2Value", label: "Stat2 Value", type: "text", en: "3", bn: "3" },
          { key: "statsBanner.stat2Suffix", label: "Stat2 Suffix", type: "text", en: "k+", bn: "k+" },
          { key: "statsBanner.stat2Label", label: "Stat2 Label", type: "text", en: "Global customers", bn: "গ্লোবাল গ্রাহক" },
          { key: "statsBanner.stat3Value", label: "Stat3 Value", type: "text", en: "20", bn: "20" },
          { key: "statsBanner.stat3Suffix", label: "Stat3 Suffix", type: "text", en: "+", bn: "+" },
          { key: "statsBanner.stat3Label", label: "Stat3 Label", type: "text", en: "Years of experience", bn: "বছরের অভিজ্ঞতা" },
          { key: "statsBanner.stat4Value", label: "Stat4 Value", type: "text", en: "95", bn: "95" },
          { key: "statsBanner.stat4Suffix", label: "Stat4 Suffix", type: "text", en: "+", bn: "+" },
          { key: "statsBanner.stat4Label", label: "Stat4 Label", type: "text", en: "Team engineers", bn: "টিম ইঞ্জিনিয়ার" },
        ],
      },
      {
        id: "videoSection",
        label: "Video Section",
        fields: [
          { key: "videoSection.eyebrow", label: "Eyebrow", type: "text", en: "Virtual Property Tours", bn: "ভার্চুয়াল প্রপার্টি ট্যুর" },
          { key: "videoSection.title", label: "Title", type: "text", en: "Experience Luxury Living in Motion", bn: "ভিডিওতে দেখুন আমাদের লাক্সারি প্রপার্টি" },
          { key: "videoSection.description", label: "Description", type: "textarea", en: "Immerse yourself in cinematic walkthroughs, architectural inspections, and exclusive project showcases verified by Zoom Property & Zoom IT.", bn: "জুম প্রপার্টি ও জুম আইটি দ্বারা ভেরিফাইড সিনেমাটিক প্রপার্টি ওয়াকথ্রু, আর্কিটেকচারাল ডিজাইন এবং লাইভ কনস্ট্রাকশন আপডেট দেখুন।" },
          { key: "videoSection.channelBadge", label: "Channel Badge", type: "text", en: "Official Zoom IT Channel", bn: "অফিসিয়াল জুম আইটি চ্যানেল" },
          { key: "videoSection.channelAction", label: "Channel Action", type: "text", en: "YouTube Channel", bn: "ইউটিউব চ্যানেল" },
          { key: "videoSection.play", label: "Play", type: "text", en: "Play Video", bn: "ভিডিও দেখুন" },
          { key: "videoSection.close", label: "Close", type: "text", en: "Close Player", bn: "ভিডিও বন্ধ করুন" },
          { key: "videoSection.verified", label: "Verified", type: "text", en: "Verified Walkthrough", bn: "ভেরিফাইড ওয়াকথ্রু" },
          { key: "videoSection.prev", label: "Prev", type: "text", en: "Previous video", bn: "পূর্ববর্তী ভিডিও" },
          { key: "videoSection.next", label: "Next", type: "text", en: "Next video", bn: "পরবর্তী ভিডিও" },
        ],
      },
      {
        id: "cta",
        label: "Cta",
        fields: [
          { key: "cta.eyebrow", label: "Eyebrow", type: "text", en: "Uncompromising transparency", bn: "সম্পূর্ণ স্বচ্ছতা" },
          { key: "cta.title", label: "Title", type: "text", en: "Ready to see the shortlist?", bn: "বাছাই তালিকা দেখতে প্রস্তুত?" },
          { key: "cta.description", label: "Description", type: "textarea", en: "Send us your criteria. We compile the title deed records, schedule the visits and put every statutory cost on one page before you decide.", bn: "আপনার চাহিদা পাঠান। আমরা দলিলপত্র জোগাড় করব, ভিজিটের সময় ঠিক করব, আর সিদ্ধান্তের আগে সব সরকারি খরচ এক পাতায় দেব।" },
          { key: "cta.contact", label: "Contact", type: "text", en: "Contact the team", bn: "আমাদের সঙ্গে যোগাযোগ" },
        ],
      },
    ],
  },
  {
    id: "properties",
    label: "Properties",
    description: "The listings index and a single listing.",
    sections: [
      {
        id: "listings",
        label: "Banner",
        fields: [
          { key: "listings.backgroundImage", label: "Background Image", type: "image", en: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2000&q=80", bn: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2000&q=80" },
          { key: "listings.eyebrow", label: "Eyebrow", type: "text", en: "Curated portfolio", bn: "বাছাই করা তালিকা" },
          { key: "listings.title", label: "Title", type: "text", en: "Verified residences and commercial floors", bn: "যাচাই করা ফ্ল্যাট ও বাণিজ্যিক ফ্লোর" },
          { key: "listings.description", label: "Description", type: "textarea", en: "Every listing has been physically inspected by our survey team this month, with title deeds verified before it went online.", bn: "প্রতিটি লিস্টিং এ মাসে আমাদের সার্ভে দল সরেজমিনে দেখেছে, আর অনলাইনে ওঠার আগেই দলিল যাচাই করা হয়েছে।" },
        ],
      },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    description: "Section copy for developments. The records themselves live under Listings.",
    sections: [
      {
        id: "projects",
        label: "Banner",
        fields: [
          { key: "projects.backgroundImage", label: "Background Image", type: "image", en: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=80", bn: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=80" },
          { key: "projects.eyebrow", label: "Eyebrow", type: "text", en: "Under construction", bn: "নির্মাণাধীন" },
          { key: "projects.title", label: "Title", type: "text", en: "Milestone progress you can audit", bn: "অগ্রগতি নিজে যাচাই করুন" },
          { key: "projects.description", label: "Description", type: "textarea", en: "You pay in instalments for years before you get keys, so every project shows its audited structural stage and RAJUK permit — not a marketing render.", bn: "চাবি পাওয়ার আগে বছরের পর বছর কিস্তি দিতে হয়। তাই প্রতিটি প্রকল্পে নিরীক্ষিত কাঠামোগত পর্যায় ও রাজউক অনুমোদন দেখানো — বিজ্ঞাপনের ছবি নয়।" },
        ],
      },
    ],
  },
  {
    id: "areas",
    label: "Areas",
    description: "Section copy for neighbourhoods. The records themselves live under Listings.",
    sections: [
      {
        id: "areas",
        label: "Banner",
        fields: [
          { key: "areas.backgroundImage", label: "Background Image", type: "image", en: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=2000&q=80", bn: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=2000&q=80" },
          { key: "areas.eyebrow", label: "Eyebrow", type: "text", en: "Our Service Areas & Locations", bn: "আমাদের সার্ভিস এরিয়া ও লোকেশন" },
          { key: "areas.title", label: "Title", type: "text", en: "Prime Service Areas Where We Sell Luxury Flats & Units", bn: "যেসব প্রাইম এরিয়ায় আমরা ফ্ল্যাট ও ইউনিট বিক্রি করি" },
          { key: "areas.description", label: "Description", type: "textarea", en: "Discover Dhaka & Chattogram's most prestigious neighbourhoods where Zoom Property offers verified luxury apartments, duplexes, and residential units for sale.", bn: "ঢাকা ও চট্টগ্রামের শীর্ষ অভিজাত এলাকাগুলোতে জুম প্রপার্টির ভেরিফাইড লাক্সারি ফ্ল্যাট, ডুপ্লেক্স ও অ্যাপার্টমেন্ট বিক্রয় ও সার্ভিস লোকেশনসমূহ।" },
        ],
      },
    ],
  },
  {
    id: "about",
    label: "About",
    description: "The about page and the explainer blocks it is built from.",
    sections: [
      {
        id: "about",
        label: "About",
        fields: [
          { key: "about.eyebrow", label: "Eyebrow", type: "text", en: "Who we are", bn: "আমরা কারা" },
          { key: "about.title", label: "Title", type: "text", en: "Fewer listings, checked properly", bn: "কম লিস্টিং, ঠিকভাবে যাচাই করা" },
          { key: "about.description", label: "Description", type: "textarea", en: "We publish less than the big portals because a listing does not go live until someone from our team has stood in it and read the paperwork.", bn: "আমরা বড় পোর্টালগুলোর চেয়ে কম প্রকাশ করি, কারণ আমাদের কেউ সরেজমিনে না দেখা ও কাগজ না পড়া পর্যন্ত কোনো লিস্টিং অনলাইনে যায় না।" },
          { key: "about.metaTitle", label: "Meta Title", type: "text", en: "About us", bn: "আমাদের সম্পর্কে" },
          { key: "about.metaDescription", label: "Meta Description", type: "textarea", en: "How Zoom Property vets a listing: physical inspection, RAJUK approval, title deed and mutation checked before anything goes online.", bn: "জুম প্রপার্টি কীভাবে একটি লিস্টিং যাচাই করে: সরেজমিনে পরিদর্শন, রাজউক অনুমোদন, দলিল ও নামজারি — সব অনলাইনে ওঠার আগে।" },
        ],
      },
      {
        id: "pages.buying",
        label: "Pages · Buying",
        fields: [
          { key: "pages.buying.eyebrow", label: "Eyebrow", type: "text", en: "How it works", bn: "কীভাবে হয়" },
          { key: "pages.buying.title", label: "Title", type: "text", en: "Five steps from shortlist to keys", bn: "বাছাই থেকে চাবি — পাঁচ ধাপ" },
          { key: "pages.buying.description", label: "Description", type: "textarea", en: "No stage starts before the previous one is signed off in writing. You always know what happens next and what it costs.", bn: "আগের ধাপ লিখিতভাবে শেষ না হলে পরেরটা শুরু হয় না। পরের ধাপ কী আর খরচ কত, আপনি সবসময় জানেন।" },
        ],
      },
      {
        id: "pages.construction",
        label: "Pages · Construction",
        fields: [
          { key: "pages.construction.eyebrow", label: "Eyebrow", type: "text", en: "How we verify", bn: "যেভাবে যাচাই করি" },
          { key: "pages.construction.title", label: "Title", type: "text", en: "What a completion percentage actually means", bn: "অগ্রগতির শতাংশ আসলে কী বোঝায়" },
          { key: "pages.construction.description", label: "Description", type: "textarea", en: "Every project passes the same five audited stages. The number only moves after our engineer has signed that stage off on site.", bn: "প্রতিটি প্রকল্প একই পাঁচ ধাপ পেরোয়। আমাদের প্রকৌশলী সাইটে গিয়ে ধাপটি অনুমোদন না করা পর্যন্ত সংখ্যা বাড়ে না।" },
        ],
      },
      {
        id: "pages.comparison",
        label: "Pages · Comparison",
        fields: [
          { key: "pages.comparison.eyebrow", label: "Eyebrow", type: "text", en: "Side by side", bn: "পাশাপাশি" },
          { key: "pages.comparison.title", label: "Title", type: "text", en: "Compare every area on one screen", bn: "সব এলাকা এক পর্দায় মিলিয়ে দেখুন" },
          { key: "pages.comparison.description", label: "Description", type: "textarea", en: "The numbers people usually have to phone three agents to assemble.", bn: "যে সংখ্যাগুলো জোগাড় করতে সাধারণত তিনজন এজেন্টকে ফোন করতে হয়।" },
          { key: "pages.comparison.columns.area", label: "Columns · Area", type: "text", en: "Area", bn: "এলাকা" },
          { key: "pages.comparison.columns.listings", label: "Columns · Listings", type: "text", en: "Listings", bn: "লিস্টিং" },
          { key: "pages.comparison.columns.median", label: "Columns · Median", type: "text", en: "Median price", bn: "মধ্যম দাম" },
          { key: "pages.comparison.columns.perSqft", label: "Columns · Per Sqft", type: "text", en: "Per sq ft", bn: "প্রতি বর্গফুট" },
          { key: "pages.comparison.columns.yield", label: "Columns · Yield", type: "text", en: "Rental yield", bn: "ভাড়ার আয়" },
          { key: "pages.comparison.columns.security", label: "Columns · Security", type: "text", en: "Security", bn: "নিরাপত্তা" },
          { key: "pages.comparison.note", label: "Note", type: "textarea", en: "Medians come from listings closed in the last 90 days. Yield is gross, before service charge and tax.", bn: "মধ্যম দাম গত ৯০ দিনে সম্পন্ন লিস্টিং থেকে। ভাড়ার আয় সার্ভিস চার্জ ও কর বাদ দেওয়ার আগের হিসাব।" },
        ],
      },
      {
        id: "pages.match",
        label: "Pages · Match",
        fields: [
          { key: "pages.match.eyebrow", label: "Eyebrow", type: "text", en: "Getting matched", bn: "যেভাবে মেলানো হয়" },
          { key: "pages.match.title", label: "Title", type: "text", en: "You get one advisor, not a queue", bn: "একজন পরামর্শদাতা পাবেন, সারি নয়" },
          { key: "pages.match.description", label: "Description", type: "textarea", en: "Your enquiry goes to the person who works that area, and they stay with you through to handover.", bn: "আপনার বার্তা সেই এলাকার দায়িত্বে থাকা ব্যক্তির কাছে যায়, আর হস্তান্তর পর্যন্ত তিনিই থাকেন।" },
        ],
      },
      {
        id: "pages.vetting",
        label: "Pages · Vetting",
        fields: [
          { key: "pages.vetting.eyebrow", label: "Eyebrow", type: "text", en: "Our standard", bn: "আমাদের মান" },
          { key: "pages.vetting.title", label: "Title", type: "text", en: "What a listing has to pass", bn: "একটি লিস্টিংকে যা যা পেরোতে হয়" },
          { key: "pages.vetting.description", label: "Description", type: "textarea", en: "Seven checks. If one fails, the listing does not go online — which is why you find fewer results here than on the big portals.", bn: "সাতটি যাচাই। একটিও না মিললে লিস্টিং অনলাইনে যায় না — এ কারণেই বড় পোর্টালের চেয়ে এখানে ফলাফল কম পাবেন।" },
        ],
      },
      {
        id: "pages.milestones",
        label: "Pages · Milestones",
        fields: [
          { key: "pages.milestones.eyebrow", label: "Eyebrow", type: "text", en: "Our story", bn: "আমাদের পথচলা" },
          { key: "pages.milestones.title", label: "Title", type: "text", en: "How we got here", bn: "যেভাবে এতদূর" },
        ],
      },
    ],
  },
  {
    id: "services",
    label: "Services",
    description: "The services showcase.",
    sections: [
      {
        id: "services",
        label: "Services",
        fields: [
          { key: "services.eyebrow", label: "Eyebrow", type: "text", en: "In-house units", bn: "নিজস্ব বিভাগ" },
          { key: "services.title", label: "Title", type: "text", en: "The teams behind a sale", bn: "একটি লেনদেনের পেছনে যে দলগুলো" },
          { key: "services.titleLead", label: "Title Lead", type: "textarea", en: "The Teams Behind ", bn: "প্রতিটি লেনদেনের পেছনে " },
          { key: "services.titleAccent", label: "Title Accent", type: "text", en: "Every Sale", bn: "আমাদের নিজস্ব" },
          { key: "services.titleTail", label: "Title Tail", type: "text", en: " We Handle", bn: " দলগুলো" },
          { key: "services.description", label: "Description", type: "textarea", en: "Four units we run ourselves rather than subcontract, because every one of them is a place a purchase usually goes wrong.", bn: "চারটি বিভাগ আমরা নিজেরাই চালাই, বাইরে দিই না — কারণ প্রতিটি জায়গাতেই সাধারণত কেনাবেচা গোলমাল হয়।" },
          { key: "services.cta", label: "Cta", type: "text", en: "Learn more", bn: "বিস্তারিত" },
        ],
      },
    ],
  },
  {
    id: "landowners",
    label: "Landowners",
    description: "The banner at the top of the landowners page.",
    sections: [
      {
        id: "landowner",
        label: "Banner",
        fields: [
          { key: "landowner.backgroundImage", label: "Background Image", type: "image", en: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2000&q=80", bn: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2000&q=80" },
          { key: "landowner.eyebrow", label: "Eyebrow", type: "text", en: "Landowner joint ventures", bn: "জমির মালিকদের যৌথ উদ্যোগ" },
          { key: "landowner.title", label: "Title", type: "text", en: "Put your land into a development", bn: "আপনার জমি উন্নয়নে দিন" },
          { key: "landowner.description", label: "Description", type: "textarea", en: "Guaranteed owner share, bank-secured signing advance, BNBC 2020 seismic compliance and a delivery pledge in the contract.", bn: "নিশ্চিত মালিকানা অংশ, ব্যাংক-নিশ্চিত সাইনিং অগ্রিম, বিএনবিসি ২০২০ ভূমিকম্প মান এবং চুক্তিতে হস্তান্তরের অঙ্গীকার।" },
        ],
      },
    ],
  },
  {
    id: "blog",
    label: "Blog",
    description: "The blog index, an article, and everything around it.",
    sections: [
      {
        id: "blog",
        label: "Banner",
        fields: [
          { key: "blog.backgroundImage", label: "Background Image", type: "image", en: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=2000&q=80", bn: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=2000&q=80" },
          { key: "blog.eyebrow", label: "Eyebrow", type: "text", en: "Market Notes & Intelligence", bn: "বাজার নোট ও বিশ্লেষণ" },
          { key: "blog.title", label: "Title", type: "text", en: "Explore News, Insights and Guides", bn: "রিয়েল এস্টেট সংবাদ, বিশ্লেষণ ও গাইড" },
          { key: "blog.description", label: "Description", type: "textarea", en: "In-depth research on Dhaka real estate, architectural movements, property regulations, and market trends.", bn: "ঢাকার আবাসন বাজার, স্থাপত্যের বিকাশ, আইনি নীতিমালা ও অর্থনৈতিক অগ্রগতি নিয়ে নির্ভরযোগ্য গবেষণা ও বিশ্লেষণ।" },
        ],
      },
    ],
  },
  {
    id: "reviews",
    label: "Reviews",
    description: "The banner at the top of the reviews page.",
    sections: [
      {
        id: "reviews",
        label: "Banner",
        fields: [
          { key: "reviews.backgroundImage", label: "Background Image", type: "image", en: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2000&q=80", bn: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2000&q=80" },
          { key: "reviews.eyebrow", label: "Eyebrow", type: "text", en: "Client testimonials", bn: "ক্রেতাদের মতামত" },
          { key: "reviews.title", label: "Title", type: "text", en: "Real stories from people who bought here", bn: "যাঁরা এখান থেকে কিনেছেন, তাঁদের কথা" },
          { key: "reviews.description", label: "Description", type: "textarea", en: "Every review names the property it came from, so you can check the claim against the listing.", bn: "প্রতিটি মতামতে কোন সম্পত্তি সেটি লেখা আছে, যাতে আপনি লিস্টিংয়ের সঙ্গে মিলিয়ে দেখতে পারেন।" },
        ],
      },
    ],
  },
  {
    id: "agents",
    label: "Agents",
    description: "The agents page.",
    sections: [
      {
        id: "agentsSection",
        label: "Agents Section",
        fields: [
          { key: "agentsSection.eyebrow", label: "Eyebrow", type: "text", en: "Certified advisors", bn: "সনদপ্রাপ্ত পরামর্শদাতা" },
          { key: "agentsSection.title", label: "Title", type: "text", en: "Neighbourhood specialists, not a call centre", bn: "কল সেন্টার নয়, এলাকার বিশেষজ্ঞ" },
          { key: "agentsSection.description", label: "Description", type: "textarea", en: "Each advisor covers a handful of enclaves and nothing else. The reply time on every card is measured, not promised.", bn: "প্রত্যেকে গুটিকয়েক এলাকা দেখেন, তার বেশি নয়। প্রতিটি কার্ডে লেখা উত্তরের সময় মাপা, প্রতিশ্রুতি নয়।" },
          { key: "agentsSection.pageTitle", label: "Page Title", type: "text", en: "Advisors, not a call centre", bn: "কল সেন্টার নয়, পরামর্শদাতা" },
          { key: "agentsSection.pageDescription", label: "Page Description", type: "textarea", en: "Each one covers a handful of enclaves and nothing else. The reply time on every card is measured from real first responses, not promised.", bn: "প্রত্যেকে গুটিকয়েক এলাকা দেখেন, তার বেশি নয়। প্রতিটি কার্ডে লেখা উত্তরের সময় প্রকৃত উত্তর থেকে মাপা, প্রতিশ্রুতি নয়।" },
          { key: "agentsSection.metaTitle", label: "Meta Title", type: "text", en: "Our advisors", bn: "আমাদের পরামর্শদাতা" },
          { key: "agentsSection.metaDescription", label: "Meta Description", type: "textarea", en: "Four neighbourhood specialists covering Gulshan, Banani, Dhanmondi, Uttara, Bashundhara and Chattogram. Measured reply times on every profile.", bn: "গুলশান, বনানী, ধানমন্ডি, উত্তরা, বসুন্ধরা ও চট্টগ্রামের চারজন এলাকা-বিশেষজ্ঞ। প্রতিটি প্রোফাইলে মাপা উত্তরের সময়।" },
        ],
      },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    description: "The contact page and its enquiry form.",
    sections: [
      {
        id: "contact",
        label: "Banner",
        fields: [
          { key: "contact.backgroundImage", label: "Background Image", type: "image", en: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2000&q=80", bn: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2000&q=80" },
          { key: "contact.eyebrow", label: "Eyebrow", type: "text", en: "Get in touch", bn: "যোগাযোগ করুন" },
          { key: "contact.title", label: "Title", type: "text", en: "Talk to an advisor", bn: "একজন পরামর্শদাতার সঙ্গে কথা বলুন" },
          { key: "contact.description", label: "Description", type: "textarea", en: "Tell us the area, the budget and when you need to move. We come back with a shortlist, the papers and every cost on one page.", bn: "এলাকা, বাজেট আর কবে উঠতে চান জানান। আমরা বাছাই তালিকা, কাগজপত্র আর সব খরচ এক পাতায় নিয়ে ফিরে আসব।" },
        ],
      },
    ],
  },
  {
    id: "common",
    label: "Site-wide",
    description: "Navigation, footer, metadata and the 404 page.",
    sections: [
      {
        id: "meta",
        label: "Meta",
        fields: [
          { key: "meta.tagline", label: "Tagline", type: "textarea", en: "Every property vetted before you step inside", bn: "ঘরে পা রাখার আগেই প্রতিটি সম্পত্তি যাচাই করা" },
          { key: "meta.description", label: "Description", type: "textarea", en: "Buy, rent and invest in Dhaka and Chattogram property. Every listing RAJUK-checked, every price the real one, every agent answers in minutes.", bn: "ঢাকা ও চট্টগ্রামে ফ্ল্যাট কিনুন, ভাড়া নিন বা বিনিয়োগ করুন। প্রতিটি লিস্টিং রাজউক-যাচাই করা, দাম যা লেখা তাই, আর পরামর্শদাতারা মিনিটেই উত্তর দেন।" },
        ],
      },
      {
        id: "nav",
        label: "Nav",
        fields: [
          { key: "nav.properties", label: "Properties", type: "text", en: "Properties", bn: "সম্পত্তি" },
          { key: "nav.projects", label: "Projects", type: "text", en: "Projects", bn: "প্রকল্প" },
          { key: "nav.areas", label: "Areas", type: "text", en: "Areas", bn: "এলাকা" },
          { key: "nav.contact", label: "Contact", type: "text", en: "Contact", bn: "যোগাযোগ" },
          { key: "nav.agents", label: "Agents", type: "text", en: "Advisors", bn: "পরামর্শদাতা" },
          { key: "nav.about", label: "About", type: "text", en: "About us", bn: "আমাদের সম্পর্কে" },
          { key: "nav.bookViewing", label: "Book Viewing", type: "text", en: "Book a viewing", bn: "ভিজিট বুক করুন" },
          { key: "nav.openMenu", label: "Open Menu", type: "text", en: "Open menu", bn: "মেনু খুলুন" },
          { key: "nav.language", label: "Language", type: "text", en: "Language", bn: "ভাষা" },
          { key: "nav.landowners", label: "Landowners", type: "text", en: "Landowners", bn: "জমির মালিক" },
          { key: "nav.blog", label: "Blog", type: "text", en: "Blog", bn: "ব্লগ" },
          { key: "nav.reviews", label: "Reviews", type: "text", en: "Reviews", bn: "রিভিউ" },
        ],
      },
      {
        id: "footer",
        label: "Footer",
        fields: [
          { key: "footer.explore", label: "Explore", type: "text", en: "Explore", bn: "ঘুরে দেখুন" },
          { key: "footer.services", label: "Services", type: "text", en: "Services", bn: "সেবা" },
          { key: "footer.rights", label: "Rights", type: "text", en: "Limited · REHAB member", bn: "লিমিটেড · রিহ্যাব সদস্য" },
          { key: "footer.demo", label: "Demo", type: "text", en: "Demo data — not a live listing service.", bn: "ডেমো তথ্য — এটি সক্রিয় লিস্টিং সেবা নয়।" },
        ],
      },
      {
        id: "notFound",
        label: "Not Found",
        fields: [
          { key: "notFound.code", label: "Code", type: "text", en: "404", bn: "৪০৪" },
          { key: "notFound.eyebrow", label: "Eyebrow", type: "text", en: "Page not found", bn: "পেজ পাওয়া যায়নি" },
          { key: "notFound.title", label: "Title", type: "text", en: "This address isn't on our books", bn: "এই ঠিকানাটি আমাদের তালিকায় নেই" },
          { key: "notFound.description", label: "Description", type: "textarea", en: "The page you asked for has moved, been renamed, or never existed. Nothing is lost — pick up the trail below.", bn: "আপনি যে পেজটি চেয়েছেন সেটি সরানো হয়েছে, নাম বদলেছে, অথবা কখনও ছিল না। কিছুই হারায়নি — নিচ থেকে আবার শুরু করুন।" },
          { key: "notFound.attempted", label: "Attempted", type: "text", en: "You asked for", bn: "আপনি চেয়েছিলেন" },
          { key: "notFound.suggestion", label: "Suggestion", type: "text", en: "Did you mean", bn: "আপনি কি খুঁজছেন" },
          { key: "notFound.linksTitle", label: "Links Title", type: "text", en: "Or start from one of these", bn: "অথবা এখান থেকে শুরু করুন" },
          { key: "notFound.back", label: "Back", type: "text", en: "Go back", bn: "পিছনে যান" },
          { key: "notFound.home", label: "Home", type: "text", en: "Back to home", bn: "হোমে ফিরুন" },
        ],
      },
      {
        id: "notFound.links",
        label: "Not Found · Links",
        fields: [
          { key: "notFound.links.properties", label: "Properties", type: "text", en: "Every listing, filtered the way you search.", bn: "সব লিস্টিং, আপনার পছন্দমতো ফিল্টার করে।" },
          { key: "notFound.links.projects", label: "Projects", type: "text", en: "Developments under construction and delivered.", bn: "নির্মাণাধীন ও হস্তান্তরিত প্রকল্পসমূহ।" },
          { key: "notFound.links.areas", label: "Areas", type: "text", en: "Neighbourhood guides with real price ranges.", bn: "এলাকাভিত্তিক গাইড, বাস্তব দামের রেঞ্জসহ।" },
          { key: "notFound.links.landowners", label: "Landowners", type: "text", en: "Joint ventures, with the terms in writing.", bn: "জয়েন্ট ভেঞ্চার, শর্ত লিখিতভাবে।" },
          { key: "notFound.links.blog", label: "Blog", type: "text", en: "Market notes from the people doing the deals.", bn: "যাঁরা কাজটি করছেন, তাঁদের বাজার-পর্যালোচনা।" },
          { key: "notFound.links.contact", label: "Contact", type: "text", en: "Talk to an advisor about what you need.", bn: "আপনার প্রয়োজন নিয়ে একজন উপদেষ্টার সাথে কথা বলুন।" },
        ],
      },
    ],
  },
];

/** Page by its id, for the route to resolve `/cms/:pageId`. */
export const cmsPageById = (id?: string) =>
  cmsPages.find((p) => p.id === id);

/** The storage key for one field in one language. */
export const cmsStorageKey = (key: string, lang: "en" | "bn") =>
  `${key}.${lang}`;
