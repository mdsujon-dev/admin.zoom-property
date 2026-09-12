import {
  AlertTriangle,
  Bath,
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  FileText,
  Handshake,
  Home,
  Inbox,
  Info,
  LayoutTemplate,
  MapPin,
  MessageSquareQuote,
  Newspaper,
  Phone,
  PanelsTopLeft,
  ScrollText,
  Shield,
  Star,
  Video,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";
import {
  ActionLogsIcon,
  DashboardIcon,
  MediaIcon,
  SettingsIcon,
} from "../../../Icons/Index";
import { RouteItem } from "../../../types/sidebarType";

const sidebarMenuRoutes: RouteItem[] = [
  {
    label: "Dashboard",
    address: "/",
    icon: DashboardIcon,
    section: "Main",
  },
  {
    label: "Listings",
    icon: Home,
    section: "System",
    submenus: [
      {
        label: "Properties",
        address: "/properties",
        module: "Properties",
        icon: Home,
      },
      {
        label: "Projects",
        address: "/projects",
        module: "Projects",
        icon: Building2,
      },
      {
        label: "Areas",
        address: "/areas",
        module: "Areas",
        icon: MapPin,
      },
      {
        label: "Property Types",
        address: "/settings/property-types",
        module: "Properties",
        icon: Building2,
      },
      {
        label: "Amenities",
        address: "/settings/amenities",
        module: "Properties",
        icon: Bath,
      },
    ],
  },
  {
    label: "Content",
    icon: Newspaper,
    section: "System",
    submenus: [
      {
        label: "Blog",
        address: "/blog",
        module: "Blog",
        icon: FileText,
      },
      {
        label: "Blog Categories",
        address: "/blog/categories",
        module: "Blog",
        icon: FileText,
      },
      {
        label: "Blog Comments",
        address: "/blog/comments",
        module: "Blog",
        icon: MessageSquareQuote,
      },
    ],
  },
  {
    label: "Reviews",
    icon: Star,
    address: "/reviews",
    module: "Reviews",
    section: "System",
  },
  {
    label: "Landowners",
    icon: Handshake,
    address: "/landowners",
    module: "Landowners",
    section: "System",
  },
  {
    label: "Showcase Videos",
    icon: Video,
    address: "/showcase-videos",
    module: "Showcase Videos",
    section: "System",
  },
  {
    label: "CMS",
    icon: LayoutTemplate,
    section: "System",
    module: "Dynamic Content",
    submenus: [
      { label: "Home", address: "/cms/home", module: "Dynamic Content", icon: Home },
      {
        label: "Properties",
        address: "/cms/properties",
        module: "Dynamic Content",
        icon: Building2,
      },
      {
        label: "Projects",
        address: "/cms/projects",
        module: "Dynamic Content",
        icon: Building2,
      },
      { label: "Areas", address: "/cms/areas", module: "Dynamic Content", icon: MapPin },
      { label: "About", address: "/cms/about", module: "Dynamic Content", icon: Info },
      { label: "Agents", address: "/cms/agents", module: "Dynamic Content", icon: UserRound },
      {
        label: "Landowners",
        address: "/cms/landowners",
        module: "Dynamic Content",
        icon: Handshake,
      },
      { label: "Blog", address: "/cms/blog", module: "Dynamic Content", icon: FileText },
      {
        label: "Reviews",
        address: "/cms/reviews",
        module: "Dynamic Content",
        icon: Star,
      },

      {
        label: "Contact",
        address: "/cms/contact",
        module: "Dynamic Content",
        icon: Phone,
      },
      {
        label: "Legal",
        address: "/cms/legal",
        module: "Dynamic Content",
        icon: ScrollText,
      },
      {
        label: "Header & Footer",
        address: "/cms/headerFooter",
        module: "Dynamic Content",
        icon: PanelsTopLeft,
      },
    ],
  },
  {
    label: "Enquiries",
    icon: Inbox,
    section: "System",
    submenus: [
      {
        label: "Contact Messages",
        address: "/enquiries/contact-messages",
        module: "Contact Messages",
        icon: MessageSquareQuote,
      },
      {
        label: "Quotation Requests",
        address: "/enquiries/quotation-requests",
        module: "Quotation Requests",
        icon: ScrollText,
      },
      {
        label: "Notifications",
        address: "/notifications",
        module: "Notifications",
        icon: Bell,
      },
    ],
  },
  {
    label: "HR",
    icon: Users,
    section: "System",
    submenus: [
      {
        label: "Employees",
        address: "/employees",
        module: "Employees",
        icon: UserRound,
      },
      {
        label: "Agents",
        address: "/employees/agents",
        module: "Agents",
        icon: UserRound,
      },
      {
        label: "Designations",
        address: "/employees/designations",
        icon: Briefcase,
        module: "Designations",
      },
    ],
  },
  {
    label: "Logs",
    icon: ActionLogsIcon,
    section: "System",
    submenus: [
      {
        label: "Action Logs",
        address: "/logs/actions",
        icon: ScrollText,
        module: "Action Logs",
      },
      {
        label: "Error Logs",
        address: "/logs/errors",
        icon: AlertTriangle,
        module: "Error Logs",
      },
    ],
  },
  {
    label: "Settings",
    icon: SettingsIcon,
    section: "System",
    submenus: [
      { label: "Profile", address: "/settings/profile", icon: UserRound },
      {
        label: "Roles",
        address: "/settings/roles",
        icon: Shield,
        module: "Roles",
      },
      {
        label: "Media Library",
        address: "/settings/media-library",
        icon: MediaIcon,
        module: "Media Library",
      },
      {
        label: "Media Bin",
        address: "/settings/media-bin",
        icon: Trash2,
        module: "Media Bin",
      },
    ],
  },
  {
    label: "User Guide",
    icon: BookOpen,
    address: "/user-guide",
    section: "System",
  },
];

export default sidebarMenuRoutes;
