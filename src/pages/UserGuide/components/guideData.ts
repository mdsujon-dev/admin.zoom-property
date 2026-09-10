import {
  Activity,
  Award,
  BadgeDollarSign,
  BookOpen,
  CalendarCheck,
  CalendarRange,
  ClipboardList,
  Download,
  GraduationCap,
  IdCard,
  Image as ImageIcon,
  LayoutDashboard,
  LogIn,
  Megaphone,
  Presentation,
  Receipt,
  Settings as SettingsIcon,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import React from "react";
import { primary, secondary } from "../../../theme/brand";

/**
 * The guide's contents.
 *
 * Written against what the software actually does rather than what an admin
 * panel usually does: the old guide had eight topics — login, dashboard, staff,
 * roles, money, media, settings, logs — and not one of them mentioned a
 * client, a project, a register or a receipt, which is the entire job this
 * software exists to do.
 *
 * Every section names where the screen is, so somebody reading on a phone can
 * find it on the machine in front of them, and what permission it needs, so a
 * receptionist reading about Roles knows before clicking that it will not be
 * there for them.
 */

/** The bands the contents list is grouped under, in reading order. */
export const GUIDE_GROUPS = [
  "Getting started",
  "Setting up",
  "Clients & fees",
  "Every day",
  "Money",
  "Records & reports",
  "Administration",
] as const;

export type GuideGroup = (typeof GUIDE_GROUPS)[number];

/**
 * One accent per band, not per topic.
 *
 * Steps of the brand ramp rather than seven unrelated hues: the bands are
 * sections of one guide, and a rainbow made them look like seven different
 * products.
 */
export const GROUP_ACCENT: Record<GuideGroup, string> = {
  "Getting started": primary[800],
  "Setting up": primary[500],
  "Clients & fees": secondary[800],
  "Every day": primary[300],
  Money: primary[950],
  "Records & reports": secondary[500],
  Administration: secondary[300],
};

export interface GuideSectionData {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  group: GuideGroup;
  title: string;
  /** Where the screen lives, as the menu reads it. */
  where?: string;
  /** The permission module that gates it, if any. */
  module?: string;
  intro: string;
  steps: string[];
  /** Something that makes the job easier. */
  tip?: string;
  /** Something that catches people out. Worth more than a tip. */
  note?: string;
}

export const GUIDE_SECTIONS: GuideSectionData[] = [
  /* ── Getting started ───────────────────────────────────────────────────── */
  {
    id: "login",
    icon: LogIn,
    group: "Getting started",
    title: "Signing in",
    intro:
      "Every person has their own sign-in. What you can see and change comes from the role attached to it, so two people on the same screen may not see the same buttons.",
    steps: [
      "Open the admin address. If you are not signed in you land on the Login page.",
      "Enter your email and password and press Login.",
      "Forgotten the password? Choose Forgot Password, enter your email, and use the six-digit code sent to your inbox to set a new one.",
      "Change your own password later under Settings › Profile.",
    ],
    note: "Accounts are created for you under Employee Management — there is no public sign-up, and there is not meant to be.",
  },
  {
    id: "dashboard",
    icon: LayoutDashboard,
    group: "Getting started",
    title: "The dashboard",
    where: "Dashboard",
    intro:
      "What is happening today, read from live data — today's classes, this week's timetable, money in and out, and anything waiting on somebody.",
    steps: [
      "Agents see their own dashboard: today's classes, the week, their routine, registers still to take, clients falling behind, and their pay.",
      "Office staff see the company's: admissions, collections, dues, projects running, and the day's attendance.",
      "Cards with a filter — the week, the routine, clients falling behind — remember nothing between visits; set them each time you look.",
      "Everything on it is a link. Click a class to open its register, a client to open their profile.",
    ],
    tip: "If a number looks wrong, open what it links to rather than guessing — the dashboard is only reading what the modules hold.",
  },

  /* ── Setting up ────────────────────────────────────────────────────────── */
  {
    id: "company",
    icon: SettingsIcon,
    group: "Setting up",
    title: "Company details",
    where: "Settings › Company",
    module: "Settings",
    intro:
      "The name, address and contact that go on receipts, ID cards, printed forms and exported files. Fill this in first — it is on every piece of paper the software produces.",
    steps: [
      "Enter the company name exactly as it should be printed.",
      "Add the full address, phone, email and website.",
      "Upload the logo. It becomes the mark on the letterhead and the watermark behind printed reports.",
      "Save. Documents pick it up the next time they are opened.",
    ],
    note: "Left empty, printed documents fall back to the built-in company details rather than printing blanks.",
  },
  {
    id: "listings",
    icon: BookOpen,
    group: "Setting up",
    title: "Listings",
    where: "Academics › Listings",
    module: "Listings",
    intro:
      "The syllabus, not a class. A listing is what is taught — its fee, its length, its outline. Projects are the actual groups that sit it.",
    steps: [
      "Add a listing with a name, a code, the fee and the duration.",
      "Set the pass mark and the attendance bar. Receipts and the clients-falling-behind list both read these.",
      "Build the outline: modules, and the milestones under each. This is what the agent teaches to and what a client sees as progress.",
      "Mark a listing inactive when you stop offering it — the projects that already ran keep their history.",
    ],
    tip: "Set the attendance bar on the listing once and every project of it inherits it, unless a project overrides it.",
  },
  {
    id: "projects",
    icon: CalendarRange,
    group: "Setting up",
    title: "Projects & the timetable",
    where: "Academics › Projects",
    module: "Projects",
    intro:
      "A project is one running group of a listing: its dates, its room, its agents, its seats, and the days and times it meets.",
    steps: [
      "Create the project: listing, code, start and end dates, capacity and room.",
      "Assign one or more agents. A project can have several, and an agent can be on several projects.",
      "Build the timetable day by day. Pick a day, then add every class on that day — a project can meet more than once in an afternoon.",
      "Save. The status moves from upcoming to running to completed on its own dates.",
    ],
    note: "A day can only be added once, and two classes on one day cannot overlap — the form will refuse to save either. Add the second class under the day you already made, not as a new day.",
  },
  {
    id: "agent",
    icon: Presentation,
    group: "Setting up",
    title: "Agents",
    where: "Academics › Agent",
    module: "Agent",
    intro:
      "Who teaches, what they are cleared to teach, and what they are paid. Give an agent a sign-in and they get their own portal.",
    steps: [
      "Add the agent: name, contact, NID, address, qualification and joining date.",
      "Set the designation, employment type and the listings they are cleared to teach. Leave the listings empty to allow any.",
      "Record the agreed pay, then pay it month by month from their Payments tab — each payment prints a salary voucher.",
      "Their page also carries their attendance, their projects and their ID card.",
    ],
    tip: "Edit any part of an agent's page in place: each panel on the Overview has its own Edit, so correcting a phone number does not mean reopening the whole form.",
  },
  {
    id: "id-cards",
    icon: IdCard,
    group: "Setting up",
    title: "ID card design",
    where: "Settings › ID Cards",
    module: "Settings",
    intro:
      "One design, used for every card. Choose what appears on the front, what appears on the back, and what is left off.",
    steps: [
      "Pick the colours, the logo and the background for the card.",
      "Turn each field on or off and choose which side it sits on — name, ID, listing, project, blood group, guardian, address, validity, QR code.",
      "Save, then print a card from a client's or agent's ID Card tab.",
      "Print several at once from the list by selecting rows first.",
    ],
    tip: "Anything left blank on the person's record is simply skipped on the card, so turning a field on costs nothing for the people who do not have it.",
  },
  {
    id: "receipt-design",
    icon: Award,
    group: "Setting up",
    title: "Receipt design",
    where: "Settings › Receipt Design",
    module: "Settings",
    intro:
      "The receipt template: the background, the wording and where the text sits on it.",
    steps: [
      "Choose the background artwork — the frame, seal and signature lines come with it.",
      "Set the wording and the signatory names.",
      "Preview against a real client before issuing to a project.",
    ],
    note: "Change the design before a project is issued, not after. Receipts already issued keep the design they were printed with.",
  },

  /* ── Clients & fees ───────────────────────────────────────────────────── */
  {
    id: "clients",
    icon: GraduationCap,
    group: "Clients & fees",
    title: "Admitting a client",
    where: "Academics › Clients",
    module: "Clients",
    intro:
      "One record per person, kept for as long as they are with the company. Enrolments, fees, attendance and receipts all hang off it.",
    steps: [
      "Press Add Client and fill in the form: name, photo, contact, date of birth, guardian and identity.",
      "Enter both addresses — present and permanent — choosing division and district from the lists. Tick Same as present to copy one to the other.",
      "Save. The client gets an ID automatically.",
      "Open the profile to enrol them, take a payment, print their registration form or their ID card.",
    ],
    tip: "Every panel on the profile edits in place. Use those rather than reopening the admission form to fix one field.",
  },
  {
    id: "registration-form",
    icon: ClipboardList,
    group: "Clients & fees",
    title: "Registration form",
    where: "Client profile › Registration Form",
    module: "Clients",
    intro:
      "The company's printed admission form, filled in from the client's record — the paper they sign and the office files.",
    steps: [
      "Open the client's profile and choose Registration Form.",
      "Choose whether to include the terms and conditions page.",
      "Check the preview, then Print. The browser's own dialog handles paper and Save as PDF.",
    ],
    tip: "Printing it blank for somebody to fill in by hand works too — open it on a client with little on file and the empty boxes print as boxes.",
  },
  {
    id: "enrolments",
    icon: Users,
    group: "Clients & fees",
    title: "Enrolments & fees",
    where: "Client profile › Enrolments",
    module: "Clients",
    intro:
      "Enrolling puts a client on a project and opens their fee account for that listing. A client can be on several projects at once.",
    steps: [
      "From the profile, choose Enrol and pick the listing and project. The fee is taken from the listing and can be adjusted.",
      "Record a discount if one was agreed — payable, paid and due are worked out from there.",
      "Take a payment from the Payments panel. Each one produces a numbered receipt.",
      "Transfer a client to another project of the same listing from the enrolment itself; the fees follow them.",
    ],
    note: "Seats are counted against the project's capacity, and a full project will not accept another enrolment until somebody is moved out or the capacity is raised.",
  },
  {
    id: "receipts",
    icon: Receipt,
    group: "Clients & fees",
    title: "Receipts & vouchers",
    intro:
      "Every movement of money can be printed as the document that goes with it: a money receipt, a refund voucher, a salary voucher or a payment voucher.",
    steps: [
      "From a client's payment history, press the print icon on the row.",
      "From Income & Expense, press the print icon on any row — including hand-typed entries with no client on them.",
      "From an agent's or an employee's Payments tab, print the salary voucher.",
      "The document carries the company letterhead, the amount in figures and in words, and a watermark.",
    ],
    tip: "A fee receipt also prints where the client stands afterwards — total payable, total paid, balance due — which is the question every guardian asks at the desk.",
  },

  /* ── Every day ─────────────────────────────────────────────────────────── */
  {
    id: "attendance",
    icon: CalendarCheck,
    group: "Every day",
    title: "Client attendance",
    where: "Academics › Attendance",
    module: "Attendance",
    intro:
      "One register per class, not per day. A project meeting three times on a Wednesday keeps three registers, and a client can be at one and miss another.",
    steps: [
      "Choose the project, the date and — where the project meets more than once — the class.",
      "Mark each client Present or Absent. There is no third state; leaving somebody unmarked is not the same as marking them.",
      "Save. Saving again corrects the register rather than adding a second one.",
      "The Register tab shows the whole month as a grid, one column per class, tinted by date.",
    ],
    note: "Attendance percentages feed the clients-falling-behind list and receipt eligibility, so a register left untaken quietly counts against everybody in it.",
  },
  {
    id: "staff-attendance",
    icon: UserCheck,
    group: "Every day",
    title: "Staff attendance",
    where: "Staff Attendance",
    module: "Staff Attendance",
    intro:
      "Agents are marked per class; office staff are marked per day. An agent with no class on a day is not absent — they simply were not due in.",
    steps: [
      "Open the day. Agents appear grouped, with a row for each class they are due to take.",
      "Filter by project to work through one project at a time.",
      "Mark present, late, absent or leave. Mark everyone present sets the whole sheet at once.",
      "The month view shows each person's days at a glance; a day with some classes marked and some not reads as partial.",
    ],
    note: "This register is kept by the office. Agents can read their own total in their portal but cannot change it.",
  },
  {
    id: "exams",
    icon: ClipboardList,
    group: "Every day",
    title: "Exams & results",
    where: "Academics › Exams & Results",
    module: "Exams",
    intro:
      "Set an exam against a project, enter the marks, and the result sheet and pass or fail follow from the listing's pass mark.",
    steps: [
      "Create the exam: project, title, date and total marks.",
      "Enter marks client by client on the Marks Entry screen. Partial entry is saved, so it can be done in sittings.",
      "Open the result sheet to see positions, pass and fail, and print or export it.",
    ],
    tip: "An exam sat but not yet marked shows on the agent's dashboard until the marks are in — it is the half of the job that otherwise goes quiet.",
  },
  {
    id: "notices",
    icon: Megaphone,
    group: "Every day",
    title: "Notice board",
    where: "Notice Board",
    module: "Notices",
    intro:
      "Announcements that reach clients, agents or both, in their portal and on their dashboard.",
    steps: [
      "Write the notice, choose who it is for, and set the date it should stop showing.",
      "Pin one to hold it at the top.",
      "Expired notices drop off on their own; nothing has to be deleted.",
    ],
  },

  /* ── Money ─────────────────────────────────────────────────────────────── */
  {
    id: "finance",
    icon: BadgeDollarSign,
    group: "Money",
    title: "Income & expense",
    where: "Income & Expense",
    module: "Income & Expense",
    intro:
      "The whole ledger. Fee payments and salaries arrive here on their own; anything else — rent, bills, a hall hired out — is typed in.",
    steps: [
      "Income and Expense are separate tabs, each with its own totals for the period.",
      "Press Add to record an entry by hand: amount, reason, date and payment method.",
      "Filter by date range or search the reason. The totals follow the filter.",
      "Entries can be corrected but never deleted, so the ledger stays a complete record.",
    ],
    note: "A refund is recorded as a contra-entry against the same side of the ledger rather than as its opposite, which is why a refunded fee reduces income instead of appearing as an expense.",
  },
  {
    id: "reminders",
    icon: TrendingUp,
    group: "Money",
    title: "Fee reminders",
    where: "Income & Expense › Fee Reminders",
    module: "Income & Expense",
    intro:
      "Who owes what, and a way to write to them without going through the list one at a time.",
    steps: [
      "Open the Fee Reminders tab to see every client with an outstanding balance, worst first.",
      "Narrow by project or by a minimum amount owed.",
      "Select who to write to, adjust the message, and send.",
      "Clients with no email on file are listed as skipped rather than silently dropped.",
    ],
  },
  {
    id: "salary",
    icon: BadgeDollarSign,
    group: "Money",
    title: "Paying staff",
    intro:
      "Agents and office staff are paid from their own page, and each payment books itself to the ledger as an expense.",
    steps: [
      "Open the person and go to their Payments tab.",
      "Record the payment: amount, the month it is for, and the method.",
      "Print the salary voucher from the row.",
      "If money is returned, record it as a return rather than editing the original payment.",
    ],
  },

  /* ── Records & reports ─────────────────────────────────────────────────── */
  {
    id: "receipts",
    icon: Award,
    group: "Records & reports",
    title: "Receipts",
    where: "Settings › Receipts",
    module: "Receipts",
    intro:
      "Issued against a completed enrolment, with a number that stays with the client for good.",
    steps: [
      "Open Receipts and choose the project.",
      "The list shows who is eligible — attendance above the bar and the exam passed — and who is not, with the reason.",
      "Issue to one client or to everyone eligible at once.",
      "Print or download. A reprint carries the same number as the original.",
    ],
    note: "Eligibility is read from attendance and results at the moment of issuing, so take the last register before issuing rather than after.",
  },
  {
    id: "reports",
    icon: TrendingUp,
    group: "Records & reports",
    title: "Reports",
    where: "Reports",
    module: "Reports",
    intro:
      "The questions that get asked at the end of a month, answered without building anything: admissions, collections, dues, attendance and project progress.",
    steps: [
      "Pick the report and the period.",
      "Read it on screen, then export it if it has to leave the building.",
    ],
  },
  {
    id: "exporting",
    icon: Download,
    group: "Records & reports",
    title: "Exporting & printing",
    intro:
      "Every list in the panel exports the same three ways, from the same button, and they all come out on the company's letterhead.",
    steps: [
      "Press Export above any list and choose Excel, PDF or Word.",
      "PDF asks for the paper size and the orientation before it writes, so it matches the printer it is going to.",
      "The file carries whatever is on screen — filter the list first and the export follows it.",
      "Excel gets the full record, including columns too wide to put on a page; the printed formats get what a person actually reads.",
    ],
    tip: "A long ledger closes each page with what it came to and opens the next with that figure carried in, so any page can be checked on its own.",
  },
  {
    id: "media",
    icon: ImageIcon,
    group: "Records & reports",
    title: "Media library",
    where: "Media Library",
    module: "Media",
    intro:
      "Every uploaded photo and file in one place — client photos, logos, notice attachments.",
    steps: [
      "Upload here, or from the field that needs the file.",
      "Search by name and reuse a file rather than uploading it twice.",
      "Deleted files go to Settings › Media Bin, where they can be restored.",
    ],
  },

  /* ── Administration ────────────────────────────────────────────────────── */
  {
    id: "employees",
    icon: Users,
    group: "Administration",
    title: "Employees",
    where: "Employee Management › Employees",
    module: "Employees",
    intro:
      "The office staff — the people who sign in. Agents are added under Agent instead.",
    steps: [
      "Add the employee with their contact details, designation, address and photo.",
      "Their email and password are the sign-in.",
      "Assign a role, which is what decides where they can go.",
      "Their page carries their attendance, their pay and their ID card.",
    ],
  },
  {
    id: "roles",
    icon: ShieldCheck,
    group: "Administration",
    title: "Roles & permissions",
    where: "Employee Management › Roles",
    module: "Roles",
    intro:
      "A role is a set of permissions; a person is given a role. Nothing is granted person by person, so what a receptionist can do is one decision, not twenty.",
    steps: [
      "Create the role and give it a name people will recognise.",
      "Grant per module: read, create, update, delete.",
      "Assign the role to the people who need it.",
      "Changes take effect the next time that person loads a page.",
    ],
    note: "A menu item that is not permitted is not shown rather than shown and refused — so somebody reporting a missing screen usually needs a permission, not a fix.",
  },
  {
    id: "designations",
    icon: Users,
    group: "Administration",
    title: "Designations",
    where: "Employee Management › Designations",
    module: "Designations",
    intro:
      "The job titles offered in the staff and agent forms, kept as a list so they stay consistent.",
    steps: [
      "Add a designation and mark whether it is for agents, for office staff, or both.",
      "Retire one by marking it inactive — the people already holding it keep it.",
    ],
  },
  {
    id: "settings",
    icon: SettingsIcon,
    group: "Administration",
    title: "The rest of settings",
    where: "Settings",
    module: "Settings",
    intro:
      "Profile, academic defaults, countries, and the media bin.",
    steps: [
      "Profile — your own name, photo and password.",
      "Academic — the defaults new listings and projects start from.",
      "Countries — the list offered in address and contact fields.",
      "Media Bin — deleted files, restorable until they are emptied.",
    ],
  },
  {
    id: "logs",
    icon: Activity,
    group: "Administration",
    title: "Logs",
    where: "Logs",
    module: "Logs",
    intro:
      "Who changed what, and what went wrong. Read when a figure moved and nobody remembers moving it.",
    steps: [
      "Action Logs record every create, update and delete with the person and the time.",
      "Error Logs record failures, for handing to whoever maintains the system.",
      "Both filter by date and by person, and both export.",
    ],
  },
];
