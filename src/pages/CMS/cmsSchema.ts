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

export interface CmsRepeatableItemField {
  suffix: string;
  label: string;
  type: CmsFieldType;
  defaultEn?: string;
  defaultBn?: string;
}

export interface CmsRepeatableDefaultItem {
  titleEn?: string;
  titleBn?: string;
  bodyEn?: string;
  bodyBn?: string;
  [key: string]: string | undefined;
}

export interface CmsRepeatableConfig {
  itemPrefix: string;
  itemName: string;
  addButtonText: string;
  initialCount?: number;
  itemFields: CmsRepeatableItemField[];
  defaultItems?: CmsRepeatableDefaultItem[];
}

export interface CmsSection {
  id: string;
  label: string;
  fields: CmsField[];
  repeatable?: CmsRepeatableConfig;
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
    description: "The listings index banner and header settings.",
    sections: [
      {
        id: "listings",
        label: "Banner (প্রপার্টি ব্যানার ও হেডার)",
        fields: [
          {
            key: "listings.backgroundImage",
            label: "Background Image (ব্যানার ব্যাকগ্রাউন্ড ছবি)",
            type: "image",
            hint: "Recommended: 1920 × 600 px (Panoramic Landscape) · High quality JPG / WebP (Max 2MB)",
            en: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2000&q=80",
            bn: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2000&q=80",
          },
          { key: "listings.eyebrow", label: "Eyebrow (টপ ট্যাগ)", type: "text", en: "Curated portfolio", bn: "বাছাই করা তালিকা" },
          { key: "listings.pageTitle", label: "Page Title (মূল শিরোনাম)", type: "text", en: "Properties for sale and rent", bn: "বিক্রয় ও ভাড়ার সম্পত্তি" },
          { key: "listings.pageDescription", label: "Page Description (বিবরণ)", type: "textarea", en: "{count} listings, each physically inspected by our survey team and title-checked before upload. Filter by purpose, type and area below.", bn: "{count}টি লিস্টিং, প্রতিটি আমাদের সার্ভে দল সরেজমিনে দেখেছে এবং আপলোডের আগে দলিল যাচাই করেছে। নিচে উদ্দেশ্য, ধরন ও এলাকা দিয়ে ছেঁকে নিন।" },
        ],
      },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    description: "Projects page banner, header, and construction stages process settings.",
    sections: [
      {
        id: "banner",
        label: "Banner (প্রজেক্ট ব্যানার ও হেডার)",
        fields: [
          {
            key: "projects.backgroundImage",
            label: "Background Image (ব্যানার ব্যাকগ্রাউন্ড ছবি)",
            type: "image",
            hint: "Recommended: 1920 × 600 px (Panoramic Landscape) · High quality JPG / WebP (Max 2MB)",
            en: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=80",
            bn: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=80",
          },
          { key: "projects.eyebrow", label: "Eyebrow (টপ ট্যাগ)", type: "text", en: "Under construction", bn: "নির্মাণাধীন" },
          { key: "projects.pageTitle", label: "Page Title (মূল শিরোনাম)", type: "text", en: "Projects under construction", bn: "নির্মাণাধীন প্রকল্প" },
          { key: "projects.pageDescription", label: "Page Description (বিবরণ)", type: "textarea", en: "You pay in instalments for years before you get keys. Every project here shows its audited structural stage and permit number, updated monthly.", bn: "চাবি পাওয়ার আগে বছরের পর বছর কিস্তি দিতে হয়। এখানে প্রতিটি প্রকল্পে নিরীক্ষিত কাঠামোগত পর্যায় ও অনুমোদন নম্বর আছে, প্রতি মাসে হালনাগাদ।" },
        ],
      },
      {
        id: "process",
        label: "Process (নির্মাণ ও যাচাই প্রক্রিয়া)",
        fields: [
          { key: "pages.construction.eyebrow", label: "Eyebrow (টপ ট্যাগ)", type: "text", en: "How we verify", bn: "যেভাবে যাচাই করি" },
          { key: "pages.construction.title", label: "Title (মূল শিরোনাম)", type: "text", en: "What a completion percentage actually means", bn: "অগ্রগতির শতাংশ আসলে কী বোঝায়" },
          { key: "pages.construction.description", label: "Description (বিবরণ)", type: "textarea", en: "Every project passes the same five audited stages. The number only moves after our engineer has signed that stage off on site.", bn: "প্রতিটি প্রকল্প একই পাঁচ ধাপ পেরোয়। আমাদের প্রকৌশলী সাইটে গিয়ে ধাপটি অনুমোদন না করা পর্যন্ত সংখ্যা বাড়ে না।" },
        ],
        repeatable: {
          itemPrefix: "pages.construction.stages",
          itemName: "Process Stage",
          addButtonText: "+ Add Process (নতুন প্রসেস ধাপ যোগ করুন)",
          initialCount: 5,
          itemFields: [
            { suffix: "title", label: "Stage Title (ধাপ শিরোনাম)", type: "text" },
            { suffix: "body", label: "Stage Details (ধাপের বিবরণ)", type: "textarea" },
          ],
          defaultItems: [
            {
              titleEn: "Piling",
              titleBn: "পাইলিং",
              bodyEn: "Soil test, pile load test, and the RAJUK permit posted on the boundary wall.",
              bodyBn: "মাটি পরীক্ষা, পাইল লোড টেস্ট আর সীমানায় টাঙানো রাজউক অনুমোদন।",
            },
            {
              titleEn: "Structure",
              titleBn: "কাঠামো",
              bodyEn: "Column and slab casting, with cube tests filed for every pour.",
              bodyBn: "কলাম ও ছাদ ঢালাই, প্রতিটি ঢালাইয়ের কিউব টেস্ট নথিভুক্ত।",
            },
            {
              titleEn: "MEP",
              titleBn: "এমইপি",
              bodyEn: "Electrical, plumbing and lift shafts, checked before plaster closes the walls.",
              bodyBn: "প্লাস্টার দেয়াল ঢাকার আগে বিদ্যুৎ, পানি ও লিফট শ্যাফট।",
            },
            {
              titleEn: "Finishing",
              titleBn: "ফিনিশিং",
              bodyEn: "Flooring, joinery, sanitary and paint. The stage where timelines usually slip.",
              bodyBn: "মেঝে, কাঠের কাজ, স্যানিটারি ও রং। এই ধাপেই সাধারণত সময় পিছিয়ে যায়।",
            },
            {
              titleEn: "Handover",
              titleBn: "হস্তান্তর",
              bodyEn: "Occupancy certificate, utility connections, snag list cleared with you present.",
              bodyBn: "অকুপেন্সি সনদ, ইউটিলিটি সংযোগ, আপনার সামনে ত্রুটির তালিকা মিলিয়ে নেওয়া।",
            },
          ],
        },
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
        label: "Areas",
        fields: [
          { key: "areas.eyebrow", label: "Eyebrow", type: "text", en: "Our Service Areas & Locations", bn: "আমাদের সার্ভিস এরিয়া ও লোকেশন" },
          { key: "areas.title", label: "Title", type: "text", en: "Prime Service Areas Where We Sell Luxury Flats & Units", bn: "যেসব প্রাইম এরিয়ায় আমরা ফ্ল্যাট ও ইউনিট বিক্রি করি" },
          { key: "areas.description", label: "Description", type: "textarea", en: "Discover Dhaka & Chattogram's most prestigious neighbourhoods where Zoom Property offers verified luxury apartments, duplexes, and residential units for sale.", bn: "ঢাকা ও চট্টগ্রামের শীর্ষ অভিজাত এলাকাগুলোতে জুম প্রপার্টির ভেরিফাইড লাক্সারি ফ্ল্যাট, ডুপ্লেক্স ও অ্যাপার্টমেন্ট বিক্রয় ও সার্ভিস লোকেশনসমূহ।" },
          { key: "areas.badge", label: "Badge", type: "text", en: "Service Area", bn: "সার্ভিস এরিয়া" },
          { key: "areas.unitsAvailable", label: "Units Available", type: "text", en: "Flats & Units For Sale", bn: "টি ফ্ল্যাট ও ইউনিট রয়েছে" },
          { key: "areas.viewServiceAreas", label: "View Service Areas", type: "text", en: "Explore All Service Areas", bn: "সবগুলো সার্ভিস এরিয়া দেখুন" },
          { key: "areas.pageTitle", label: "Page Title", type: "text", en: "Service Areas for Luxury Flats", bn: "আমাদের সার্ভিস এরিয়া ও এলাকাসমূহ" },
          { key: "areas.pageDescription", label: "Page Description", type: "textarea", en: "Browse verified luxury apartments, duplexes, and commercial floors across Dhaka & Chattogram's most requested addresses.", bn: "জুম প্রপার্টি যেসব প্রাইম এলাকায় ফ্ল্যাট ও অ্যাপার্টমেন্ট সেল করে তার বিস্তারিত তালিকা, ফ্ল্যাটের সংখ্যা, প্রতি বর্গফুটের রেট ও সম্ভাব্য ভাড়ার আয়ের হিসাব।" },
          { key: "areas.metaTitle", label: "Meta Title", type: "text", en: "Service Areas in Dhaka & Chattogram | Zoom Property", bn: "সার্ভিস এরিয়া ও লোকেশন | জুম প্রপার্টি" },
          { key: "areas.metaDescription", label: "Meta Description", type: "textarea", en: "Explore prime service locations in Gulshan, Banani, Baridhara, Dhanmondi, Bashundhara, Uttara and Khulshi where Zoom Property sells luxury flats.", bn: "গুলশান, বনানী, বারিধারা, ধানমন্ডি, বসুন্ধরা ও খুলশীতে আমাদের ভেরিফাইড ফ্ল্যাট ও অ্যাপার্টমেন্ট বিক্রয়ের তালিকা।" },
        ],
      },
      {
        id: "areas.service",
        label: "Areas · Service",
        fields: [
          { key: "areas.service.eyebrow", label: "Eyebrow", type: "text", en: "Our Service Areas", bn: "আমাদের সেবা এলাকা" },
          { key: "areas.service.titleLead", label: "Title Lead", type: "textarea", en: "We Serve Across ", bn: "আমরা আছি " },
          { key: "areas.service.titleAccent", label: "Title Accent", type: "text", en: "Dhaka & Nearby Areas", bn: "ঢাকা ও আশপাশের এলাকাজুড়ে" },
          { key: "areas.service.titleTail", label: "Title Tail", type: "text", en: "", bn: "" },
          { key: "areas.service.description", label: "Description", type: "textarea", en: "From the heart of Dhaka to the surrounding towns, there is an advisor who already knows your street, your building and what it last sold for.", bn: "ঢাকার কেন্দ্র থেকে আশপাশের শহর পর্যন্ত — এমন একজন পরামর্শক আছেন যিনি আপনার রাস্তা, আপনার ভবন এবং সর্বশেষ কত দামে বিক্রি হয়েছে তা জানেন।" },
          { key: "areas.service.inArea", label: "In Area", type: "text", en: "in {name}", bn: "{name} এলাকায়" },
          { key: "areas.service.viewAll", label: "View All", type: "text", en: "Explore all service areas", bn: "সব সেবা এলাকা দেখুন" },
          { key: "areas.service.showing", label: "Showing", type: "text", en: "Showing {from}-{to} of {total} areas", bn: "{total}টির মধ্যে {from}-{to} নম্বর দেখানো হচ্ছে" },
          { key: "areas.service.prev", label: "Prev", type: "text", en: "Previous", bn: "আগের" },
          { key: "areas.service.next", label: "Next", type: "text", en: "Next", bn: "পরের" },
          { key: "areas.service.page", label: "Page", type: "text", en: "Page {page}", bn: "পৃষ্ঠা {page}" },
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
    description: "The landowner proposition and its case study.",
    sections: [
      {
        id: "landowner",
        label: "Landowner",
        fields: [
          { key: "landowner.eyebrow", label: "Eyebrow", type: "text", en: "Landowner joint ventures", bn: "জমির মালিকদের যৌথ উদ্যোগ" },
          { key: "landowner.title", label: "Title", type: "text", en: "Put your land into a development", bn: "আপনার জমি উন্নয়নে দিন" },
          { key: "landowner.description", label: "Description", type: "textarea", en: "Guaranteed owner share, bank-secured signing advance, BNBC 2020 seismic compliance and a delivery pledge in the contract.", bn: "নিশ্চিত মালিকানা অংশ, ব্যাংক-নিশ্চিত সাইনিং অগ্রিম, বিএনবিসি ২০২০ ভূমিকম্প মান এবং চুক্তিতে হস্তান্তরের অঙ্গীকার।" },
        ],
      },
      {
        id: "landowners",
        label: "Landowners",
        fields: [
          { key: "landowners.eyebrow", label: "Eyebrow", type: "text", en: "Landowners", bn: "জমির মালিক" },
          { key: "landowners.title", label: "Title", type: "text", en: "Put your land into a development", bn: "আপনার জমি উন্নয়নে দিন" },
          { key: "landowners.description", label: "Description", type: "textarea", en: "You keep the land in your name until the deed is signed, the owner share is fixed in writing, and the delivery date is a contract term rather than a promise.", bn: "দলিল সই না হওয়া পর্যন্ত জমি আপনার নামেই থাকে, মালিকের অংশ লিখিতভাবে নির্ধারিত, আর হস্তান্তরের তারিখ প্রতিশ্রুতি নয় — চুক্তির শর্ত।" },
          { key: "landowners.metaTitle", label: "Meta Title", type: "text", en: "Landowner joint ventures", bn: "জমির মালিকদের যৌথ উদ্যোগ" },
          { key: "landowners.metaDescription", label: "Meta Description", type: "textarea", en: "Joint-venture development for landowners in Dhaka and Chattogram. Fixed owner share, bank-secured signing advance, BNBC 2020 seismic compliance and a contractual delivery date.", bn: "ঢাকা ও চট্টগ্রামে জমির মালিকদের জন্য যৌথ উদ্যোগে নির্মাণ। নির্ধারিত মালিকানা অংশ, ব্যাংক-নিশ্চিত সাইনিং অগ্রিম, বিএনবিসি ২০২০ ভূমিকম্প মান ও চুক্তিবদ্ধ হস্তান্তরের তারিখ।" },
          { key: "landowners.benefitsTitle", label: "Benefits Title", type: "text", en: "What the agreement gives you", bn: "চুক্তিতে আপনি যা পাবেন" },
          { key: "landowners.benefitsLead", label: "Benefits Lead", type: "textarea", en: "The four terms landowners ask about first, answered before you send us the deed.", bn: "জমির মালিকরা যে চারটি শর্ত সবার আগে জানতে চান, দলিল পাঠানোর আগেই তার উত্তর।" },
          { key: "landowners.builtTitle", label: "Built Title", type: "text", en: "Built with landowners", bn: "জমির মালিকদের সঙ্গে গড়া" },
          { key: "landowners.builtLead", label: "Built Lead", type: "textarea", en: "Completed joint ventures, with the share the owner actually received.", bn: "সম্পন্ন যৌথ উদ্যোগ, মালিক যতটুকু অংশ পেয়েছেন সহ।" },
          { key: "landowners.stepsTitle", label: "Steps Title", type: "text", en: "How a joint venture runs", bn: "যৌথ উদ্যোগ কীভাবে চলে" },
        ],
      },
      {
        id: "landowners.columns",
        label: "Landowners · Columns",
        fields: [
          { key: "landowners.columns.project", label: "Project", type: "text", en: "Project", bn: "প্রকল্প" },
          { key: "landowners.columns.land", label: "Land", type: "text", en: "Land", bn: "জমি" },
          { key: "landowners.columns.floors", label: "Floors", type: "text", en: "Floors", bn: "তলা" },
          { key: "landowners.columns.share", label: "Share", type: "text", en: "Owner share", bn: "মালিকের অংশ" },
          { key: "landowners.columns.completed", label: "Completed", type: "text", en: "Completed", bn: "সমাপ্ত" },
        ],
      },
      {
        id: "landowners.story",
        label: "Landowners · Story",
        fields: [
          { key: "landowners.story.quoteLabel", label: "Quote Label", type: "text", en: "Landowners speak for us", bn: "জমির মালিকরাই বলুন" },
          { key: "landowners.story.quote", label: "Quote", type: "textarea", en: "After counting my peers, I found that they had a record of handing over on time. That is what convinced me to give them my land.", bn: "পরিচিতদের কাছে খোঁজ নিয়ে দেখলাম, এরা সময়মতো বুঝিয়ে দেওয়ার রেকর্ড রেখেছে। এই কারণেই জমিটা তাঁদের হাতে দিয়েছি।" },
          { key: "landowners.story.quoteName", label: "Quote Name", type: "text", en: "Air Vice Marshal A. O. Mahmud (Retd.)", bn: "এয়ার ভাইস মার্শাল এ. ও. মাহমুদ (অব.)" },
          { key: "landowners.story.quoteRole", label: "Quote Role", type: "text", en: "Joint venture landowner, Banani", bn: "যৌথ উদ্যোগের জমির মালিক, বনানী" },
          { key: "landowners.story.whyTitle", label: "Why Title", type: "text", en: "Why choose us as a partner for your land?", bn: "আপনার জমির জন্য আমাদের কেন বেছে নেবেন?" },
          { key: "landowners.story.whyBody", label: "Why Body", type: "textarea", en: "Dealing with a developer in Dhaka is hard to judge from the outside — the joint venture process is bureaucratic, and the promises all sound alike. We put the terms in the deed instead of the brochure: the owner share, the signing advance held in bank escrow, and a handover date you can enforce. Read what our landowners say, then look at what we finished.", bn: "ঢাকায় ডেভেলপার যাচাই করা বাইরে থেকে কঠিন — যৌথ উদ্যোগের প্রক্রিয়া জটিল, আর প্রতিশ্রুতি সবারই এক রকম শোনায়। আমরা শর্তগুলো ব্রোশিউরে নয়, চুক্তিপত্রে লিখি: মালিকের অংশ, ব্যাংক এসক্রোতে রাখা সাইনিং অগ্রিম, আর এমন হস্তান্তরের তারিখ যা আপনি আদায় করতে পারবেন।" },
          { key: "landowners.story.differentTitle", label: "Different Title", type: "text", en: "How we are different", bn: "আমরা কেন আলাদা" },
          { key: "landowners.story.differentBody", label: "Different Body", type: "textarea", en: "We took the legal work in-house rather than subcontracting it, so the title search that decides whether a joint venture is safe is done by people who answer to you. Our engineers inspect every active site each month, and the completion figure you see is the one they signed off. If a timeline is slipping we tell you before you hear it from a neighbour.", bn: "আইনি কাজ বাইরে না দিয়ে নিজেদের দলে রেখেছি, তাই যে মালিকানা যাচাই যৌথ উদ্যোগটি নিরাপদ কিনা ঠিক করে, সেটি এমন মানুষ করেন যাঁরা আপনার কাছে জবাবদিহি। আমাদের প্রকৌশলীরা প্রতি মাসে প্রতিটি সাইট দেখেন, আর আপনি যে অগ্রগতির সংখ্যা দেখেন সেটি তাঁদেরই অনুমোদিত। সময় পিছালে পাশের বাড়ি থেকে শোনার আগেই আমরা জানাই।" },
          { key: "landowners.story.videoCaption", label: "Video Caption", type: "text", en: "A landowner walks through a finished joint venture", bn: "একজন জমির মালিক সম্পন্ন প্রকল্প ঘুরে দেখাচ্ছেন" },
          { key: "landowners.story.moreTitle", label: "More Title", type: "text", en: "Want to know more?", bn: "আরও জানতে চান?" },
          { key: "landowners.story.moreBody", label: "More Body", type: "textarea", en: "Send us the plot address and the deed. Within two weeks you get a feasibility report — what can legally be built there, how many units, and the share we can offer, in writing. No obligation, and the papers stay yours.", bn: "জমির ঠিকানা আর দলিল পাঠান। দুই সপ্তাহের মধ্যে সম্ভাব্যতা প্রতিবেদন পাবেন — ওই জমিতে আইনত কী গড়া যায়, কতটি ইউনিট, আর কত অংশ দিতে পারি — সব লিখিতভাবে। কোনো বাধ্যবাধকতা নেই, কাগজপত্র আপনারই থাকবে।" },
          { key: "landowners.story.moreCta", label: "More Cta", type: "text", en: "Talk to the land team", bn: "জমি ডেস্কে কথা বলুন" },
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
        label: "Blog",
        fields: [
          { key: "blog.eyebrow", label: "Eyebrow", type: "text", en: "Market Notes & Intelligence", bn: "বাজার নোট ও বিশ্লেষণ" },
          { key: "blog.title", label: "Title", type: "text", en: "Explore News, Insights and Guides", bn: "রিয়েল এস্টেট সংবাদ, বিশ্লেষণ ও গাইড" },
          { key: "blog.description", label: "Description", type: "textarea", en: "In-depth research on Dhaka real estate, architectural movements, property regulations, and market trends.", bn: "ঢাকার আবাসন বাজার, স্থাপত্যের বিকাশ, আইনি নীতিমালা ও অর্থনৈতিক অগ্রগতি নিয়ে নির্ভরযোগ্য গবেষণা ও বিশ্লেষণ।" },
          { key: "blog.metaTitle", label: "Meta Title", type: "text", en: "Market notes and guides", bn: "বাজার নোট ও গাইড" },
          { key: "blog.metaDescription", label: "Meta Description", type: "textarea", en: "Legal checklists, market reads and non-resident buying guides for Dhaka and Chattogram property, written by the Zoom Property team.", bn: "ঢাকা ও চট্টগ্রামের সম্পত্তি নিয়ে আইনি চেকলিস্ট, বাজার বিশ্লেষণ আর প্রবাসী ক্রেতাদের গাইড।" },
          { key: "blog.all", label: "All", type: "text", en: "All", bn: "সবগুলো" },
          { key: "blog.readMore", label: "Read More", type: "text", en: "Read article", bn: "বিস্তারিত পড়ুন" },
          { key: "blog.viewAll", label: "View All", type: "text", en: "View all", bn: "সবগুলো দেখুন" },
          { key: "blog.minRead", label: "Min Read", type: "text", en: "min read", bn: "মিনিট পাঠ" },
          { key: "blog.publishedOn", label: "Published On", type: "text", en: "Published", bn: "প্রকাশিত" },
          { key: "blog.searchPlaceholder", label: "Search Placeholder", type: "textarea", en: "Search articles, market trends, guides...", bn: "প্রবন্ধ, মার্কেট ট্রেন্ড বা এলাকা অনুসন্ধান করুন..." },
          { key: "blog.categoriesPrev", label: "Categories Prev", type: "text", en: "Scroll categories left", bn: "ক্যাটাগরি বাঁ দিকে সরান" },
          { key: "blog.categoriesNext", label: "Categories Next", type: "text", en: "Scroll categories right", bn: "ক্যাটাগরি ডান দিকে সরান" },
          { key: "blog.featuredBadge", label: "Featured Badge", type: "text", en: "Featured Story", bn: "বিশেষ প্রতিবেদন" },
          { key: "blog.trendingBadge", label: "Trending Badge", type: "text", en: "Trending", bn: "আলোচিত" },
          { key: "blog.browsingCategory", label: "Browsing Category", type: "text", en: "Browsing Category", bn: "ক্যাটাগরি ব্রাউজ করছেন" },
          { key: "blog.featuredForYou", label: "Featured For You", type: "text", en: "Here are the featured blogs for you", bn: "আপনার জন্য নির্বাচিত ব্লগসমূহ" },
          { key: "blog.postsCount", label: "Posts Count", type: "text", en: "Posts", bn: "টি প্রতিবেদন" },
          { key: "blog.loadMore", label: "Load More", type: "text", en: "Load more articles", bn: "আরও প্রতিবেদন দেখুন" },
          { key: "blog.noResults", label: "No Results", type: "text", en: "No articles matched. Try another category or a different search term.", bn: "কোনো প্রতিবেদন পাওয়া যায়নি। অন্য ক্যাটাগরি বা ভিন্ন কি-ওয়ার্ড দিয়ে দেখুন।" },
          { key: "blog.resetFilter", label: "Reset Filter", type: "text", en: "Reset filter", bn: "ফিল্টার রিসেট" },
          { key: "blog.prevPage", label: "Prev Page", type: "text", en: "Previous", bn: "আগের" },
          { key: "blog.nextPage", label: "Next Page", type: "text", en: "Next", bn: "পরের" },
          { key: "blog.pageLabel", label: "Page Label", type: "text", en: "Page {page}", bn: "পৃষ্ঠা {page}" },
          { key: "blog.pageOf", label: "Page Of", type: "text", en: "Page {page} of {total}", bn: "{total}টির মধ্যে {page} নম্বর পৃষ্ঠা" },
          { key: "blog.backToAll", label: "Back To All", type: "text", en: "All Articles", bn: "সবগুলো ব্লগ" },
        ],
      },
      {
        id: "blog.article",
        label: "Blog · Article",
        fields: [
          { key: "blog.article.backToBlog", label: "Back To Blog", type: "text", en: "All articles", bn: "সব লেখা" },
          { key: "blog.article.breadcrumbHome", label: "Breadcrumb Home", type: "text", en: "Home", bn: "হোম" },
          { key: "blog.article.by", label: "By", type: "text", en: "By", bn: "লিখেছেন" },
          { key: "blog.article.share", label: "Share", type: "text", en: "Share this article", bn: "এই লেখাটি শেয়ার করুন" },
          { key: "blog.article.copyLink", label: "Copy Link", type: "text", en: "Copy link", bn: "লিংক কপি করুন" },
          { key: "blog.article.copied", label: "Copied", type: "text", en: "Link copied", bn: "লিংক কপি হয়েছে" },
          { key: "blog.article.tocTitle", label: "Toc Title", type: "text", en: "In this article", bn: "এই লেখায়" },
          { key: "blog.article.quickContact.title", label: "Quick Contact · Title", type: "text", en: "Quick contact", bn: "দ্রুত যোগাযোগ" },
          { key: "blog.article.quickContact.subtitle", label: "Quick Contact · Subtitle", type: "textarea", en: "Ask about anything in this article. An advisor replies the same working day.", bn: "এই লেখার যেকোনো বিষয়ে জিজ্ঞেস করুন। একই কর্মদিবসে একজন পরামর্শক উত্তর দেবেন।" },
          { key: "blog.article.quickContact.name", label: "Quick Contact · Name", type: "text", en: "Your name", bn: "আপনার নাম" },
          { key: "blog.article.quickContact.namePlaceholder", label: "Quick Contact · Name Placeholder", type: "textarea", en: "Full name", bn: "পুরো নাম" },
          { key: "blog.article.quickContact.phone", label: "Quick Contact · Phone", type: "text", en: "Phone", bn: "ফোন" },
          { key: "blog.article.quickContact.email", label: "Quick Contact · Email", type: "text", en: "Email", bn: "ইমেইল" },
          { key: "blog.article.quickContact.message", label: "Quick Contact · Message", type: "text", en: "Message", bn: "বার্তা" },
          { key: "blog.article.quickContact.messagePlaceholder", label: "Quick Contact · Message Placeholder", type: "textarea", en: "What would you like to know?", bn: "কী জানতে চান?" },
          { key: "blog.article.quickContact.submit", label: "Quick Contact · Submit", type: "text", en: "Book a callback", bn: "কলব্যাক বুক করুন" },
          { key: "blog.article.quickContact.submitting", label: "Quick Contact · Submitting", type: "text", en: "Sending…", bn: "পাঠানো হচ্ছে…" },
          { key: "blog.article.quickContact.successTitle", label: "Quick Contact · Success Title", type: "text", en: "Request received", bn: "অনুরোধ পেয়েছি" },
          { key: "blog.article.quickContact.successBody", label: "Quick Contact · Success Body", type: "textarea", en: "An advisor will call you back on the number you gave.", bn: "আপনার দেওয়া নম্বরে একজন পরামর্শক কল করবেন।" },
          { key: "blog.article.quickContact.privacy", label: "Quick Contact · Privacy", type: "text", en: "We use your details to answer this enquiry and nothing else.", bn: "আপনার তথ্য কেবল এই অনুসন্ধানের উত্তর দিতেই ব্যবহার করা হয়।" },
          { key: "blog.article.comments.title", label: "Comments · Title", type: "text", en: "Leave a comment", bn: "মন্তব্য করুন" },
          { key: "blog.article.comments.subtitle", label: "Comments · Subtitle", type: "textarea", en: "Questions and corrections are both welcome. Comments are reviewed before they appear.", bn: "প্রশ্ন ও সংশোধন দুটোই স্বাগত। প্রকাশের আগে মন্তব্য পর্যালোচনা করা হয়।" },
          { key: "blog.article.comments.name", label: "Comments · Name", type: "text", en: "Name", bn: "নাম" },
          { key: "blog.article.comments.namePlaceholder", label: "Comments · Name Placeholder", type: "textarea", en: "Your name", bn: "আপনার নাম" },
          { key: "blog.article.comments.email", label: "Comments · Email", type: "text", en: "Email", bn: "ইমেইল" },
          { key: "blog.article.comments.emailNote", label: "Comments · Email Note", type: "textarea", en: "Not published.", bn: "প্রকাশ করা হবে না।" },
          { key: "blog.article.comments.comment", label: "Comments · Comment", type: "text", en: "Comment", bn: "মন্তব্য" },
          { key: "blog.article.comments.commentPlaceholder", label: "Comments · Comment Placeholder", type: "textarea", en: "Write your comment…", bn: "আপনার মন্তব্য লিখুন…" },
          { key: "blog.article.comments.submit", label: "Comments · Submit", type: "text", en: "Post comment", bn: "মন্তব্য পোস্ট করুন" },
          { key: "blog.article.comments.submitting", label: "Comments · Submitting", type: "text", en: "Posting…", bn: "পোস্ট হচ্ছে…" },
          { key: "blog.article.comments.successTitle", label: "Comments · Success Title", type: "text", en: "Comment submitted", bn: "মন্তব্য জমা হয়েছে" },
          { key: "blog.article.comments.successBody", label: "Comments · Success Body", type: "textarea", en: "Thanks — it will appear once a moderator has read it.", bn: "ধন্যবাদ — মডারেটর দেখে নিলে এটি প্রকাশ পাবে।" },
          { key: "blog.article.related.title", label: "Related · Title", type: "text", en: "Keep reading", bn: "পড়া চালিয়ে যান" },
          { key: "blog.article.related.description", label: "Related · Description", type: "textarea", en: "Three more pieces from the same desk, picked for what you just read.", bn: "একই ডেস্কের আরও তিনটি লেখা, আপনি যা পড়লেন তার সঙ্গে মিলিয়ে বাছা।" },
        ],
      },
      {
        id: "blog.categories",
        label: "Blog · Categories",
        fields: [
          { key: "blog.categories.Market", label: "Market", type: "text", en: "Market", bn: "বাজার" },
          { key: "blog.categories.Legal", label: "Legal", type: "text", en: "Legal & Advisory", bn: "আইনি পরামর্শ" },
          { key: "blog.categories.Guide", label: "Guide", type: "text", en: "Guide", bn: "গাইড" },
          { key: "blog.categories.NRB", label: "NRB", type: "text", en: "NRB Desk", bn: "প্রবাসী ডেস্ক" },
          { key: "blog.categories.Real Estate", label: "Real Estate", type: "text", en: "Real Estate", bn: "রিয়েল এস্টেট" },
          { key: "blog.categories.Architecture", label: "Architecture", type: "text", en: "Architecture", bn: "স্থাপত্য ও নকশা" },
          { key: "blog.categories.Economy", label: "Economy", type: "text", en: "Economy", bn: "অর্থনীতি" },
          { key: "blog.categories.Technology", label: "Technology", type: "text", en: "Technology", bn: "প্রযুক্তি" },
          { key: "blog.categories.Lifestyle", label: "Lifestyle", type: "text", en: "Lifestyle", bn: "লাইফস্টাইল" },
        ],
      },
      {
        id: "blog.sections",
        label: "Blog · Sections",
        fields: [
          { key: "blog.sections.explore", label: "Explore", type: "text", en: "Explore News, Insights & Stories", bn: "সংবাদ, বিশ্লেষণ ও প্রতিবেদনসমূহ" },
          { key: "blog.sections.architecture", label: "Architecture", type: "text", en: "Architecture News", bn: "স্থাপত্য ও ডিজাইন সংবাদ" },
          { key: "blog.sections.architectureDesc", label: "Architecture Desc", type: "text", en: "Contemporary aesthetics, spatial innovations, and building trends.", bn: "আধুনিক নান্দনিকতা, আধুনিক গৃহনির্মাণ ও অভ্যন্তরীণ সাজসজ্জার ট্রেন্ড।" },
          { key: "blog.sections.lifestyle", label: "Lifestyle", type: "text", en: "Awards & Recognition News", bn: "স্বীকৃতি, ক্যাফে ও লাইফস্টাইল" },
          { key: "blog.sections.lifestyleDesc", label: "Lifestyle Desc", type: "text", en: "Dining, international schools, and prime community living.", bn: "প্রিমিয়াম ডাইনিং, আন্তর্জাতিক স্কুল ও ঢাকার সেরা এলাকা নির্দেশিকা।" },
          { key: "blog.sections.advisory", label: "Advisory", type: "text", en: "Company Information News", bn: "কোম্পানি ও আইনি পরামর্শ সংবাদ" },
          { key: "blog.sections.advisoryDesc", label: "Advisory Desc", type: "text", en: "Deed vetting, home loan rates, and asset management guides.", bn: "দলিল যাচাই, গৃহঋণের সুদহার ও সম্পদ ব্যবস্থাপনা সহায়িকা।" },
          { key: "blog.sections.economy", label: "Economy", type: "text", en: "Economy News", bn: "অর্থনীতি ও মেগাপ্রকল্প সংবাদ" },
          { key: "blog.sections.economyDesc", label: "Economy Desc", type: "text", en: "National megaprojects, monetary policies, and commercial growth.", bn: "মেগাপ্রকল্পের প্রভাব, ব্যাংকিং নীতি ও বাণিজ্যিক বিকাশ।" },
          { key: "blog.sections.realEstate", label: "Real Estate", type: "text", en: "Real Estate News", bn: "রিয়েল এস্টেট ও এলাকা সংবাদ" },
          { key: "blog.sections.realEstateDesc", label: "Real Estate Desc", type: "text", en: "Commercial hubs, residential enclaves, and price movements.", bn: "বাণিজ্যিক কেন্দ্র, আবাসিক জোন ও প্রপার্টি মূল্যের গতিপ্রকৃতি।" },
          { key: "blog.sections.technology", label: "Technology", type: "text", en: "Technology News", bn: "প্রযুক্তি ও আধুনিক আবাসন সংবাদ" },
          { key: "blog.sections.technologyDesc", label: "Technology Desc", type: "text", en: "PropTech solutions, smart home automation, and digital infrastructure.", bn: "প্রপটেক সলিউশন, স্মার্ট হোম অটোমেশন ও আধুনিক ইন্টারনেট সেবা।" },
        ],
      },
      {
        id: "blog.promo",
        label: "Blog · Promo",
        fields: [
          { key: "blog.promo.badge", label: "Badge", type: "text", en: "Zoom Property Verified", bn: "জুম প্রপার্টি ভেরিফায়েড" },
          { key: "blog.promo.title", label: "Title", type: "text", en: "READY FOR AN UPGRADE?", bn: "নতুন ঠিকানায় আপগ্রেড হতে চান?" },
          { key: "blog.promo.subtitle", label: "Subtitle", type: "textarea", en: "Discover your dream home with 100% verified legal deeds and RAJUK permits.", bn: "১০০% রাজউক অনুমোদিত ও মালিকানা যাচাইকৃত অ্যাপার্টমেন্ট বা প্লট খুঁজুন নিশ্চিন্তে।" },
          { key: "blog.promo.cta1", label: "Cta1", type: "text", en: "Browse Verified Listings", bn: "যাচাইকৃত প্রপার্টি দেখুন" },
          { key: "blog.promo.cta2", label: "Cta2", type: "text", en: "Consult an Advisor", bn: "পরামর্শকের সাথে কথা বলুন" },
        ],
      },
      {
        id: "blog.newsletter",
        label: "Blog · Newsletter",
        fields: [
          { key: "blog.newsletter.badge", label: "Badge", type: "text", en: "Monthly Market Memo", bn: "মাসিক প্রপার্টি বুলেটিন" },
          { key: "blog.newsletter.title", label: "Title", type: "text", en: "Stay Ahead of the Bangladesh Property Market", bn: "দেশের আবাসন খাতের প্রতিটি আপডেটে থাকুন এগিয়ে" },
          { key: "blog.newsletter.description", label: "Description", type: "textarea", en: "Receive monthly audited pricing reports, megaproject milestones, and regulatory updates directly in your inbox.", bn: "প্রতি মাসে সঠিক বাজার দর, মেগাপ্রকল্পের অগ্রগতি ও আইনি পরামর্শের বিশ্লেষণ সরাসরি আপনার ইনবক্সে।" },
          { key: "blog.newsletter.placeholder", label: "Placeholder", type: "textarea", en: "Enter your email address", bn: "আপনার ইমেইল ঠিকানা লিখুন" },
          { key: "blog.newsletter.button", label: "Button", type: "text", en: "Subscribe", bn: "যুক্ত হোন" },
          { key: "blog.newsletter.note", label: "Note", type: "textarea", en: "Zero spam. Only actionable property insights and market data.", bn: "কোনো স্প্যাম নয়। কেবল রিয়েল এস্টেটের প্রয়োজনীয় তথ্য ও বাজার বিশ্লেষণ।" },
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
        label: "Contact",
        fields: [
          { key: "contact.eyebrow", label: "Eyebrow", type: "text", en: "Get in touch", bn: "যোগাযোগ করুন" },
          { key: "contact.title", label: "Title", type: "text", en: "Talk to an advisor", bn: "একজন পরামর্শদাতার সঙ্গে কথা বলুন" },
          { key: "contact.description", label: "Description", type: "textarea", en: "Tell us the area, the budget and when you need to move. We come back with a shortlist, the papers and every cost on one page.", bn: "এলাকা, বাজেট আর কবে উঠতে চান জানান। আমরা বাছাই তালিকা, কাগজপত্র আর সব খরচ এক পাতায় নিয়ে ফিরে আসব।" },
          { key: "contact.metaTitle", label: "Meta Title", type: "text", en: "Contact", bn: "যোগাযোগ" },
          { key: "contact.metaDescription", label: "Meta Description", type: "textarea", en: "Talk to a Zoom Property advisor. Phone, WhatsApp and email for Dhaka and Chattogram, plus a dedicated desk for non-resident buyers.", bn: "জুম প্রপার্টির পরামর্শদাতার সঙ্গে কথা বলুন। ঢাকা ও চট্টগ্রামের ফোন, হোয়াটসঅ্যাপ ও ইমেইল, সঙ্গে প্রবাসী ক্রেতাদের জন্য আলাদা ডেস্ক।" },
          { key: "contact.offices", label: "Offices", type: "text", en: "Offices", bn: "অফিস" },
          { key: "contact.dhaka", label: "Dhaka", type: "text", en: "Dhaka", bn: "ঢাকা" },
          { key: "contact.chattogram", label: "Chattogram", type: "text", en: "Chattogram", bn: "চট্টগ্রাম" },
          { key: "contact.formTitle", label: "Form Title", type: "text", en: "Send an enquiry", bn: "বার্তা পাঠান" },
          { key: "contact.formLead", label: "Form Lead", type: "textarea", en: "One form, no account needed. An advisor picks it up, not an autoresponder.", bn: "একটি ফর্ম, অ্যাকাউন্ট লাগবে না। অটো-রিপ্লাই নয়, একজন পরামর্শদাতা দেখবেন।" },
        ],
      },
      {
        id: "contact.channels",
        label: "Contact · Channels",
        fields: [
          { key: "contact.channels.call", label: "Call", type: "text", en: "Call the desk", bn: "সরাসরি ফোন" },
          { key: "contact.channels.callNote", label: "Call Note", type: "textarea", en: "Sat–Thu, 9am – 8pm BST", bn: "শনি–বৃহস্পতি, সকাল ৯টা – রাত ৮টা" },
          { key: "contact.channels.whatsapp", label: "Whatsapp", type: "text", en: "WhatsApp", bn: "হোয়াটসঅ্যাপ" },
          { key: "contact.channels.whatsappNote", label: "Whatsapp Note", type: "textarea", en: "Best for photos and documents", bn: "ছবি ও কাগজপত্র পাঠাতে সবচেয়ে ভালো" },
          { key: "contact.channels.email", label: "Email", type: "text", en: "Email", bn: "ইমেইল" },
          { key: "contact.channels.emailNote", label: "Email Note", type: "textarea", en: "Replies within one business hour", bn: "এক কর্মঘণ্টার মধ্যে উত্তর" },
        ],
      },
      {
        id: "contact.form",
        label: "Contact · Form",
        fields: [
          { key: "contact.form.name", label: "Name", type: "text", en: "Full name", bn: "পুরো নাম" },
          { key: "contact.form.namePlaceholder", label: "Name Placeholder", type: "textarea", en: "Your name", bn: "আপনার নাম" },
          { key: "contact.form.phone", label: "Phone", type: "text", en: "Phone", bn: "ফোন" },
          { key: "contact.form.email", label: "Email", type: "text", en: "Email", bn: "ইমেইল" },
          { key: "contact.form.enquiry", label: "Enquiry", type: "text", en: "What is this about?", bn: "কী বিষয়ে?" },
          { key: "contact.form.area", label: "Area", type: "text", en: "Which area?", bn: "কোন এলাকায়?" },
          { key: "contact.form.areaAny", label: "Area Any", type: "text", en: "Any area — not decided yet", bn: "যেকোনো এলাকা — এখনও ঠিক করিনি" },
          { key: "contact.form.budget", label: "Budget", type: "text", en: "Budget range", bn: "বাজেট" },
          { key: "contact.form.budgetOptions.any", label: "Budget Options · Any", type: "text", en: "Not sure yet", bn: "এখনও ঠিক করিনি" },
          { key: "contact.form.budgetOptions.under1", label: "Budget Options · Under1", type: "text", en: "Under ৳1 Cr", bn: "১ কোটির নিচে" },
          { key: "contact.form.budgetOptions.1to2", label: "Budget Options · 1to2", type: "text", en: "৳1 – 2 Cr", bn: "১ – ২ কোটি" },
          { key: "contact.form.budgetOptions.2to5", label: "Budget Options · 2to5", type: "text", en: "৳2 – 5 Cr", bn: "২ – ৫ কোটি" },
          { key: "contact.form.budgetOptions.5to10", label: "Budget Options · 5to10", type: "text", en: "৳5 – 10 Cr", bn: "৫ – ১০ কোটি" },
          { key: "contact.form.budgetOptions.over10", label: "Budget Options · Over10", type: "text", en: "৳10 Cr and above", bn: "১০ কোটি বা তার বেশি" },
          { key: "contact.form.message", label: "Message", type: "text", en: "Anything we should know?", bn: "আর কিছু জানানোর আছে?" },
          { key: "contact.form.messagePlaceholder", label: "Message Placeholder", type: "textarea", en: "How many bedrooms, when you need to move, anything else…", bn: "কয়টি বেডরুম, কবে উঠতে চান, আর কিছু জানানোর থাকলে…" },
          { key: "contact.form.submit", label: "Submit", type: "text", en: "Send enquiry", bn: "বার্তা পাঠান" },
          { key: "contact.form.submitting", label: "Submitting", type: "text", en: "Sending…", bn: "পাঠানো হচ্ছে…" },
          { key: "contact.form.privacy", label: "Privacy", type: "textarea", en: "We reply within one business hour. Your details are not shared with developers or third parties.", bn: "আমরা এক কর্মঘণ্টার মধ্যে উত্তর দিই। আপনার তথ্য ডেভেলপার বা তৃতীয় পক্ষের সঙ্গে ভাগ করা হয় না।" },
          { key: "contact.form.successTitle", label: "Success Title", type: "text", en: "Enquiry received", bn: "বার্তা পৌঁছেছে" },
          { key: "contact.form.successBody", label: "Success Body", type: "textarea", en: "An advisor will reply within one business hour.", bn: "একজন পরামর্শদাতা এক কর্মঘণ্টার মধ্যে উত্তর দেবেন।" },
          { key: "contact.form.options.buy", label: "Options · Buy", type: "text", en: "I want to buy", bn: "আমি কিনতে চাই" },
          { key: "contact.form.options.rent", label: "Options · Rent", type: "text", en: "I want to rent", bn: "আমি ভাড়া নিতে চাই" },
          { key: "contact.form.options.sell", label: "Options · Sell", type: "text", en: "I want to list my property", bn: "আমি আমার সম্পত্তি তালিকাভুক্ত করতে চাই" },
          { key: "contact.form.options.landowner", label: "Options · Landowner", type: "text", en: "Landowner joint venture", bn: "জমির মালিক — যৌথ উদ্যোগ" },
          { key: "contact.form.options.nrb", label: "Options · Nrb", type: "text", en: "Buying from abroad (NRB)", bn: "প্রবাস থেকে কেনা (এনআরবি)" },
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
