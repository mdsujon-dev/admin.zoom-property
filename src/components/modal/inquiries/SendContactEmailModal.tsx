import { Button, Form } from "antd";
import {
  CalendarCheck,
  ChevronRight,
  CircleCheck,
  HeartHandshake,
  HelpCircle,
  Info,
  LifeBuoy,
  RefreshCw,
  Send,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSendContactEmailMutation } from "../../../redux/features/inquiries/inquiriesApi";
import { FormInput } from "../../Form/FormInput";
import { FormTextarea } from "../../Form/FormTextarea";
import AntModal from "../../shared/AntModal";

// Local-only — Contact Messages page already owns its own type, but the
// modal only needs the four fields below, so we keep a minimal shape here
// to avoid cross-file coupling.
export interface ContactMessageRecipient {
  _id: string;
  name: string;
  email: string;
  subject: string;
}

interface SendContactEmailModalProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  recipient: ContactMessageRecipient | null;
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

// 10 templates tuned for general contact-form replies (support, partnerships,
// careers, cooperation, etc). Subject lines reuse the customer's original
// subject via {{subject}} so it threads neatly in their inbox.
const presetTemplates: EmailTemplate[] = [
  {
    label: "Acknowledgment",
    description: "Confirm we received their message",
    icon: <Sparkles className="w-4 h-4" />,
    accent: "bg-blue-50 text-blue-600 ring-blue-200",
    subject: "Re: {{subject}}",
    body: `<p>Hi {{name}},</p>
<p>Thank you for reaching out to Zoom Property — your message has landed safely with our team.</p>
<p>We've logged your inquiry about <strong>"{{subject}}"</strong> and one of us will get back to you with a thoughtful reply within <strong>one business day</strong>. If anything is time-sensitive, just hit reply and let us know.</p>
<p>Talk soon,<br/>The Zoom Property Team</p>`,
  },
  {
    label: "Direct answer",
    description: "Provide the information they asked for",
    icon: <CircleCheck className="w-4 h-4" />,
    accent: "bg-emerald-50 text-emerald-600 ring-emerald-200",
    subject: "Re: {{subject}}",
    body: `<p>Hi {{name}},</p>
<p>Thanks for your question about <strong>"{{subject}}"</strong>. Here's the information you asked for:</p>
<p>[Write the answer here in plain language. Use short paragraphs and bullets where it helps readability.]</p>
<p>If anything is unclear or you'd like me to go deeper on any of the above, just reply to this email — happy to help further.</p>
<p>Best regards,<br/>The Zoom Property Team</p>`,
  },
  {
    label: "Need more info",
    description: "Ask clarifying questions",
    icon: <HelpCircle className="w-4 h-4" />,
    accent: "bg-amber-50 text-amber-600 ring-amber-200",
    subject: "A few quick questions about your message",
    body: `<p>Hi {{name}},</p>
<p>Thanks for getting in touch about <strong>"{{subject}}"</strong>. To give you the most useful response, could you share a little more detail on a few points?</p>
<ol>
<li>What's the outcome you're hoping for?</li>
<li>Is there a deadline or specific context we should know about?</li>
<li>Anything you've already tried or considered?</li>
</ol>
<p>As soon as we hear back we'll come back with a clear next step. Thanks for your patience.</p>
<p>Best regards,<br/>The Zoom Property Team</p>`,
  },
  {
    label: "Schedule a call",
    description: "Invite to a short call",
    icon: <CalendarCheck className="w-4 h-4" />,
    accent: "bg-indigo-50 text-indigo-600 ring-indigo-200",
    subject: "Re: {{subject}} — quick call?",
    body: `<p>Hi {{name}},</p>
<p>Thanks for reaching out about <strong>"{{subject}}"</strong>. I think a short conversation would help us help you better than back-and-forth email.</p>
<p>Would you be open to a <strong>15-20 minute call</strong> this week? Please share a couple of time windows that work for you (with your time zone) and we'll send a calendar invite.</p>
<p>Looking forward to it,<br/>The Zoom Property Team</p>`,
  },
  {
    label: "Partnership response",
    description: "Reply to a partnership / cooperation request",
    icon: <HeartHandshake className="w-4 h-4" />,
    accent: "bg-violet-50 text-violet-600 ring-violet-200",
    subject: "Re: {{subject}}",
    body: `<p>Hi {{name}},</p>
<p>Thanks for reaching out about a potential partnership with Zoom Property. We genuinely appreciate you thinking of us.</p>
<p>To explore this properly, it would help to understand a few things:</p>
<ul>
<li>A short summary of your company and what you do</li>
<li>What kind of collaboration you have in mind</li>
<li>What success would look like for both sides</li>
</ul>
<p>If easier, send through a deck or one-pager and I'll route it to the right person on our side. Looking forward to learning more.</p>
<p>Warm regards,<br/>The Zoom Property Team</p>`,
  },
  {
    label: "Routing to team",
    description: "Hand off to the right specialist",
    icon: <ChevronRight className="w-4 h-4" />,
    accent: "bg-cyan-50 text-cyan-600 ring-cyan-200",
    subject: "Re: {{subject}} — looping in the right team",
    body: `<p>Hi {{name}},</p>
<p>Thanks for getting in touch about <strong>"{{subject}}"</strong>. To make sure you get the most useful response, I'm looping in our [team name — sales / careers / partnerships / support] team who handle this directly.</p>
<p>They'll reply to this thread within the next business day. In the meantime, if there's any extra context you'd like to add, feel free to send it through and they'll have everything in one place.</p>
<p>Thanks for your patience,<br/>The Zoom Property Team</p>`,
  },
  {
    label: "Support reply",
    description: "Respond to a technical / support question",
    icon: <LifeBuoy className="w-4 h-4" />,
    accent: "bg-sky-50 text-sky-600 ring-sky-200",
    subject: "Re: {{subject}}",
    body: `<p>Hi {{name}},</p>
<p>Thanks for flagging this — sorry for any inconvenience caused. I've looked into your message about <strong>"{{subject}}"</strong>.</p>
<p><strong>What we found:</strong> [brief explanation of the issue / root cause]<br/>
<strong>What to do next:</strong> [step-by-step instructions or the action we're taking]</p>
<p>Please give that a try and let me know how it goes. If it doesn't resolve things, send a quick screenshot or screen recording and we'll dig deeper right away.</p>
<p>Thanks for your patience,<br/>The Zoom Property Team</p>`,
  },
  {
    label: "Service info",
    description: "Share services / pricing overview",
    icon: <Info className="w-4 h-4" />,
    accent: "bg-orange-50 text-orange-600 ring-orange-200",
    subject: "Re: {{subject}} — overview of how we work",
    body: `<p>Hi {{name}},</p>
<p>Thanks for your interest in Zoom Property. Here's a quick overview based on your question about <strong>"{{subject}}"</strong>:</p>
<ul>
<li><strong>What we do:</strong> [1-line summary of relevant service area]</li>
<li><strong>Typical engagements:</strong> from short discovery sprints to multi-month builds</li>
<li><strong>How we price:</strong> fixed-scope for well-defined projects, or monthly retainers for ongoing work</li>
<li><strong>Where to learn more:</strong> <a href="https://yourdomain.com">yourdomain.com</a></li>
</ul>
<p>If you'd like a tailored proposal, the easiest next step is a 20-minute call so we can scope things properly. Just reply with a few time windows and we'll set it up.</p>
<p>Best regards,<br/>The Zoom Property Team</p>`,
  },
  {
    label: "Friendly follow-up",
    description: "Polite nudge if they haven't replied",
    icon: <RefreshCw className="w-4 h-4" />,
    accent: "bg-pink-50 text-pink-600 ring-pink-200",
    subject: "Re: {{subject}} — gentle nudge",
    body: `<p>Hi {{name}},</p>
<p>Just floating this one back to the top of your inbox — wanted to make sure my previous reply about <strong>"{{subject}}"</strong> didn't get buried.</p>
<p>No pressure either way; I know how busy things get. If now isn't the right moment, just let me know and I'll happily check back in a few weeks. If you have any questions or want to schedule a quick call, I'm one reply away.</p>
<p>Have a great week,<br/>The Zoom Property Team</p>`,
  },
  {
    label: "Polite decline",
    description: "Decline gracefully when we can't help",
    icon: <XCircle className="w-4 h-4" />,
    accent: "bg-rose-50 text-rose-600 ring-rose-200",
    subject: "Re: {{subject}}",
    body: `<p>Hi {{name}},</p>
<p>Thank you for reaching out about <strong>"{{subject}}"</strong>, and for the context you shared.</p>
<p>After looking at this carefully, we're not going to be the right partner for what you're describing right now. We'd rather be upfront than commit to something we can't deliver well.</p>
<p>If it's useful, I'd be glad to point you towards a couple of trusted partners who might be a better fit — just let me know. And please do keep us in mind in the future; the timing might align differently down the line.</p>
<p>Wishing you all the best,<br/>The Zoom Property Team</p>`,
  },
];

const fillPlaceholders = (
  text: string,
  recipient: ContactMessageRecipient | null
): string => {
  if (!recipient) return text;
  return text
    .replace(/\{\{name\}\}/g, recipient.name || "there")
    .replace(/\{\{subject\}\}/g, recipient.subject || "your message");
};

const SendContactEmailModal = ({
  open,
  setOpen,
  recipient,
}: SendContactEmailModalProps) => {
  const [form] = Form.useForm<FormValues>();
  const [sendEmail, { isLoading }] = useSendContactEmailMutation();
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
      title="Reply to contact message"
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
              Replying to
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
                {recipient.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {recipient.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {recipient.email} · re: {recipient.subject}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Template picker */}
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
          <p className="text-[11px] text-gray-400 mt-2">
            Templates auto-fill the recipient's name and original subject — feel
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
            placeholder={`e.g. Re: ${recipient?.subject || "your message"}`}
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

export default SendContactEmailModal;
