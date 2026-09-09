import { Button, Form } from "antd";
import {
  CalendarCheck,
  ClipboardList,
  FileText,
  Frown,
  Handshake,
  HelpCircle,
  PartyPopper,
  RefreshCw,
  Send,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSendQuotationEmailMutation } from "../../../redux/features/inquiries/inquiriesApi";
import { FormInput } from "../../Form/FormInput";
import { FormTextarea } from "../../Form/FormTextarea";
import AntModal from "../../shared/AntModal";
import { QuotationRequestMessage } from "./ViewQuotationModal";

interface SendQuotationEmailModalProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  recipient: QuotationRequestMessage | null;
}

interface FormValues {
  subject: string;
  body: string;
}

interface EmailTemplate {
  label: string;
  description: string;
  subject: string;
  body: string;
  icon: React.ReactNode;
  accent: string;
}

// 10 production-ready templates, ordered by typical sales-cycle stage.
// Placeholders ({{name}}, {{service}}, {{budget}}, {{company}}) are
// substituted from the recipient before the form is populated.
const presetTemplates: EmailTemplate[] = [
  {
    label: "Acknowledgment",
    description: "Confirm we received their request",
    icon: <Sparkles className="w-4 h-4" />,
    accent: "bg-blue-50 text-blue-600 ring-blue-200",
    subject: "We received your request for {{service}}",
    body: `<p>Hi {{name}},</p>
<p>Thank you for reaching out to Zoom Property about <strong>{{service}}</strong>. Your request has landed safely with our team and we appreciate you considering us for this work.</p>
<p>One of our specialists will review the details you shared and get back to you within <strong>one business day</strong> with thoughtful next steps — typically a short discovery call so we can scope the work properly and give you an accurate estimate.</p>
<p>If anything is urgent or has changed since you submitted the form, just reply to this email and we'll prioritize it.</p>
<p>Talk soon,<br/>The Zoom Property Team</p>`,
  },
  {
    label: "Discovery call",
    description: "Invite to a scoping call before quoting",
    icon: <CalendarCheck className="w-4 h-4" />,
    accent: "bg-indigo-50 text-indigo-600 ring-indigo-200",
    subject: "A 20-minute call about your {{service}} project?",
    body: `<p>Hi {{name}},</p>
<p>Thanks for your interest in our <strong>{{service}}</strong> services. To put together a quote that genuinely reflects your needs (rather than a generic price), we'd love to learn a bit more about your goals, audience and timeline.</p>
<p>Would you be open to a <strong>20-minute discovery call</strong> this week? On the call we'll:</p>
<ul>
<li>Walk through your current situation and what success looks like for you</li>
<li>Surface any constraints we should design around</li>
<li>Agree on the right scope, milestones and a realistic budget range</li>
</ul>
<p>Please share two or three time windows that work for you (with your time zone) and we'll send over a calendar invite.</p>
<p>Looking forward to it,<br/>The Zoom Property Team</p>`,
  },
  {
    label: "Initial quote",
    description: "Send a ballpark estimate with assumptions",
    icon: <FileText className="w-4 h-4" />,
    accent: "bg-emerald-50 text-emerald-600 ring-emerald-200",
    subject: "Your initial estimate for {{service}}",
    body: `<p>Hi {{name}},</p>
<p>Thanks again for sharing the details of your <strong>{{service}}</strong> project. Based on what you described, here's an initial estimate to help you plan.</p>
<p><strong>Indicative range:</strong> {{budget}} (subject to refinement after the discovery call)<br/>
<strong>Typical delivery window:</strong> 4 – 8 weeks depending on scope and feedback cycles<br/>
<strong>Engagement model:</strong> Fixed-scope milestones, with weekly progress demos</p>
<p><strong>Key assumptions behind this estimate:</strong></p>
<ul>
<li>You will provide content, brand assets and access to required systems on time</li>
<li>One primary point of contact on your side for approvals and feedback</li>
<li>Up to two rounds of revisions per milestone are included</li>
</ul>
<p>Happy to revise either number once we've talked through the details. Would Tuesday or Wednesday work for a short call?</p>
<p>Best regards,<br/>The Zoom Property Team</p>`,
  },
  {
    label: "Detailed proposal",
    description: "Share a full proposal document",
    icon: <ClipboardList className="w-4 h-4" />,
    accent: "bg-violet-50 text-violet-600 ring-violet-200",
    subject: "Your {{service}} proposal from Zoom Property",
    body: `<p>Hi {{name}},</p>
<p>It was great learning about your project. Attached is our detailed proposal for <strong>{{service}}</strong>, prepared specifically for {{company}}.</p>
<p><strong>What's inside:</strong></p>
<ul>
<li>Project understanding and objectives</li>
<li>Scope of work, broken down into milestones</li>
<li>Timeline with key deliverables</li>
<li>Investment breakdown and payment schedule</li>
<li>Team, technology stack and ways of working</li>
</ul>
<p>Please take your time to review and write down any questions — I'd suggest scheduling a 30-minute walkthrough once you've had a first pass. That way we can clarify anything quickly and adjust the proposal if needed.</p>
<p>Looking forward to your thoughts.</p>
<p>Warm regards,<br/>The Zoom Property Team</p>`,
  },
  {
    label: "Need more info",
    description: "Ask clarifying questions before quoting",
    icon: <HelpCircle className="w-4 h-4" />,
    accent: "bg-amber-50 text-amber-600 ring-amber-200",
    subject: "A few quick questions about your {{service}} request",
    body: `<p>Hi {{name}},</p>
<p>Thanks for reaching out about <strong>{{service}}</strong>. To prepare a meaningful estimate (rather than a vague range), I'd love a little more clarity on a few points:</p>
<ol>
<li><strong>Audience &amp; goal:</strong> Who is this primarily for, and what should it help them do?</li>
<li><strong>Scope:</strong> Is this a brand-new build, a redesign of something existing, or an extension of a current system?</li>
<li><strong>Integrations:</strong> Any third-party tools, APIs or platforms it needs to talk to?</li>
<li><strong>Timeline:</strong> Is there a launch date or business deadline driving this?</li>
<li><strong>Budget guidance:</strong> Even a rough range helps us recommend the right approach.</li>
</ol>
<p>Feel free to answer inline — or jump on a 15-minute call if it's easier. Either way, I'll come back with a clear plan and price.</p>
<p>Thanks!<br/>The Zoom Property Team</p>`,
  },
  {
    label: "Revised proposal",
    description: "Updated quote after feedback",
    icon: <RefreshCw className="w-4 h-4" />,
    accent: "bg-cyan-50 text-cyan-600 ring-cyan-200",
    subject: "Revised proposal for {{service}} — incorporating your feedback",
    body: `<p>Hi {{name}},</p>
<p>Thanks for the candid feedback on our first proposal. We've taken your input on board and revised the plan for <strong>{{service}}</strong>. Here's a summary of what changed:</p>
<ul>
<li><strong>Scope:</strong> tightened the deliverables to focus on what matters most to you in Phase 1</li>
<li><strong>Timeline:</strong> compressed by aligning workstreams in parallel where it's safe to do so</li>
<li><strong>Investment:</strong> adjusted to match the updated scope, with optional add-ons clearly separated</li>
</ul>
<p>The full updated document is attached. Whenever you've had a chance to review, let me know if you'd like to talk it through or move directly to a kickoff date.</p>
<p>Thanks again for working with us through this — it almost always results in a stronger project.</p>
<p>Warm regards,<br/>The Zoom Property Team</p>`,
  },
  {
    label: "Friendly follow-up",
    description: "Polite nudge after no reply",
    icon: <Send className="w-4 h-4" />,
    accent: "bg-sky-50 text-sky-600 ring-sky-200",
    subject: "Following up on your {{service}} request",
    body: `<p>Hi {{name}},</p>
<p>Just floating this one back to the top of your inbox — I wanted to make sure my previous note about your <strong>{{service}}</strong> project didn't get buried.</p>
<p>No pressure either way; I know how busy things get. If now isn't the right moment, just let me know and I'll happily check back in a few weeks. If you have any questions or want to schedule a quick call, I'm one reply away.</p>
<p>Have a great week,<br/>The Zoom Property Team</p>`,
  },
  {
    label: "Closing the deal",
    description: "Gentle push to confirm before deadline",
    icon: <TrendingUp className="w-4 h-4" />,
    accent: "bg-orange-50 text-orange-600 ring-orange-200",
    subject: "Reserving capacity for your {{service}} project",
    body: `<p>Hi {{name}},</p>
<p>Hope you're doing well. I wanted to give you a quick heads-up on our current schedule.</p>
<p>Our team has limited bandwidth for new <strong>{{service}}</strong> projects this quarter, and based on the proposal we shared, your slot is currently <strong>held provisionally</strong>. If you're ready to move forward, the earliest kickoff date we can guarantee is in the next two weeks.</p>
<p>If you need more time, that's completely fine — just let me know your latest thinking so we can plan accordingly (or revisit the timeline together). If you'd like to confirm, simply reply with a "yes" and we'll send over the agreement to sign.</p>
<p>Either way, I'd love to hear where you've landed.</p>
<p>Best regards,<br/>The Zoom Property Team</p>`,
  },
  {
    label: "Project kickoff",
    description: "Confirm engagement and next steps",
    icon: <PartyPopper className="w-4 h-4" />,
    accent: "bg-pink-50 text-pink-600 ring-pink-200",
    subject: "Welcome aboard — kicking off your {{service}} project",
    body: `<p>Hi {{name}},</p>
<p>It's official — we're thrilled to be partnering with you on your <strong>{{service}}</strong> project! Thank you for trusting Zoom Property with this work; we'll do everything we can to make it a great experience.</p>
<p><strong>Here's what happens next:</strong></p>
<ol>
<li>Within 24 hours you'll receive a calendar invite for the <strong>kickoff call</strong> with your project lead and the core delivery team</li>
<li>We'll share a shared workspace (Slack/Notion/Drive — your preference) for day-to-day collaboration</li>
<li>You'll get a short onboarding checklist covering accesses, brand assets and key contacts</li>
<li>By end of week one you'll have a confirmed milestone plan and the first deliverables in motion</li>
</ol>
<p>If anything comes up before the kickoff, I'm directly reachable on this email. Excited to get started!</p>
<p>Warm regards,<br/>The Zoom Property Team</p>`,
  },
  {
    label: "Polite decline",
    description: "Decline gracefully and leave the door open",
    icon: <Frown className="w-4 h-4" />,
    accent: "bg-rose-50 text-rose-600 ring-rose-200",
    subject: "Update on your {{service}} request",
    body: `<p>Hi {{name}},</p>
<p>Thank you for considering Zoom Property for your <strong>{{service}}</strong> project — and for the detail you shared, which made it easy to review properly.</p>
<p>After looking carefully at scope, timeline and our current commitments, we're not going to be the right partner for this particular engagement. We'd rather be upfront now than commit to something we can't deliver to the standard we hold ourselves to.</p>
<p>If it's helpful, I'd be glad to point you towards a couple of trusted partners who might be a better fit — just let me know. And do please keep us in mind for future work; we'd welcome the chance to collaborate when the timing aligns.</p>
<p>Wishing you a successful project,<br/>The Zoom Property Team</p>`,
  },
];

// Substitute the {{...}} placeholders with values from the selected recipient.
// Empty fields fall back to a friendly default so the message never reads
// "Hi  ," or shows an obviously empty span.
const fillPlaceholders = (
  text: string,
  recipient: QuotationRequestMessage | null
): string => {
  if (!recipient) return text;
  return text
    .replace(/\{\{name\}\}/g, recipient.name || "there")
    .replace(/\{\{service\}\}/g, recipient.service || "your project")
    .replace(/\{\{budget\}\}/g, recipient.budget || "to be confirmed")
    .replace(/\{\{company\}\}/g, recipient.company_name || "your team");
};

const SendQuotationEmailModal = ({
  open,
  setOpen,
  recipient,
}: SendQuotationEmailModalProps) => {
  const [form] = Form.useForm<FormValues>();
  const [sendEmail, { isLoading }] = useSendQuotationEmailMutation();
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      form.resetFields();
      setActiveTemplate(null);
    }
  }, [open, form]);

  const applyTemplate = (template: EmailTemplate) => {
    form.setFieldsValue({
      subject: fillPlaceholders(template.subject, recipient),
      body: fillPlaceholders(template.body, recipient),
    });
    setActiveTemplate(template.label);
  };

  const handleSubmit = async (values: FormValues) => {
    if (!recipient) return;
    try {
      const res: any = await sendEmail({
        id: recipient._id,
        subject: values.subject,
        body: values.body,
      }).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Email sent successfully");
        setOpen(false);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send email");
    }
  };

  return (
    <AntModal
      open={open}
      setOpen={setOpen}
      title="Send email to lead"
      width="95%"
      style={{ top: 20, paddingBottom: 0 }}
      footer={
        <div className="flex justify-end gap-2 pt-3 px-4 pb-4 sticky bottom-0 bg-white border-t">
          <Button disabled={isLoading} onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            type="primary"
            loading={isLoading}
            icon={<Send className="w-4 h-4" />}
            onClick={() => form.submit()}
          >
            Send Email
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Recipient summary */}
        {recipient && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">
              Sending to
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
                {recipient.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {recipient.name}
                  {recipient.company_name && (
                    <span className="text-gray-500 font-normal">
                      {" "}
                      · {recipient.company_name}
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {recipient.email} · interested in {recipient.service}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Template picker — visual cards */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
              Pick a template
            </p>
            {activeTemplate && (
              <button
                type="button"
                onClick={() => {
                  form.resetFields();
                  setActiveTemplate(null);
                }}
                disabled={isLoading}
                className="text-xs font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                Clear template
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {presetTemplates.map((tpl) => {
              const isActive = activeTemplate === tpl.label;
              return (
                <button
                  key={tpl.label}
                  type="button"
                  disabled={isLoading}
                  onClick={() => applyTemplate(tpl)}
                  className={`group relative text-left p-3 rounded-lg border transition-all duration-200 disabled:opacity-50 ${
                    isActive
                      ? "border-primary bg-primary/5 ring-2 ring-primary/15"
                      : "border-gray-200 hover:border-primary/40 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ring-1 shrink-0 ${tpl.accent}`}
                    >
                      {tpl.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-semibold leading-tight truncate ${
                          isActive ? "text-primary" : "text-gray-900"
                        }`}
                      >
                        {tpl.label}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-snug line-clamp-2">
                        {tpl.description}
                      </p>
                    </div>
                  </div>
                  {isActive && (
                    <span className="absolute top-2 right-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
            <Handshake className="w-3 h-3" />
            Templates auto-fill the recipient's name, service and budget — feel
            free to edit before sending.
          </p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-2"
        >
          <FormInput
            label="Subject"
            name="subject"
            rules={[
              { required: true, message: "Please enter a subject" },
              { max: 200, message: "Subject too long" },
            ]}
            placeholder="e.g. Your initial estimate for Web Development"
          />

          <FormTextarea
            label="Message (HTML supported)"
            name="body"
            rows={18}
            rules={[{ required: true, message: "Please write your message" }]}
          />
        </Form>
      </div>
    </AntModal>
  );
};

export default SendQuotationEmailModal;
