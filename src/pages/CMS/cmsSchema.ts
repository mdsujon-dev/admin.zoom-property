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
  | "images"
  | "icon";

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
  /** Overrides the default guidance shown beside an `image` item field. */
  hint?: string;
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
  /**
   * Which item field names the row in the editor's heading. Defaults to
   * `title`; a list whose rows have no title says so here.
   */
  titleSuffix?: string;
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
            key: "hero.backgroundImages",
            label: "Background images",
            type: "images",
            hint: "The photographs that fade one into the next behind the hero. Landscape, about 2000px wide. Add as many as you like \u2014 one is a still background.",
            en: "[]",
            bn: "[]"
          },
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
        id: "listings",
        label: "Listings",
        fields: [
          {
            key: "listings.title",
            label: "Title",
            type: "text",
            hint: "The heading over the six property cards. The \"All Properties\" button beside it is fixed.",
            en: "Verified residences and commercial floors",
            bn: "যাচাই করা ফ্ল্যাট ও বাণিজ্যিক ফ্লোর"
          }
        ]
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
        id: "areasSection",
        label: "Areas",
        fields: [
          {
            key: "areas.service.titleLead",
            label: "Title \u2014 before the accent",
            type: "text",
            hint: "The heading is three boxes so the green words can sit anywhere in the sentence \u2014 English and Bangla do not put them in the same place. Keep the trailing space.",
            en: "We Serve Across ",
            bn: "আমরা আছি "
          },
          {
            key: "areas.service.titleAccent",
            label: "Title \u2014 the green words",
            type: "text",
            hint: "Printed in brand green.",
            en: "Dhaka & Nearby Areas",
            bn: "ঢাকা ও আশপাশের এলাকাজুড়ে"
          },
          {
            key: "areas.service.titleTail",
            label: "Title \u2014 after the accent",
            type: "text",
            hint: "Often empty. Used when the sentence continues past the green words.",
            en: "",
            bn: ""
          }
        ]
      },
      {
        id: "projectsSection",
        label: "Projects",
        fields: [
          {
            key: "projects.homeTitle",
            label: "Title",
            type: "text",
            hint: "The only text in this block — the cards under it carry the stage, the permit and the handover date. Separate from the /projects page's own banner title, which is under CMS → Projects.",
            en: "Milestone progress you can audit",
            bn: "অগ্রগতি নিজে যাচাই করুন"
          },
          {
            key: "projects.allProjects",
            label: "Button text",
            type: "text",
            hint: "The link at the top right of the block.",
            en: "View All Projects",
            bn: "সবগুলো প্রজেক্ট দেখুন"
          },
          {
            key: "projects.actionLink",
            label: "Button link",
            type: "url",
            hint: "Where that button goes. A path on this site, e.g. /projects",
            en: "/projects",
            bn: "/projects"
          }
        ]
      },
      {
        id: "statsBanner",
        label: "Stats Banner",
        fields: [
          {
            key: "statsBanner.backgroundImage",
            label: "Background Image",
            type: "image",
            groupHeader: "Background",
            hint: "The photograph behind the numbers. Wide and dark-tolerant — a dark overlay sits on top so the white figures stay readable. About 2400px wide.",
            en: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85",
            bn: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85",
          },
          {
            key: "statsBanner.stat1Value",
            label: "Number",
            type: "text",
            groupHeader: "Stat 1",
            hint: "Digits only — the site counts up to it. Put any + or k in the suffix box.",
            en: "8",
            bn: "8",
          },
          {
            key: "statsBanner.stat1Suffix",
            label: "Suffix",
            type: "text",
            hint: "What follows the number: k+, +, %. Leave empty for a bare figure.",
            en: "k+",
            bn: "k+",
          },
          {
            key: "statsBanner.stat1Label",
            label: "Label",
            type: "text",
            hint: "How many, and of what. Two or three words — it sits under the figure on one line.",
            en: "Projects completed",
            bn: "সম্পূর্ণ প্রজেক্ট",
          },
          {
            key: "statsBanner.stat2Value",
            label: "Number",
            type: "text",
            groupHeader: "Stat 2",
            hint: "Digits only — the site counts up to it. Put any + or k in the suffix box.",
            en: "3",
            bn: "3",
          },
          {
            key: "statsBanner.stat2Suffix",
            label: "Suffix",
            type: "text",
            hint: "What follows the number: k+, +, %. Leave empty for a bare figure.",
            en: "k+",
            bn: "k+",
          },
          {
            key: "statsBanner.stat2Label",
            label: "Label",
            type: "text",
            hint: "How many, and of what.",
            en: "Global customers",
            bn: "গ্লোবাল গ্রাহক",
          },
          {
            key: "statsBanner.stat3Value",
            label: "Number",
            type: "text",
            groupHeader: "Stat 3",
            hint: "Digits only — the site counts up to it. Put any + or k in the suffix box.",
            en: "20",
            bn: "20",
          },
          {
            key: "statsBanner.stat3Suffix",
            label: "Suffix",
            type: "text",
            hint: "What follows the number: k+, +, %. Leave empty for a bare figure.",
            en: "+",
            bn: "+",
          },
          {
            key: "statsBanner.stat3Label",
            label: "Label",
            type: "text",
            hint: "How many, and of what.",
            en: "Years of experience",
            bn: "বছরের অভিজ্ঞতা",
          },
          {
            key: "statsBanner.stat4Value",
            label: "Number",
            type: "text",
            groupHeader: "Stat 4",
            hint: "Digits only — the site counts up to it. Put any + or k in the suffix box.",
            en: "95",
            bn: "95",
          },
          {
            key: "statsBanner.stat4Suffix",
            label: "Suffix",
            type: "text",
            hint: "What follows the number: k+, +, %. Leave empty for a bare figure.",
            en: "+",
            bn: "+",
          },
          {
            key: "statsBanner.stat4Label",
            label: "Label",
            type: "text",
            hint: "How many, and of what.",
            en: "Team engineers",
            bn: "টিম ইঞ্জিনিয়ার",
          },
        ],
      },
      {
        id: "homeReviews",
        label: "Client reviews",
        fields: [
          {
            key: "reviews.homeTitle",
            label: "Title",
            type: "text",
            hint: "The only text in this block — everything under it is the review videos themselves. Keep it to a few words: it is centred and sits on one line on desktop.",
            en: "What our clients say",
            bn: "আমাদের ক্লায়েন্টরা কী বলেন"
          }
        ]
      },
      {
        id: "videoSection",
        label: "Video Section",
        fields: [
          {
            key: "videoSection.title",
            label: "Title",
            type: "text",
            hint: "The only text in this block \u2014 everything under it is the videos themselves. It sits on the dark backdrop, centred.",
            en: "Experience Luxury Living in Motion",
            bn: "ভিডিওতে দেখুন আমাদের লাক্সারি প্রপার্টি"
          }
        ]
      },
      {
        id: "homeBlog",
        label: "Blog",
        fields: [
          {
            key: "blog.homeTitle",
            label: "Title",
            type: "text",
            hint: "The heading over the three article cards. Separate from the /blog page's own banner title, which is under CMS → Blog.",
            en: "Explore News, Insights and Guides",
            bn: "রিয়েল এস্টেট সংবাদ, বিশ্লেষণ ও গাইড"
          }
        ]
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
            key: "listings.pageTitle",
            label: "Title",
            type: "text",
            en: "Properties for sale and rent",
            bn: "যাচাই করা ফ্ল্যাট ও বাণিজ্যিক ফ্লোর",
          },
          {
            key: "listings.pageDescription",
            label: "Description",
            hint: "Write {count} where the number of listings should go — the site fills it in.",
            type: "textarea",
            en: "{count} listings, each physically inspected by our survey team and title-checked before upload. Filter by purpose, type and area below.",
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
            key: "projects.pageTitle",
            label: "Title",
            type: "text",
            en: "Projects under construction",
            bn: "অগ্রগতি নিজে যাচাই করুন",
          },
          {
            key: "projects.pageDescription",
            label: "Description",
            type: "textarea",
            en: "You pay in instalments for years before you get keys. Every project here shows its audited structural stage and permit number, updated monthly.",
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
            key: "areas.pageTitle",
            label: "Title",
            type: "text",
            en: "Service Areas for Luxury Flats",
            bn: "যেসব প্রাইম এরিয়ায় আমরা ফ্ল্যাট ও ইউনিট বিক্রি করি",
          },
          {
            key: "areas.pageDescription",
            label: "Description",
            type: "textarea",
            en: "Browse verified luxury apartments, duplexes, and commercial floors across Dhaka & Chattogram's most requested addresses.",
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
      {
        id: "story",
        label: "Story",
        fields: [
          {
            key: "about.story.eyebrow",
            label: "Eyebrow",
            type: "text",
            hint: "Max 3-5 words. Keep it very short.",
            en: "Who we are",
            bn: "আমরা কারা"
          },
          {
            key: "about.story.title",
            label: "Title",
            type: "text",
            hint: "Main heading. 6-10 words maximum to avoid breaking the layout.",
            en: "We started because buying here was a leap of faith",
            bn: "আমরা শুরু করেছিলাম কারণ এখানে কেনা ছিল একটি বিশ্বাসের ব্যাপার"
          },
          {
            key: "about.story.lead",
            label: "Lead",
            type: "textarea",
            hint: "Short introductory paragraph (2-3 lines). Keep text balanced.",
            en: "Zoom Property was built by people who had bought property in Dhaka themselves, and knew how little of it could be checked before the money moved.",
            bn: "জুম প্রপার্টি এমন লোকেদের দ্বারা তৈরি হয়েছিল যারা নিজেরাই ঢাকায় সম্পত্তি কিনেছিলেন এবং জানতেন যে টাকা লেনদেনের আগে এর কত সামান্যই চেক করা যায়।"
          },
          {
            key: "about.story.bodyOne",
            label: "Body One",
            type: "textarea",
            hint: "First main paragraph. Keep it around 40-50 words.",
            en: "Every listing on this site has been walked by a member of our survey team, photographed the month it went live, and had its RAJUK plan and title deed read line by line before it was published. Nothing is listed on a developer's word.",
            bn: "এই সাইটের প্রতিটি লিস্টিং আমাদের সার্ভে টিমের একজন সদস্য পরিদর্শন করেছেন, এটি লাইভ হওয়ার মাসেই ছবি তোলা হয়েছে এবং প্রকাশিত হওয়ার আগে এর রাজউক প্ল্যান ও টাইটেল ডিড লাইন বাই লাইন পড়া হয়েছে। কোনো কিছুই ডেভেলপারের কথার ওপর লিস্টিং করা হয় না।"
          },
          {
            key: "about.story.bodyTwo",
            label: "Body Two",
            type: "textarea",
            hint: "Second main paragraph. Keep it similar in length to Body One.",
            en: "That is slower than the way this market usually works. It is also the only version of the job we were willing to do — a buyer should be told what is wrong with a property by us, not by their lawyer three months later.",
            bn: "এটি এই বাজার সাধারণত যেভাবে কাজ করে তার চেয়ে ধীর। এটিই একমাত্র কাজ যা আমরা করতে ইচ্ছুক ছিলাম — একজন ক্রেতাকে আমাদেরই বলা উচিত সম্পত্তির কী ভুল আছে, তিন মাস পরে তাদের আইনজীবীর দ্বারা নয়।"
          },
          {
            key: "about.story.badge",
            label: "Badge",
            type: "text",
            hint: "Short text for the small badge under the text (e.g. 5-8 words).",
            en: "Every paper read before it is listed",
            bn: "তালিকাভুক্ত হওয়ার আগে প্রতিটি কাগজ পড়া হয়"
          },
          {
            key: "about.story.imageOne",
            label: "Image One",
            type: "image",
            hint: "Portrait image (4:3 ratio). Recommended size: 1200x900px.",
            en: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
            bn: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
          },
          {
            key: "about.story.imageTwo",
            label: "Image Two",
            type: "image",
            hint: "Square overlapping image. Recommended size: 900x900px.",
            en: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
            bn: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80"
          }
        ]
      },
      {
        id: "figures",
        label: "Figures",
        fields: [
          {
            key: "about.figuresTitle",
            label: "Title",
            type: "text",
            hint: "Short heading (4-6 words).",
            en: "The numbers behind the promise",
            bn: "প্রতিশ্রুতির পেছনের সংখ্যাগুলো"
          },
          {
            key: "about.figuresLead",
            label: "Lead",
            type: "textarea",
            hint: "Short subtitle (1-2 lines).",
            en: "Counted from our own records, not the market's.",
            bn: "বাজারের নয়, আমাদের নিজেদের রেকর্ড থেকে গণনা করা হয়েছে।"
          },
        ],
        repeatable: {
          itemPrefix: "about.stats",
          itemName: "Stat",
          addButtonText: "Add stat",
          initialCount: 4,
          defaultItems: [
            { valueEn: "4850", suffixEn: " Cr+", compactEn: "true", labelEn: "Portfolio value vetted", valueBn: "৪৮৫০", suffixBn: " কোটি+", compactBn: "true", labelBn: "পোর্টফোলিও মূল্য পরীক্ষিত" },
            { valueEn: "13312", suffixEn: "+", compactEn: "true", labelEn: "RAJUK-cleared listings", valueBn: "১৩৩১২", suffixBn: "+", compactBn: "true", labelBn: "রাজউক-অনুমোদিত লিস্টিং" },
            { valueEn: "99.4", suffixEn: "%", compactEn: "false", labelEn: "On-time handover rate", valueBn: "৯৯.৪", suffixBn: "%", compactBn: "false", labelBn: "সময়মতো হস্তান্তরের হার" },
            { valueEn: "32", suffixEn: "", compactEn: "false", labelEn: "Median days to close", valueBn: "৩২", suffixBn: "", compactBn: "false", labelBn: "ক্লোজ করার গড় দিন" }
          ],
          itemFields: [
            { suffix: "value", label: "Number Value", type: "text", hint: "Just the number (e.g. 4850 or 99)" },
            { suffix: "suffix", label: "Suffix", type: "text", hint: "e.g. Cr+ or %" },
            { suffix: "compact", label: "Format Compactly?", type: "text", hint: "Type 'true' for 4.9K, leave empty for exact." },
            { suffix: "label", label: "Label", type: "text", hint: "Short description" }
          ]
        }
      },
      {
        id: "vetting",
        label: "Vetting",
        fields: [
          {
            key: "pages.vetting.title",
            label: "Title",
            type: "text",
            hint: "Main heading. It sits alone above the photograph, so keep it to one line.",
            en: "What a listing has to pass",
            bn: "একটি লিস্টিংকে যা যা পেরোতে হয়"
          },
          {
            key: "pages.vetting.image",
            label: "Image",
            type: "image",
            hint: "Sits under the title, beside the checks. Landscape 4:3, about 1200x900px. Shown on desktop only.",
            en: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
            bn: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
          },
          {
            key: "pages.vetting.checks.0",
            label: "Check 1",
            type: "text",
            hint: "Keep it under 15 words: each check is one row, one or two lines.",
            en: "RAJUK approved plan, matched against what is actually built",
            bn: "রাজউক অনুমোদিত নকশা, বাস্তবে যা নির্মিত তার সঙ্গে মিলিয়ে দেখা"
          },
          {
            key: "pages.vetting.checks.1",
            label: "Check 2",
            type: "text",
            hint: "Keep it under 15 words: each check is one row, one or two lines.",
            en: "Title deed traced through the CS, SA, RS and BS records",
            bn: "সিএস, এসএ, আরএস ও বিএস রেকর্ড ধরে দলিলের ধারাবাহিকতা"
          },
          {
            key: "pages.vetting.checks.2",
            label: "Check 3",
            type: "text",
            hint: "Keep it under 15 words: each check is one row, one or two lines.",
            en: "Mutation in the current owner name",
            bn: "বর্তমান মালিকের নামে নামজারি"
          },
          {
            key: "pages.vetting.checks.3",
            label: "Check 4",
            type: "text",
            hint: "Keep it under 15 words: each check is one row, one or two lines.",
            en: "Non-encumbrance certificate from the sub-registry",
            bn: "সাব-রেজিস্ট্রি থেকে নির্দায় সনদ"
          },
          {
            key: "pages.vetting.checks.4",
            label: "Check 5",
            type: "text",
            hint: "Keep it under 15 words: each check is one row, one or two lines.",
            en: "Physical inspection by our surveyor, dated",
            bn: "আমাদের সার্ভেয়ারের সরেজমিন পরিদর্শন, তারিখসহ"
          },
          {
            key: "pages.vetting.checks.5",
            label: "Check 6",
            type: "text",
            hint: "Keep it under 15 words: each check is one row, one or two lines.",
            en: "Our own photography, taken the same month",
            bn: "আমাদের নিজেদের তোলা ছবি, একই মাসের"
          },
          {
            key: "pages.vetting.checks.6",
            label: "Check 7",
            type: "text",
            hint: "Keep it under 15 words: each check is one row, one or two lines.",
            en: "Asking price confirmed by the owner in writing",
            bn: "মালিকের চাওয়া দাম লিখিতভাবে নিশ্চিত"
          }
        ]
      },
      {
        id: "milestones",
        label: "Milestones",
        fields: [
          {
            key: "pages.milestones.eyebrow",
            label: "Eyebrow",
            type: "text",
            hint: "Short text.",
            en: "Our story",
            bn: "আমাদের গল্প"
          },
          {
            key: "pages.milestones.title",
            label: "Title",
            type: "text",
            hint: "Main heading.",
            en: "How we got here",
            bn: "আমরা কীভাবে এখানে এসেছি"
          }
        ],
        repeatable: {
          itemPrefix: "pages.milestones.items",
          itemName: "Milestone",
          addButtonText: "Add milestone",
          initialCount: 5,
          defaultItems: [
            { yearEn: "2018", titleEn: "Started as two agents", bodyEn: "A Gulshan desk and one promise: no listing without the deed.", yearBn: "২০১৮", titleBn: "দুজন এজেন্ট হিসেবে শুরু", bodyBn: "গুলশানে একটি ডেস্ক এবং একটি প্রতিশ্রুতি: দলিল ছাড়া কোনো লিস্টিং নয়।" },
            { yearEn: "2020", titleEn: "First legal team", bodyEn: "Brought a Bar Council lawyer in-house rather than outsourcing verification.", yearBn: "২০২০", titleBn: "প্রথম লিগ্যাল টিম", bodyBn: "ভেরিফিকেশন আউটসোর্স করার বদলে একজন বার কাউন্সিল আইনজীবীকে ইন-হাউস নিয়োগ।" },
            { yearEn: "2022", titleEn: "Construction audits", bodyEn: "Began monthly site inspections so progress figures came from us, not from developers.", yearBn: "২০২২", titleBn: "কনস্ট্রাকশন অডিট", bodyBn: "মাসিক সাইট পরিদর্শন শুরু, যাতে অগ্রগতির তথ্য ডেভেলপারদের নয়, আমাদের থেকে আসে।" },
            { yearEn: "2024", titleEn: "Non-resident desk", bodyEn: "Consular power of attorney handling for buyers who could not fly back.", yearBn: "২০২৪", titleBn: "নন-রেসিডেন্ট ডেস্ক", bodyBn: "যে ক্রেতারা দেশে ফিরতে পারেন না তাদের জন্য কনস্যুলার পাওয়ার অব অ্যাটর্নি পরিচালনা।" },
            { yearEn: "2026", titleEn: "Chattogram office", bodyEn: "Khulshi and CDA Avenue, run exactly the way Dhaka is.", yearBn: "২০২৬", titleBn: "চট্টগ্রাম অফিস", bodyBn: "খুলশী এবং সিডিএ অ্যাভিনিউ, ঠিক ঢাকার মতোই পরিচালিত।" }
          ],
          itemFields: [
            { suffix: "year", label: "Year", type: "text", hint: "4-digit year (e.g., 2024)." },
            { suffix: "title", label: "Title", type: "text", hint: "Short milestone title (e.g., 3-5 words)." },
            { suffix: "body", label: "Description", type: "textarea", hint: "Keep it under 20-25 words to avoid long scrolling." }
          ]
        }
      },
      {
        id: "gallery",
        label: "Gallery",
        fields: [
          {
            key: "gallery.eyebrow",
            label: "Eyebrow",
            type: "text",
            hint: "Short text (e.g. 2-4 words).",
            en: "Architectural photography",
            bn: "স্থাপত্য আলোকচিত্র"
          },
          {
            key: "gallery.title",
            label: "Title",
            type: "text",
            hint: "Main heading.",
            en: "Our photographs, not CGI renders",
            bn: "আমাদের তোলা ছবি, কম্পিউটারের নকশা নয়"
          },
          {
            key: "gallery.description",
            label: "Description",
            type: "textarea",
            hint: "Short paragraph (approx. 10-20 words).",
            en: "Click any photograph for the full-screen pinch-and-zoom viewer.",
            bn: "যেকোনো ছবিতে ক্লিক করলে পূর্ণ পর্দায় জুম করে দেখা যাবে।"
          }
        ],
        repeatable: {
          itemPrefix: "gallery.images",
          itemName: "Image",
          addButtonText: "Add image",
          initialCount: 6,
          itemFields: [
            { suffix: "src", label: "Image URL", type: "image", hint: "Landscape photo recommended." },
            { suffix: "alt", label: "Alt Text", type: "text", hint: "Short description for screen readers." },
            { suffix: "caption", label: "Caption", type: "text", hint: "Text shown under the image." }
          ]
        }
      }
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
            { suffix: "icon", label: "Icon", type: "icon" },
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
      {
        id: "contact-details",
        label: "Contact details",
        fields: [
          {
            key: "contact.channels.call",
            label: "Card 1 — Label",
            type: "text",
            groupHeader: "Call the desk",
            hint: "The small grey line above the number.",
            en: "Call the desk",
            bn: "সরাসরি ফোন"
          },
          {
            key: "contact.details.phone",
            label: "Phone number",
            type: "text",
            hint: "Written the way it is read: +880 1958 253301. The dialler strips the spaces itself.",
            en: "+880 1958 253301",
            bn: "+880 1958 253301"
          },
          {
            key: "contact.channels.callNote",
            label: "Card 1 — Note",
            type: "text",
            hint: "The line under the number. Opening hours, usually.",
            en: "Sat–Thu, 9am – 8pm BST",
            bn: "শনি–বৃহস্পতি, সকাল ৯টা – রাত ৮টা"
          },
          {
            key: "contact.channels.whatsapp",
            label: "Card 2 — Label",
            type: "text",
            groupHeader: "WhatsApp",
            hint: "The small grey line above the number.",
            en: "WhatsApp",
            bn: "হোয়াটসঅ্যাপ"
          },
          {
            key: "contact.details.whatsapp",
            label: "WhatsApp number",
            type: "text",
            hint: "Can differ from the phone number if WhatsApp is on another line.",
            en: "+880 1958 253301",
            bn: "+880 1958 253301"
          },
          {
            key: "contact.channels.whatsappNote",
            label: "Card 2 — Note",
            type: "text",
            hint: "The line under the number.",
            en: "Best for photos and documents",
            bn: "ছবি ও কাগজপত্র পাঠাতে সবচেয়ে ভালো"
          },
          {
            key: "contact.channels.email",
            label: "Card 3 — Label",
            type: "text",
            groupHeader: "Email",
            hint: "The small grey line above the address.",
            en: "Email",
            bn: "ইমেইল"
          },
          {
            key: "contact.details.email",
            label: "Email address",
            type: "text",
            hint: "Opens the visitor's mail app. One address only.",
            en: "concierge@zoomproperty.com",
            bn: "concierge@zoomproperty.com"
          },
          {
            key: "contact.channels.emailNote",
            label: "Card 3 — Note",
            type: "text",
            hint: "The line under the address.",
            en: "Replies within one business hour",
            bn: "এক কর্মঘণ্টার মধ্যে উত্তর"
          },
          {
            key: "contact.offices",
            label: "Offices heading",
            type: "text",
            groupHeader: "Offices",
            hint: "The heading on the box under the three cards.",
            en: "Offices",
            bn: "অফিস"
          },
          {
            key: "contact.dhaka",
            label: "Office 1 — City",
            type: "text",
            en: "Dhaka",
            bn: "ঢাকা"
          },
          {
            key: "contact.details.dhakaAddress",
            label: "Office 1 — Address",
            type: "textarea",
            hint: "Also shown in the footer.",
            en: "House 42, Road 11, Block D, Banani & Gulshan Avenue, Dhaka",
            bn: "হাউস ৪২, রোড ১১, ব্লক ডি, বনানী ও গুলশান অ্যাভিনিউ, ঢাকা"
          },
          {
            key: "contact.chattogram",
            label: "Office 2 — City",
            type: "text",
            en: "Chattogram",
            bn: "চট্টগ্রাম"
          },
          {
            key: "contact.details.chattogramAddress",
            label: "Office 2 — Address",
            type: "textarea",
            en: "CDA Avenue, GEC Circle & Khulshi",
            bn: "সিডিএ অ্যাভিনিউ, জিইসি মোড় ও খুলশী"
          }
        ]
      },
      {
        id: "contact-social",
        label: "Social links",
        fields: [],
        repeatable: {
          itemPrefix: "contact.social",
          itemName: "Social link",
          addButtonText: "+ Add social link",
          initialCount: 6,
          titleSuffix: "label",
          itemFields: [
            {
              suffix: "icon",
              label: "Icon",
              type: "icon",
              hint: "A Font Awesome class, e.g. fa-brands fa-facebook-f. Any free icon works \u2014 search fontawesome.com and copy the class.",
            },
            {
              suffix: "href",
              label: "Link",
              type: "url",
              hint: "The full address, starting with https://",
            },
            {
              suffix: "label",
              label: "Name",
              type: "text",
              hint: "Read out by screen readers and shown on hover. Left blank, the site uses the site's own address.",
            },
          ],
          defaultItems: [
            { labelEn: "Facebook", labelBn: "Facebook", iconEn: "fa-brands fa-facebook-f", hrefEn: "https://facebook.com" },
            { labelEn: "Instagram", labelBn: "Instagram", iconEn: "fa-brands fa-instagram", hrefEn: "https://instagram.com" },
            { labelEn: "X", labelBn: "X", iconEn: "fa-brands fa-x-twitter", hrefEn: "https://x.com" },
            { labelEn: "LinkedIn", labelBn: "LinkedIn", iconEn: "fa-brands fa-linkedin-in", hrefEn: "https://linkedin.com" },
            { labelEn: "YouTube", labelBn: "YouTube", iconEn: "fa-brands fa-youtube", hrefEn: "https://youtube.com" },
            { labelEn: "WhatsApp", labelBn: "WhatsApp", iconEn: "fa-brands fa-whatsapp", hrefEn: "https://wa.me/8801958253301" },
          ],
        },
      },
    ],
  },
];

/** Page by its id, for the route to resolve `/cms/:pageId`. */
export const cmsPageById = (id?: string) => cmsPages.find((p) => p.id === id);

/** The storage key for one field in one language. */
export const cmsStorageKey = (key: string, lang: "en" | "bn") =>
  `${key}.${lang}`;
