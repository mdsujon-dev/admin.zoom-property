import { Avatar, Button } from "antd";
import dayjs from "dayjs";
import {
  BadgeCheck,
  BadgeDollarSign,
  Briefcase,
  CalendarCheck,
  CalendarClock,
  IdCard,
  Mail,
  MapPin,
  Pencil,
  Phone,
  CalendarOff,
  Shield,
  StickyNote,
  User,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import PageHeader from "../../components/Common/PageHeader";
import PageMeta from "../../components/Common/PageMeta";
import PermissionGate from "../../components/Common/PermissionGate";
import {
  Field,
  FieldGrid,
  Panel,
  Pill,
  TabBar,
} from "../../components/Details/DetailKit";
import {
  PanelSkeleton,
  TabBarSkeleton,
} from "../../components/Skeleton/DetailKitSkeletons";
import IdCardModal from "../../components/shared/IdCardModal";
import RecordHistory from "../../components/shared/RecordHistory";
import { Money } from "../../components/shared/Money";
import { useGetUserByIdQuery } from "../../redux/features/user/userApi";
import EditEmployeeAccountModal from "../../components/modal/employee/EditEmployeeAccountModal";
import EditPayModal from "../../components/modal/employee/EditPayModal";
import EditAddressModal from "../../components/modal/shared/EditAddressModal";

/**
 * One employee's page.
 *
 * There was not one. Employee Management was a list and an edit dialog, so
 * everything about a person — their role, their register, their card — had to
 * be reached from a row menu, and two of those three had nowhere to be reached
 * from at all. A person is a thing the office looks at; they should have a page.
 *
 * Agents are not here. They have their own profile under Academics → Agent,
 * where the teaching lives; this is the office staff.
 */
/** Spelled out, because "wed" on a profile reads as a typo. */
const WEEKDAY_LABEL: Record<string, string> = {
  sun: "Sunday",
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
};

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  /*
   * Opens on the tab the link asked for.
   *
   * The accounts screen sends people here to do one thing — take a fee, pay a
   * salary — and dropping them on the overview makes them hunt for the tab they
   * were already heading to. Read once, as the initial value: after that the
   * tabs belong to the person clicking them, not to a stale address bar.
   */
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get("tab") || "overview");
  const [cardOpen, setCardOpen] = useState(false);
  // Edited section by section, the way the client and agent pages are:
  // correcting one thing should not mean walking a whole form.
  const [editAccount, setEditAccount] = useState(false);
  const [editPay, setEditPay] = useState(false);
  const [editAddress, setEditAddress] = useState(false);

  const { data: employee, isLoading } = useGetUserByIdQuery(id as string, {
    skip: !id,
  });

  if (isLoading || !employee) {
    return (
      <div>
        <PageHeader
          title="Employee"
          breadcrumbs={[
            { title: "Dashboard", path: "/" },
            { title: "Employee Management" },
            { title: "Employees", path: "/employees" },
            { title: "Details" },
          ]}
        />
        <div className="mb-4 h-40 animate-pulse rounded-xl bg-secondary-100" />
        <TabBarSkeleton />
        <PanelSkeleton />
      </div>
    );
  }

  const roleLabel = employee.role
    ? String(employee.role).toUpperCase().replace(/_/g, " ")
    : "—";

  /** What the card prints, read off the profile it belongs to. */
  const cardPerson = {
    name: employee.name,
    code: employee.email,
    role: employee.designationId?.name || roleLabel,
    audience: "employee" as const,
    photo: employee.profilePhoto,
    phone: employee.phone,
    email: employee.email,
    group: roleLabel,
    groupLabel: "ROLE",
    department: employee.designationId?.name,
    departmentLabel: "DESIGNATION",
    joinedOn: employee.createdAt,
  };

  const overview = (
    <div className="grid items-start gap-4 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <Panel
          title="Account"
          icon={User}
          action={
            <PermissionGate module="Employees" action="Update">
              <Button
                type="text"
                size="small"
                icon={<Pencil className="h-4 w-4" />}
                onClick={() => setEditAccount(true)}
              >
                Edit
              </Button>
            </PermissionGate>
          }
        >
          <FieldGrid>
            <Field label="Name" icon={User}>
              {employee.name}
            </Field>
            <Field label="Email" icon={Mail}>
              {employee.email}
            </Field>
            <Field label="Phone" icon={Phone}>
              {employee.phone}
            </Field>
            <Field label="Role" icon={Shield}>
              {roleLabel}
            </Field>
            <Field label="Designation" icon={Briefcase}>
              {employee.designationId?.name}
            </Field>
            <Field label="Permission set" icon={BadgeCheck}>
              {employee.roleId?.role}
            </Field>
            {/* Their own week. Said in full rather than as "fri, sat", and
                named as the company's when they have none of their own —
                a blank here reads as "nobody has decided", which is the one
                thing it does not mean. */}
            <Field label="Weekly off" icon={CalendarOff}>
              {employee.weekendDays?.length
                ? employee.weekendDays.map((d: string) => WEEKDAY_LABEL[d] || d).join(", ")
                : "Company default (Friday)"}
            </Field>
            <Field label="Notes" className="col-span-full" icon={StickyNote}>
              {employee.note}
            </Field>
          </FieldGrid>
        </Panel>
        {/* The address, in the same structured shape a client's is kept in —
            a single free-text line cannot be searched, sorted, or printed onto
            a form that asks for a district. */}
        <Panel
          title="Address"
          icon={MapPin}
          action={
            <PermissionGate module="Employees" action="Update">
              <Button
                type="text"
                size="small"
                icon={<Pencil className="h-4 w-4" />}
                onClick={() => setEditAddress(true)}
              >
                Edit
              </Button>
            </PermissionGate>
          }
        >
          <FieldGrid>
            <Field label="Present address" className="col-span-full" icon={MapPin}>
              {[
                employee.presentDetailedAddress,
                employee.presentCity,
                employee.presentPoliceStation,
                employee.presentPostOffice,
                employee.presentDistrict,
                employee.presentDivision,
                employee.presentPostalCode
                  ? `(${employee.presentPostalCode})`
                  : null,
              ]
                .filter(Boolean)
                .join(", ") || null}
            </Field>
            <Field label="Permanent address" className="col-span-full" icon={MapPin}>
              {[
                employee.permanentDetailedAddress,
                employee.permanentCity,
                employee.permanentPoliceStation,
                employee.permanentPostOffice,
                employee.permanentDistrict,
                employee.permanentDivision,
                employee.permanentPostalCode
                  ? `(${employee.permanentPostalCode})`
                  : null,
              ]
                .filter(Boolean)
                .join(", ")}
            </Field>
          </FieldGrid>
        </Panel>
      </div>

      <div className="space-y-4">
        {/* The arrangement, not the payments — those are on the Salary tab.
            Without this the agreed figure had nowhere to be entered, and the
            Salary tab could only ever say "Not set". */}
        <Panel
          title="Pay"
          icon={BadgeDollarSign}
          action={
            <PermissionGate module="Employees" action="Update">
              <Button
                type="text"
                size="small"
                icon={<Pencil className="h-4 w-4" />}
                onClick={() => setEditPay(true)}
              >
                Edit
              </Button>
            </PermissionGate>
          }
        >
          <FieldGrid cols={2}>
            <Field label="Agreed salary" icon={BadgeDollarSign}>
              {employee.salary ? <Money value={employee.salary} /> : null}
            </Field>
            <Field label="Paid" icon={CalendarClock}>
              <span className="capitalize">
                {String(employee.salaryType || "monthly").replace("-", " ")}
              </span>
            </Field>
          </FieldGrid>
        </Panel>

        <Panel title="Record" icon={IdCard}>
          <div className="space-y-4">
            <Field label="Status">
              <Pill tone={employee.isActive ? "green" : "neutral"}>
                {employee.isActive ? "Active" : "Inactive"}
              </Pill>
            </Field>
            <Field label="Last login" icon={CalendarClock}>
              {employee.lastLogin
                ? dayjs(employee.lastLogin).format("DD MMM YYYY, h:mm A")
                : "Never signed in"}
            </Field>
            <Field label="Account created" icon={CalendarCheck}>
              {employee.createdAt
                ? dayjs(employee.createdAt).format("DD MMM YYYY")
                : null}
            </Field>
            {/* Says so plainly rather than leaving it to be discovered when
                they cannot sign in. */}
            {employee.isPasswordChange === false && (
              <Field label="Password">
                <Pill tone="amber">Still on the issued password</Pill>
              </Field>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );

  return (
    <div>
      <PageMeta
        title={`${employee.name} - Zoom Property Admin`}
        description="Employee details."
        canonicalUrl={`${window.location.origin}/employees/view/${id}`}
        noindex
      />

      <PageHeader
        title="Employee Details"
        breadcrumbs={[
          { title: "Dashboard", path: "/" },
          { title: "Employee Management" },
          { title: "Employees", path: "/employees" },
          { title: employee.name },
        ]}
      />

      {/* The head, with the face on it — the office recognises staff by
          photograph long before it reads an email address. */}
      <div className="mb-4 rounded-xl border border-secondary-100 bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,.04)]">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar
            src={employee.profilePhoto || "/assets/default_image.png"}
            size={64}
            className="shrink-0 bg-primary-500 text-xl font-semibold text-white"
          >
            {employee.name?.charAt(0)?.toUpperCase()}
          </Avatar>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold text-secondary-900 sm:text-xl">
              {employee.name}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-secondary-500">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-secondary-400" />
                {employee.email}
              </span>
              {employee.phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-secondary-400" />
                  {employee.phone}
                </span>
              )}
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <Pill tone={employee.isActive ? "green" : "neutral"}>
                {employee.isActive ? "Active" : "Inactive"}
              </Pill>
              <Pill tone="blue">{roleLabel}</Pill>
              {employee.designationId?.name && (
                <Pill>{employee.designationId.name}</Pill>
              )}
            </div>
          </div>

          <PermissionGate module="Employees" action="Update">
            <Button
              type="primary"
              icon={<Pencil className="h-4 w-4" />}
              onClick={() => navigate("/employees")}
            >
              Edit
            </Button>
          </PermissionGate>
        </div>
      </div>

      <TabBar
        active={tab}
        onChange={setTab}
        tabs={[
          { key: "overview", label: "Overview", icon: User },
          { key: "idcard", label: "ID Card", icon: IdCard },
          { key: "history", label: "History", icon: CalendarClock },
        ]}
      />

      {tab === "overview" && overview}

      {tab === "idcard" && (
        <div className="max-w-2xl">
          <Panel
            title="ID card"
            subtitle="Printed at 54 × 86 mm, the standard card"
            icon={IdCard}
          >
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="primary"
                icon={<IdCard className="h-4 w-4" />}
                onClick={() => setCardOpen(true)}
              >
                View &amp; print card
              </Button>
              <span className="text-xs text-secondary-400">
                Drawn by the same renderer that prints it.
              </span>
            </div>
          </Panel>
        </div>
      )}

      {tab === "history" && (
        <RecordHistory entity="User" id={String(employee._id)} />
      )}

      <EditAddressModal
        record={employee}
        open={editAddress}
        onClose={() => setEditAddress(false)}
      />

      <EditEmployeeAccountModal
        employee={employee}
        open={editAccount}
        onClose={() => setEditAccount(false)}
      />
      <EditPayModal
        person={employee}
        open={editPay}
        onClose={() => setEditPay(false)}
      />

      <IdCardModal
        person={cardOpen ? cardPerson : null}
        onClose={() => setCardOpen(false)}
      />
    </div>
  );
};

export default EmployeeDetails;
