import { Avatar, Button, Space, Tooltip, Typography } from "antd";
import { format, formatDistanceToNow } from "date-fns";
import React from "react";
import {
  FiBriefcase,
  FiCalendar,
  FiClock,
  FiCopy,
  FiDollarSign,
  FiExternalLink,
  FiGlobe,
  FiHelpCircle,
  FiMail,
  FiMessageSquare,
  FiPhone,
} from "react-icons/fi";
import { toast } from "react-toastify";
import AntModal from "../../shared/AntModal";

const { Text } = Typography;

export interface QuotationRequestMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  site_url?: string;
  company_name?: string;
  delivery_time?: string;
  start_date?: string;
  service: string;
  budget: string;
  message: string;
  help?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Generate up to two initials from a full name for the avatar fallback.
const getInitials = (name?: string) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Best-effort clipboard copy with a toast confirmation; falls back to a hidden
// textarea for older browsers / non-secure contexts where navigator.clipboard
// isn't available.
const copyToClipboard = async (value: string, label: string) => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
    } else {
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    toast.success(`${label} copied`);
  } catch {
    toast.error(`Failed to copy ${label.toLowerCase()}`);
  }
};

const SectionTitle: React.FC<{
  icon: React.ReactNode;
  title: string;
}> = ({ icon, title }) => (
  <div className="flex items-center gap-2 mb-3">
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 text-primary">
      {icon}
    </span>
    <h4 className="text-[15px] font-semibold text-gray-900 m-0">{title}</h4>
  </div>
);

const StatTile: React.FC<{
  icon: React.ReactNode;
  label: string;
  value?: React.ReactNode;
  accent: string;
}> = ({ icon, label, value, accent }) => (
  <div className="rounded-xl border border-gray-200 p-3 flex items-start gap-3 bg-white">
    <span
      className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${accent}`}
    >
      {icon}
    </span>
    <div className="min-w-0">
      <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
        {label}
      </div>
      <div className="text-sm font-semibold text-gray-900 break-words">
        {value || <span className="text-gray-400 font-normal">—</span>}
      </div>
    </div>
  </div>
);

const ContactRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value?: string;
  href?: string;
  copyLabel: string;
}> = ({ icon, label, value, href, copyLabel }) => {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 text-gray-600 shrink-0">
          {icon}
        </span>
        <div className="min-w-0">
          <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            {label}
          </div>
          {href ? (
            <a
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-sm font-medium text-primary hover:underline truncate block max-w-[360px]"
              title={value}
            >
              {value}
            </a>
          ) : (
            <span
              className="text-sm font-medium text-gray-900 truncate block max-w-[360px]"
              title={value}
            >
              {value}
            </span>
          )}
        </div>
      </div>
      <Tooltip title={`Copy ${copyLabel.toLowerCase()}`}>
        <Button
          size="small"
          type="text"
          icon={<FiCopy />}
          onClick={() => copyToClipboard(value, copyLabel)}
        />
      </Tooltip>
    </div>
  );
};

const ViewQuotationModal = ({
  open,
  setOpen,
  data,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  data: QuotationRequestMessage | null;
}) => {
  return (
    <AntModal
      open={open}
      setOpen={setOpen}
      title="Quotation Request Details"
      width={1100}
    >
      {data && (
        <div className="space-y-5">
          {/* Hero — avatar, name, headline meta and submission time */}
          <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-primary/5 via-white to-blue-50 p-5">
            <div className="flex flex-wrap items-start gap-4">
              <Avatar
                size={56}
                className="!bg-primary !text-white !font-semibold shrink-0"
              >
                {getInitials(data.name)}
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="m-0 text-lg font-semibold text-gray-900 truncate">
                    {data.name}
                  </h3>
                  {data.company_name && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-full px-2 py-0.5">
                      <FiBriefcase className="text-gray-400" />
                      {data.company_name}
                    </span>
                  )}
                </div>
                <div className="mt-1 text-sm text-gray-600 truncate">
                  Wants{" "}
                  <span className="font-medium text-gray-900">
                    {data.service}
                  </span>
                  {data.budget && (
                    <>
                      {" "}
                      ·{" "}
                      <span className="font-medium text-emerald-700">
                        {data.budget}
                      </span>
                    </>
                  )}
                </div>
                {data.createdAt && (
                  <Tooltip
                    title={format(
                      new Date(data.createdAt),
                      "EEEE, MMMM dd, yyyy 'at' HH:mm"
                    )}
                  >
                    <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-gray-500 cursor-help">
                      <FiClock />
                      {formatDistanceToNow(new Date(data.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>

          {/* Project Details — colored stat tiles in a responsive grid */}
          <div>
            <SectionTitle icon={<FiBriefcase />} title="Project Details" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <StatTile
                icon={<FiBriefcase className="text-blue-600" />}
                label="Service"
                value={data.service}
                accent="bg-blue-50"
              />
              <StatTile
                icon={<FiDollarSign className="text-emerald-600" />}
                label="Budget"
                value={data.budget}
                accent="bg-emerald-50"
              />
              <StatTile
                icon={<FiClock className="text-amber-600" />}
                label="Delivery Time"
                value={data.delivery_time}
                accent="bg-amber-50"
              />
              <StatTile
                icon={<FiCalendar className="text-purple-600" />}
                label="Start Date"
                value={data.start_date}
                accent="bg-purple-50"
              />
            </div>
          </div>

          {/* Contact — copyable rows with mailto/tel/external links */}
          <div>
            <SectionTitle icon={<FiMail />} title="Contact" />
            <div className="rounded-xl border border-gray-200 bg-white px-4">
              <ContactRow
                icon={<FiMail />}
                label="Email"
                value={data.email}
                href={`mailto:${data.email}`}
                copyLabel="Email"
              />
              <ContactRow
                icon={<FiPhone />}
                label="Phone"
                value={data.phone}
                href={data.phone ? `tel:${data.phone}` : undefined}
                copyLabel="Phone"
              />
              <ContactRow
                icon={<FiGlobe />}
                label="Website"
                value={data.site_url}
                href={data.site_url}
                copyLabel="Website"
              />
            </div>
          </div>

          {/* Message — quote-style callout with a left accent */}
          <div>
            <SectionTitle icon={<FiMessageSquare />} title="Message" />
            <div className="relative rounded-xl border border-gray-200 bg-gray-50 p-4 pl-5">
              <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r bg-primary/60" />
              <Text className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {data.message || (
                  <span className="text-gray-400 italic">
                    No message provided
                  </span>
                )}
              </Text>
            </div>
          </div>

          {/* Additional Help — only when present */}
          {data.help && (
            <div>
              <SectionTitle
                icon={<FiHelpCircle />}
                title="Additional Help Required"
              />
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                <Text className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {data.help}
                </Text>
              </div>
            </div>
          )}

          {/* Footer actions — Close, copy contact, reply via email */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t">
            <Button
              icon={<FiCopy />}
              onClick={() =>
                copyToClipboard(
                  [
                    data.name,
                    data.email,
                    data.phone,
                    data.company_name,
                    data.site_url,
                  ]
                    .filter(Boolean)
                    .join("\n"),
                  "Contact details"
                )
              }
            >
              Copy Contact
            </Button>
            <Space>
              <Button onClick={() => setOpen(false)}>Close</Button>
              <Button
                type="primary"
                icon={<FiExternalLink />}
                href={`mailto:${data.email}?subject=Re: Quotation Request - ${data.service}`}
              >
                Reply via Email
              </Button>
            </Space>
          </div>
        </div>
      )}
    </AntModal>
  );
};

export default ViewQuotationModal;
