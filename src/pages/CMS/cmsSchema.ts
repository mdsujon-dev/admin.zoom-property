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

export type CmsFieldType =
  | "text"
  | "textarea"
  | "url"
  /** One uploaded image, stored as its URL. */
  | "image"
  /** A gallery: several images, stored as an array of URLs. */
  | "images";

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
          {
            key: "hero.badge",
            label: "Badge",
            type: "text",
            en: "RAJUK plan & title deed cleared",
            bn: "রাজউক নকশা ও দলিল যাচাই করা",
          },
          {
            key: "hero.title",
            label: "Title",
            type: "text",
            en: "Every property vetted before you step inside",
            bn: "ঘরে পা রাখার আগেই প্রতিটি সম্পত্তি যাচাই করা",
          },
          {
            key: "hero.lead",
            label: "Lead",
            type: "textarea",
            en: "Dhaka and Chattogram property, with the papers checked first. Live construction milestones, verified records and no hidden markup.",
            bn: "ঢাকা ও চট্টগ্রামের সম্পত্তি, কাগজপত্র আগে দেখে নেওয়া। নির্মাণের অগ্রগতি সরাসরি, দলিল যাচাই করা, কোনো লুকানো খরচ নেই।",
          },
        ],
      },
      {
        id: "hero.trust",
        label: "Hero · Trust",
        fields: [
          {
            key: "hero.trust.rajuk",
            label: "Rajuk",
            type: "text",
            en: "RAJUK plan verified",
            bn: "রাজউক নকশা যাচাই করা",
          },
          {
            key: "hero.trust.reply",
            label: "Reply",
            type: "text",
            en: "Advisors reply in ~11 min",
            bn: "উত্তর আসে ~১১ মিনিটে",
          },
          {
            key: "hero.trust.photos",
            label: "Photos",
            type: "text",
            en: "Photos dated this month",
            bn: "এ মাসেই তোলা ছবি",
          },
          {
            key: "hero.trust.fees",
            label: "Fees",
            type: "text",
            en: "Stamp duty itemised",
            bn: "স্ট্যাম্প ডিউটি আলাদা করে লেখা",
          },
        ],
      },
      {
        id: "showcase",
        label: "Showcase",
        fields: [
          {
            key: "showcase.eyebrow",
            label: "Eyebrow",
            type: "text",
            en: "Film",
            bn: "চিত্র",
          },
          {
            key: "showcase.title",
            label: "Title",
            type: "text",
            en: "A rooftop in Gulshan, at dusk",
            bn: "গুলশানের এক ছাদ, গোধূলিতে",
          },
          {
            key: "showcase.description",
            label: "Description",
            type: "textarea",
            en: "Three minutes on one building — the pool deck, the sky lounge and the view that sells it. Shot by our team, not the developer.",
            bn: "একটি ভবন নিয়ে তিন মিনিট — পুল ডেক, স্কাই লাউঞ্জ আর যে দৃশ্য দেখে মানুষ রাজি হয়। ডেভেলপার নয়, আমাদের দলের তোলা।",
          },
          {
            key: "showcase.play",
            label: "Play",
            type: "text",
            en: "Play the film",
            bn: "চিত্রটি দেখুন",
          },
          {
            key: "showcase.duration",
            label: "Duration",
            type: "text",
            en: "3 min",
            bn: "৩ মিনিট",
          },
          {
            key: "showcase.poster",
            label: "Poster",
            type: "image",
            en: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2400&q=80",
            bn: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2400&q=80",
          },
          {
            key: "showcase.video",
            label: "Video",
            type: "url",
            en: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
            bn: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
          },
        ],
      },
      {
        id: "features",
        label: "Features",
        fields: [
          {
            key: "features.eyebrow",
            label: "Eyebrow",
            type: "text",
            en: "Institutional integrity",
            bn: "প্রাতিষ্ঠানিক সততা",
          },
          {
            key: "features.title",
            label: "Title",
            type: "text",
            en: "The quality and legal safeguard",
            bn: "মান ও আইনি সুরক্ষা",
          },
          {
            key: "features.description",
            label: "Description",
            type: "textarea",
            en: "The vetting that separates us from an unmoderated classifieds portal. None of it is clever — it is the work most portals skip because nobody checks.",
            bn: "যে যাচাই আমাদের সাধারণ বিজ্ঞাপন পোর্টাল থেকে আলাদা করে। এর কোনোটাই কঠিন কাজ নয় — শুধু বেশিরভাগ পোর্টাল এড়িয়ে যায়, কারণ কেউ দেখতে আসে না।",
          },
        ],
      },
      {
        id: "gallery",
        label: "Gallery",
        fields: [
          {
            key: "gallery.eyebrow",
            label: "Eyebrow",
            type: "text",
            en: "Architectural photography",
            bn: "স্থাপত্য আলোকচিত্র",
          },
          {
            key: "gallery.title",
            label: "Title",
            type: "text",
            en: "Our photographs, not CGI renders",
            bn: "আমাদের তোলা ছবি, কম্পিউটারের নকশা নয়",
          },
          {
            key: "gallery.description",
            label: "Description",
            type: "textarea",
            en: "Click any photograph for the full-screen pinch-and-zoom viewer.",
            bn: "যেকোনো ছবিতে ক্লিক করলে পূর্ণ পর্দায় জুম করে দেখা যাবে।",
          },
        ],
      },
      {
        id: "faq",
        label: "Faq",
        fields: [
          {
            key: "faq.eyebrow",
            label: "Eyebrow",
            type: "text",
            en: "FAQ",
            bn: "সাধারণ প্রশ্ন",
          },
          {
            key: "faq.title",
            label: "Title",
            type: "text",
            en: "Legal, financial and handover questions",
            bn: "আইনি, আর্থিক ও হস্তান্তর সংক্রান্ত প্রশ্ন",
          },
          {
            key: "faq.description",
            label: "Description",
            type: "textarea",
            en: "Something specific about deed mutation or consular power of attorney? Call the desk — someone picks up.",
            bn: "নামজারি বা কনস্যুলার আমমোক্তারনামা নিয়ে নির্দিষ্ট কিছু জানার আছে? ফোন করুন — কেউ না কেউ ধরবেন।",
          },
        ],
      },
      {
        id: "rooms",
        label: "Rooms",
        fields: [
          {
            key: "rooms.pill",
            label: "Pill",
            type: "text",
            en: "Room details",
            bn: "ঘরের বিবরণ",
          },
          {
            key: "rooms.title",
            label: "Title",
            type: "text",
            en: "Comfortable rooms",
            bn: "আরামদায়ক ঘর",
          },
          {
            key: "rooms.description",
            label: "Description",
            type: "textarea",
            en: "A walkthrough of a representative three-bedroom home in Gulshan — what each room actually measures, and what comes with it.",
            bn: "গুলশানের একটি তিন-বেডরুম ফ্ল্যাট ঘুরে দেখা — কোন ঘর আসলে কত বড়, আর সাথে কী কী থাকছে।",
          },
          {
            key: "rooms.readMore",
            label: "Read More",
            type: "text",
            en: "Read more",
            bn: "বিস্তারিত",
          },
          {
            key: "rooms.expand",
            label: "Expand",
            type: "text",
            en: "Show details for",
            bn: "বিস্তারিত দেখুন:",
          },
        ],
      },
      {
        id: "statsBanner",
        label: "Stats Banner",
        fields: [
          {
            key: "statsBanner.backgroundImage",
            label: "Background Image",
            type: "image",
            en: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85",
            bn: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85",
          },
          {
            key: "statsBanner.stat1Value",
            label: "Stat1 Value",
            type: "text",
            en: "8",
            bn: "8",
          },
          {
            key: "statsBanner.stat1Suffix",
            label: "Stat1 Suffix",
            type: "text",
            en: "k+",
            bn: "k+",
          },
          {
            key: "statsBanner.stat1Label",
            label: "Stat1 Label",
            type: "text",
            en: "Projects completed",
            bn: "সম্পূর্ণ প্রজেক্ট",
          },
          {
            key: "statsBanner.stat2Value",
            label: "Stat2 Value",
            type: "text",
            en: "3",
            bn: "3",
          },
          {
            key: "statsBanner.stat2Suffix",
            label: "Stat2 Suffix",
            type: "text",
            en: "k+",
            bn: "k+",
          },
          {
            key: "statsBanner.stat2Label",
            label: "Stat2 Label",
            type: "text",
            en: "Global customers",
            bn: "গ্লোবাল গ্রাহক",
          },
          {
            key: "statsBanner.stat3Value",
            label: "Stat3 Value",
            type: "text",
            en: "20",
            bn: "20",
          },
          {
            key: "statsBanner.stat3Suffix",
            label: "Stat3 Suffix",
            type: "text",
            en: "+",
            bn: "+",
          },
          {
            key: "statsBanner.stat3Label",
            label: "Stat3 Label",
            type: "text",
            en: "Years of experience",
            bn: "বছরের অভিজ্ঞতা",
          },
          {
            key: "statsBanner.stat4Value",
            label: "Stat4 Value",
            type: "text",
            en: "95",
            bn: "95",
          },
          {
            key: "statsBanner.stat4Suffix",
            label: "Stat4 Suffix",
            type: "text",
            en: "+",
            bn: "+",
          },
          {
            key: "statsBanner.stat4Label",
            label: "Stat4 Label",
            type: "text",
            en: "Team engineers",
            bn: "টিম ইঞ্জিনিয়ার",
          },
        ],
      },
      {
        id: "videoSection",
        label: "Video Section",
        fields: [
          {
            key: "videoSection.eyebrow",
            label: "Eyebrow",
            type: "text",
            en: "Virtual Property Tours",
            bn: "ভার্চুয়াল প্রপার্টি ট্যুর",
          },
          {
            key: "videoSection.title",
            label: "Title",
            type: "text",
            en: "Experience Luxury Living in Motion",
            bn: "ভিডিওতে দেখুন আমাদের লাক্সারি প্রপার্টি",
          },
          {
            key: "videoSection.description",
            label: "Description",
            type: "textarea",
            en: "Immerse yourself in cinematic walkthroughs, architectural inspections, and exclusive project showcases verified by Zoom Property & Zoom IT.",
            bn: "জুম প্রপার্টি ও জুম আইটি দ্বারা ভেরিফাইড সিনেমাটিক প্রপার্টি ওয়াকথ্রু, আর্কিটেকচারাল ডিজাইন এবং লাইভ কনস্ট্রাকশন আপডেট দেখুন।",
          },
          {
            key: "videoSection.channelBadge",
            label: "Channel Badge",
            type: "text",
            en: "Official Zoom IT Channel",
            bn: "অফিসিয়াল জুম আইটি চ্যানেল",
          },
          {
            key: "videoSection.channelAction",
            label: "Channel Action",
            type: "text",
            en: "YouTube Channel",
            bn: "ইউটিউব চ্যানেল",
          },
          {
            key: "videoSection.play",
            label: "Play",
            type: "text",
            en: "Play Video",
            bn: "ভিডিও দেখুন",
          },
          {
            key: "videoSection.close",
            label: "Close",
            type: "text",
            en: "Close Player",
            bn: "ভিডিও বন্ধ করুন",
          },
          {
            key: "videoSection.verified",
            label: "Verified",
            type: "text",
            en: "Verified Walkthrough",
            bn: "ভেরিফাইড ওয়াকথ্রু",
          },
          {
            key: "videoSection.prev",
            label: "Prev",
            type: "text",
            en: "Previous video",
            bn: "পূর্ববর্তী ভিডিও",
          },
          {
            key: "videoSection.next",
            label: "Next",
            type: "text",
            en: "Next video",
            bn: "পরবর্তী ভিডিও",
          },
        ],
      },
      {
        id: "cta",
        label: "Cta",
        fields: [
          {
            key: "cta.eyebrow",
            label: "Eyebrow",
            type: "text",
            en: "Uncompromising transparency",
            bn: "সম্পূর্ণ স্বচ্ছতা",
          },
          {
            key: "cta.title",
            label: "Title",
            type: "text",
            en: "Ready to see the shortlist?",
            bn: "বাছাই তালিকা দেখতে প্রস্তুত?",
          },
          {
            key: "cta.description",
            label: "Description",
            type: "textarea",
            en: "Send us your criteria. We compile the title deed records, schedule the visits and put every statutory cost on one page before you decide.",
            bn: "আপনার চাহিদা পাঠান। আমরা দলিলপত্র জোগাড় করব, ভিজিটের সময় ঠিক করব, আর সিদ্ধান্তের আগে সব সরকারি খরচ এক পাতায় দেব।",
          },
          {
            key: "cta.contact",
            label: "Contact",
            type: "text",
            en: "Contact the team",
            bn: "আমাদের সঙ্গে যোগাযোগ",
          },
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
          {
            key: "listings.backgroundImage",
            label: "Background Image",
            type: "image",
            en: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2000&q=80",
            bn: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2000&q=80",
          },
          {
            key: "listings.eyebrow",
            label: "Eyebrow",
            type: "text",
            en: "Curated portfolio",
            bn: "বাছাই করা তালিকা",
          },
          {
            key: "listings.title",
            label: "Title",
            type: "text",
            en: "Verified residences and commercial floors",
            bn: "যাচাই করা ফ্ল্যাট ও বাণিজ্যিক ফ্লোর",
          },
          {
            key: "listings.description",
            label: "Description",
            type: "textarea",
            en: "Every listing has been physically inspected by our survey team this month, with title deeds verified before it went online.",
            bn: "প্রতিটি লিস্টিং এ মাসে আমাদের সার্ভে দল সরেজমিনে দেখেছে, আর অনলাইনে ওঠার আগেই দলিল যাচাই করা হয়েছে।",
          },
        ],
      },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    description:
      "Section copy for developments. The records themselves live under Listings.",
    sections: [
      {
        id: "projects",
        label: "Banner",
        fields: [
          {
            key: "projects.backgroundImage",
            label: "Background Image",
            type: "image",
            en: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=80",
            bn: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=80",
          },
          {
            key: "projects.eyebrow",
            label: "Eyebrow",
            type: "text",
            en: "Under construction",
            bn: "নির্মাণাধীন",
          },
          {
            key: "projects.title",
            label: "Title",
            type: "text",
            en: "Milestone progress you can audit",
            bn: "অগ্রগতি নিজে যাচাই করুন",
          },
          {
            key: "projects.description",
            label: "Description",
            type: "textarea",
            en: "You pay in instalments for years before you get keys, so every project shows its audited structural stage and RAJUK permit — not a marketing render.",
            bn: "চাবি পাওয়ার আগে বছরের পর বছর কিস্তি দিতে হয়। তাই প্রতিটি প্রকল্পে নিরীক্ষিত কাঠামোগত পর্যায় ও রাজউক অনুমোদন দেখানো — বিজ্ঞাপনের ছবি নয়।",
          },
        ],
      },
    ],
  },
  {
    id: "areas",
    label: "Areas",
    description:
      "Section copy for neighbourhoods. The records themselves live under Listings.",
    sections: [
      {
        id: "areas",
        label: "Banner",
        fields: [
          {
            key: "areas.backgroundImage",
            label: "Background Image",
            type: "image",
            en: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=2000&q=80",
            bn: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=2000&q=80",
          },
          {
            key: "areas.eyebrow",
            label: "Eyebrow",
            type: "text",
            en: "Our Service Areas & Locations",
            bn: "আমাদের সার্ভিস এরিয়া ও লোকেশন",
          },
          {
            key: "areas.title",
            label: "Title",
            type: "text",
            en: "Prime Service Areas Where We Sell Luxury Flats & Units",
            bn: "যেসব প্রাইম এরিয়ায় আমরা ফ্ল্যাট ও ইউনিট বিক্রি করি",
          },
          {
            key: "areas.description",
            label: "Description",
            type: "textarea",
            en: "Discover Dhaka & Chattogram's most prestigious neighbourhoods where Zoom Property offers verified luxury apartments, duplexes, and residential units for sale.",
            bn: "ঢাকা ও চট্টগ্রামের শীর্ষ অভিজাত এলাকাগুলোতে জুম প্রপার্টির ভেরিফাইড লাক্সারি ফ্ল্যাট, ডুপ্লেক্স ও অ্যাপার্টমেন্ট বিক্রয় ও সার্ভিস লোকেশনসমূহ।",
          },
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
        label: "Banner",
        fields: [
          {
            key: "about.backgroundImage",
            label: "Background Image",
            type: "image",
            en: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2000&q=80",
            bn: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2000&q=80",
          },
          {
            key: "about.eyebrow",
            label: "Eyebrow",
            type: "text",
            en: "Who we are",
            bn: "আমরা কারা",
          },
          {
            key: "about.title",
            label: "Title",
            type: "text",
            en: "Fewer listings, checked properly",
            bn: "কম লিস্টিং, ঠিকভাবে যাচাই করা",
          },
          {
            key: "about.description",
            label: "Description",
            type: "textarea",
            en: "We publish less than the big portals because a listing does not go live until someone from our team has stood in it and read the paperwork.",
            bn: "আমরা বড় পোর্টালগুলোর চেয়ে কম প্রকাশ করি, কারণ আমাদের কেউ সরেজমিনে না দেখা ও কাগজ না পড়া পর্যন্ত কোনো লিস্টিং অনলাইনে যায় না।",
          },
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
          {
            key: "landowner.backgroundImage",
            label: "Background Image",
            type: "image",
            en: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2000&q=80",
            bn: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2000&q=80",
          },
          {
            key: "landowner.eyebrow",
            label: "Eyebrow",
            type: "text",
            en: "Landowner joint ventures",
            bn: "জমির মালিকদের যৌথ উদ্যোগ",
          },
          {
            key: "landowner.title",
            label: "Title",
            type: "text",
            en: "Put your land into a development",
            bn: "আপনার জমি উন্নয়নে দিন",
          },
          {
            key: "landowner.description",
            label: "Description",
            type: "textarea",
            en: "Guaranteed owner share, bank-secured signing advance, BNBC 2020 seismic compliance and a delivery pledge in the contract.",
            bn: "নিশ্চিত মালিকানা অংশ, ব্যাংক-নিশ্চিত সাইনিং অগ্রিম, বিএনবিসি ২০২০ ভূমিকম্প মান এবং চুক্তিতে হস্তান্তরের অঙ্গীকার।",
          },
        ],
      },
      {
        id: "benefits",
        label: "Benefits",
        fields: [
          {
            key: "landowners.benefitsTitle",
            label: "Title",
            type: "text",
            en: "What the agreement gives you",
            bn: "চুক্তি থেকে যা পাবেন",
          },
        ],
        repeatable: {
          itemPrefix: "landowners.benefitsList",
          itemName: "Benefit",
          addButtonText: "Add benefit",
          initialCount: 4,
          itemFields: [
            { suffix: "icon", label: "Icon", type: "text" },
            { suffix: "title", label: "Title", type: "text" },
            { suffix: "body", label: "Body", type: "textarea" },
          ],
          defaultItems: [
            {
              iconEn: "check",
              titleEn: "Highest Market Ratio",
              bodyEn:
                "Up to 50% - 55% landowner share with upfront signing security deposit guaranteed via bank escrow.",
              titleBn: "সর্বোচ্চ বাজার হার",
              bodyBn:
                "ব্যাংক এসক্রোর মাধ্যমে সাইনিং মানি নিশ্চিত করে ৫০% - ৫৫% মালিকানা শেয়ার।",
            },
            {
              iconEn: "approved",
              titleEn: "BNBC 2020 Seismic Code",
              bodyEn:
                "Built to withstand Zone 2/3 earthquakes with pile-depth ultrasonic testing and BUET-vetted structural design.",
              titleBn: "বিএনবিসি ২০২০ সিসমিক কোড",
              bodyBn:
                "জোন ২/৩ ভূমিকম্প সহনশীল করে তৈরি, পাইল-ডেপথ আল্ট্রাসনিক টেস্টিং এবং বুয়েট-যাচাইকৃত স্ট্রাকচারাল ডিজাইন।",
            },
            {
              iconEn: "clock",
              titleEn: "Strict Handover Guarantee",
              bodyEn:
                "36-month construction pledge with penalty compensation per day of any unexpected developer delay.",
              titleBn: "কঠোর হস্তান্তর নিশ্চয়তা",
              bodyBn:
                "৩৬ মাসের নির্মাণ অঙ্গীকার, কোনো অনাকাঙ্ক্ষিত ডেভেলপার বিলম্বের জন্য প্রতিদিনের জরিমানা ক্ষতিপূরণ।",
            },
            {
              iconEn: "building",
              titleEn: "RAJUK Approval By Us",
              bodyEn:
                "Full regulatory clearance handling — Special Project clearance, Fire safety, and WASA/DESCO approvals.",
              titleBn: "আমাদের মাধ্যমে রাজউক অনুমোদন",
              bodyBn:
                "সম্পূর্ণ আইনি ছাড়পত্র গ্রহণ — বিশেষ প্রজেক্ট ছাড়পত্র, ফায়ার সেফটি এবং ওয়াসা/ডেসকো অনুমোদন।",
            },
          ],
        },
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
          {
            key: "blog.backgroundImage",
            label: "Background Image",
            type: "image",
            en: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=2000&q=80",
            bn: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=2000&q=80",
          },
          {
            key: "blog.eyebrow",
            label: "Eyebrow",
            type: "text",
            en: "Market Notes & Intelligence",
            bn: "বাজার নোট ও বিশ্লেষণ",
          },
          {
            key: "blog.title",
            label: "Title",
            type: "text",
            en: "Explore News, Insights and Guides",
            bn: "রিয়েল এস্টেট সংবাদ, বিশ্লেষণ ও গাইড",
          },
          {
            key: "blog.description",
            label: "Description",
            type: "textarea",
            en: "In-depth research on Dhaka real estate, architectural movements, property regulations, and market trends.",
            bn: "ঢাকার আবাসন বাজার, স্থাপত্যের বিকাশ, আইনি নীতিমালা ও অর্থনৈতিক অগ্রগতি নিয়ে নির্ভরযোগ্য গবেষণা ও বিশ্লেষণ।",
          },
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
          {
            key: "reviews.backgroundImage",
            label: "Background Image",
            type: "image",
            en: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2000&q=80",
            bn: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2000&q=80",
          },
          {
            key: "reviews.eyebrow",
            label: "Eyebrow",
            type: "text",
            en: "Client testimonials",
            bn: "ক্রেতাদের মতামত",
          },
          {
            key: "reviews.title",
            label: "Title",
            type: "text",
            en: "Real stories from people who bought here",
            bn: "যাঁরা এখান থেকে কিনেছেন, তাঁদের কথা",
          },
          {
            key: "reviews.description",
            label: "Description",
            type: "textarea",
            en: "Every review names the property it came from, so you can check the claim against the listing.",
            bn: "প্রতিটি মতামতে কোন সম্পত্তি সেটি লেখা আছে, যাতে আপনি লিস্টিংয়ের সঙ্গে মিলিয়ে দেখতে পারেন।",
          },
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
          {
            key: "agentsSection.eyebrow",
            label: "Eyebrow",
            type: "text",
            en: "Certified advisors",
            bn: "সনদপ্রাপ্ত পরামর্শদাতা",
          },
          {
            key: "agentsSection.title",
            label: "Title",
            type: "text",
            en: "Neighbourhood specialists, not a call centre",
            bn: "কল সেন্টার নয়, এলাকার বিশেষজ্ঞ",
          },
          {
            key: "agentsSection.description",
            label: "Description",
            type: "textarea",
            en: "Each advisor covers a handful of enclaves and nothing else. The reply time on every card is measured, not promised.",
            bn: "প্রত্যেকে গুটিকয়েক এলাকা দেখেন, তার বেশি নয়। প্রতিটি কার্ডে লেখা উত্তরের সময় মাপা, প্রতিশ্রুতি নয়।",
          },
          {
            key: "agentsSection.pageTitle",
            label: "Page Title",
            type: "text",
            en: "Advisors, not a call centre",
            bn: "কল সেন্টার নয়, পরামর্শদাতা",
          },
          {
            key: "agentsSection.pageDescription",
            label: "Page Description",
            type: "textarea",
            en: "Each one covers a handful of enclaves and nothing else. The reply time on every card is measured from real first responses, not promised.",
            bn: "প্রত্যেকে গুটিকয়েক এলাকা দেখেন, তার বেশি নয়। প্রতিটি কার্ডে লেখা উত্তরের সময় প্রকৃত উত্তর থেকে মাপা, প্রতিশ্রুতি নয়।",
          },
          {
            key: "agentsSection.metaTitle",
            label: "Meta Title",
            type: "text",
            en: "Our advisors",
            bn: "আমাদের পরামর্শদাতা",
          },
          {
            key: "agentsSection.metaDescription",
            label: "Meta Description",
            type: "textarea",
            en: "Four neighbourhood specialists covering Gulshan, Banani, Dhanmondi, Uttara, Bashundhara and Chattogram. Measured reply times on every profile.",
            bn: "গুলশান, বনানী, ধানমন্ডি, উত্তরা, বসুন্ধরা ও চট্টগ্রামের চারজন এলাকা-বিশেষজ্ঞ। প্রতিটি প্রোফাইলে মাপা উত্তরের সময়।",
          },
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
          {
            key: "contact.backgroundImage",
            label: "Background Image",
            type: "image",
            en: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2000&q=80",
            bn: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2000&q=80",
          },
          {
            key: "contact.eyebrow",
            label: "Eyebrow",
            type: "text",
            en: "Get in touch",
            bn: "যোগাযোগ করুন",
          },
          {
            key: "contact.title",
            label: "Title",
            type: "text",
            en: "Talk to an advisor",
            bn: "একজন পরামর্শদাতার সঙ্গে কথা বলুন",
          },
          {
            key: "contact.description",
            label: "Description",
            type: "textarea",
            en: "Tell us the area, the budget and when you need to move. We come back with a shortlist, the papers and every cost on one page.",
            bn: "এলাকা, বাজেট আর কবে উঠতে চান জানান। আমরা বাছাই তালিকা, কাগজপত্র আর সব খরচ এক পাতায় নিয়ে ফিরে আসব।",
          },
        ],
      },
    ],
  },
];

/** Page by its id, for the route to resolve `/cms/:pageId`. */
export const cmsPageById = (id?: string) => cmsPages.find((p) => p.id === id);

/** The storage key for one field in one language. */
export const cmsStorageKey = (key: string, lang: "en" | "bn") =>
  `${key}.${lang}`;
