import { Button, DatePicker, Divider, Form, Input, Select, Tooltip } from "antd";
import dayjs from "dayjs";
import { CircleHelp } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import AddressFields from "../../components/Form/AddressFields";
import NumberInput from "../../components/Form/NumberInput";
import { toNumber } from "../../components/Form/toNumber";
import UploadImage from "../../components/shared/UploadImage";
import { useGetDesignationsQuery } from "../../redux/features/designation/designationApi";
import {
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
} from "../../redux/features/employee/employeeApi";
import { useGetRolesQuery } from "../../redux/features/role/roleApi";

interface Props {
  mode: "create" | "update";
  /** The employee being edited, account and profile already merged. */
  employee?: any;
}

const GENDERS = ["Male", "Female", "Other"].map((g) => ({
  value: g,
  label: g,
}));

const MARITAL = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
];

/** A wage, reckoned the way office pay actually is. */
const SALARY_TYPES = [
  { value: "monthly", label: "Monthly" },
  { value: "daily", label: "Daily" },
  { value: "yearly", label: "Yearly" },
];

const EMPLOYMENT = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
];

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
  (b) => ({ value: b, label: b }),
);

/** Sunday-first, the order a week is read in and the order the server keys on. */
const WEEKDAYS = [
  { value: "sun", label: "Sunday" },
  { value: "mon", label: "Monday" },
  { value: "tue", label: "Tuesday" },
  { value: "wed", label: "Wednesday" },
  { value: "thu", label: "Thursday" },
  { value: "fri", label: "Friday" },
  { value: "sat", label: "Saturday" },
];

/**
 * The whole employee, on one page.
 *
 * This was a five-field dialog — name, email, role, designation, phone — while
 * the record behind it already held a joining date, a salary, an NID, an
 * emergency contact, a structured address and a place for their papers. None of
 * it was reachable, so none of it was ever filled in.
 *
 * A page rather than a modal for the same reason the agent's is one: this is
 * thirty fields across five sections, and a dialog that scrolls inside a
 * scrolling page is a form people give up on halfway down.
 */
const EmployeeForm = ({ mode, employee }: Props) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const isEdit = mode === "update";

  const [createEmployee, { isLoading: creating }] = useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: updating }] = useUpdateEmployeeMutation();

  const { data: rolesData, isFetching: rolesLoading } = useGetRolesQuery({
    limit: 100,
  });
  // Employee designations only — an agent's belong to the agent form, and
  // the client one is issued by the system and never listed.
  const { data: designationsData, isFetching: designationsLoading } =
    useGetDesignationsQuery({ scope: "employee" });

  // SUPER_ADMIN is protected and can never be handed out from here.
  const roles = (rolesData?.result || [])
    .filter(
      (r: any) =>
        r.isActive !== false && r.role?.toUpperCase() !== "SUPER_ADMIN",
    )
    .map((r: any) => ({ value: r._id, label: r.role }));

  const designations = (designationsData?.data || [])
    .filter((d: any) => d.is_active !== false)
    .map((d: any) => ({ value: d._id, label: d.name }));

  useEffect(() => {
    if (!employee) return;
    const p = employee.profile || {};
    form.setFieldsValue({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      roleId: employee.roleId?._id || employee.roleId,
      designationId: employee.designationId?._id || employee.designationId,
      profilePhoto: employee.profilePhoto,
      photoUrl: employee.profilePhoto,
      weekendDays: employee.weekendDays || [],
      note: employee.note,

      dateOfBirth: p.dateOfBirth ? dayjs(p.dateOfBirth) : undefined,
      gender: p.gender,
      bloodGroup: p.bloodGroup,
      fatherName: p.fatherName,
      motherName: p.motherName,
      maritalStatus: p.maritalStatus,

      employmentType: p.employmentType,
      joiningDate: p.joiningDate ? dayjs(p.joiningDate) : undefined,
      resignDate: p.resignDate ? dayjs(p.resignDate) : undefined,
      salary: p.salary,
      salaryType: p.salaryType || "monthly",
      status: p.status,

      nidNumber: p.nidNumber,
      emergencyContactName: p.emergencyContactName,
      emergencyContactPhone: p.emergencyContactPhone,
      documents: (p.documents || []).map((d: any) => d._id ?? d),
      documentUrls: (p.documents || []).map((d: any) => d.url).filter(Boolean),

      presentDivision: employee.presentDivision,
      presentDistrict: employee.presentDistrict,
      presentCity: employee.presentCity,
      presentPoliceStation: employee.presentPoliceStation,
      presentPostOffice: employee.presentPostOffice,
      presentPostalCode: employee.presentPostalCode,
      presentDetailedAddress: employee.presentDetailedAddress,
      permanentDivision: employee.permanentDivision,
      permanentDistrict: employee.permanentDistrict,
      permanentCity: employee.permanentCity,
      permanentPoliceStation: employee.permanentPoliceStation,
      permanentPostOffice: employee.permanentPostOffice,
      permanentPostalCode: employee.permanentPostalCode,
      permanentDetailedAddress: employee.permanentDetailedAddress,
    });
  }, [employee, form]);

  const onFinish = async (values: any) => {
    // Preview-only helpers that `UploadImage` keeps beside the real ids.
    const { photoUrl, documentUrls, confirmPassword, ...rest } = values;
    void photoUrl;
    void documentUrls;
    void confirmPassword;

    const body: Record<string, any> = {
      ...rest,
      dateOfBirth: values.dateOfBirth
        ? values.dateOfBirth.toISOString()
        : undefined,
      joiningDate: values.joiningDate
        ? values.joiningDate.toISOString()
        : undefined,
      resignDate: values.resignDate
        ? values.resignDate.toISOString()
        : undefined,
      salary:
        values.salary === undefined || values.salary === null || values.salary === ""
          ? undefined
          : Number(values.salary),
    };

    try {
      if (isEdit) {
        await updateEmployee({ id: employee._id, data: body }).unwrap();
        toast.success("Employee updated");
        navigate(`/employees/view/${employee._id}`);
      } else {
        const created: any = await createEmployee(body).unwrap();
        toast.success("Employee added");
        navigate(created?._id ? `/employees/view/${created._id}` : "/employees");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Could not save the employee");
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      requiredMark={false}
      className="rounded-xl border border-secondary-100 bg-white p-5"
    >
      <Divider orientation="left" orientationMargin={0}>
        <span className="text-base font-semibold">Account</span>
      </Divider>

      <div className="grid gap-x-4 md:grid-cols-3">
        <Form.Item
          label="Full Name"
          name="name"
          rules={[{ required: true, message: "Name is required" }]}
        >
          <Input placeholder="Enter full name" />
        </Form.Item>

        {/* Required, and not only because the schema says so: it is the login,
            and an account without one cannot be signed into or recovered. */}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Enter a valid email address" },
          ]}
        >
          <Input placeholder="name@example.com" />
        </Form.Item>

        <Form.Item
          label="Mobile"
          name="phone"
          rules={[{ required: true, message: "Mobile number is required" }]}
        >
          <Input placeholder="01XXXXXXXXX" />
        </Form.Item>

        {!isEdit && (
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Password is required" },
              { min: 6, message: "At least 6 characters" },
            ]}
          >
            <Input.Password placeholder="At least 6 characters" />
          </Form.Item>
        )}

        <Form.Item
          label="Permission Role"
          name="roleId"
          rules={[{ required: true, message: "Pick a role" }]}
        >
          <Select
            showSearch
            optionFilterProp="label"
            loading={rolesLoading}
            options={roles}
            placeholder="Select permission role"
          />
        </Form.Item>

        <Form.Item label="Designation" name="designationId">
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            loading={designationsLoading}
            options={designations}
            placeholder="Select designation"
          />
        </Form.Item>
      </div>

      <Divider orientation="left" orientationMargin={0}>
        <span className="text-base font-semibold">Personal</span>
      </Divider>

      <div className="grid gap-x-4 md:grid-cols-3">
        <Form.Item label="Father's Name" name="fatherName">
          <Input placeholder="Enter father's name" />
        </Form.Item>
        <Form.Item label="Mother's Name" name="motherName">
          <Input placeholder="Enter mother's name" />
        </Form.Item>
        <Form.Item label="Date of Birth" name="dateOfBirth">
          <DatePicker
            className="w-full"
            format="DD-MM-YYYY"
            placeholder="Select date of birth"
            // Nobody was born tomorrow, and a stray year in the future is the
            // commonest typo in a date box.
            disabledDate={(d) => d && d.isAfter(dayjs())}
          />
        </Form.Item>
        <Form.Item label="Gender" name="gender">
          <Select allowClear options={GENDERS} placeholder="Select gender" />
        </Form.Item>
        <Form.Item label="Blood Group" name="bloodGroup">
          <Select
            allowClear
            options={BLOOD_GROUPS}
            placeholder="Select blood group"
          />
        </Form.Item>
        <Form.Item label="Marital Status" name="maritalStatus">
          <Select allowClear options={MARITAL} placeholder="Select status" />
        </Form.Item>
        <Form.Item label="NID Number" name="nidNumber">
          <Input placeholder="Enter NID number" />
        </Form.Item>
        <Form.Item label="Emergency Contact Name" name="emergencyContactName">
          <Input placeholder="Who to call in an emergency" />
        </Form.Item>
        <Form.Item label="Emergency Contact Mobile" name="emergencyContactPhone">
          <Input placeholder="01XXXXXXXXX" />
        </Form.Item>
      </div>

      <Divider orientation="left" orientationMargin={0}>
        <span className="text-base font-semibold">Employment</span>
      </Divider>

      <div className="grid gap-x-4 md:grid-cols-3">
        <Form.Item label="Employment Type" name="employmentType">
          <Select options={EMPLOYMENT} placeholder="Select employment type" />
        </Form.Item>
        <Form.Item label="Joining Date" name="joiningDate">
          <DatePicker
            className="w-full"
            format="DD-MM-YYYY"
            placeholder="Select joining date"
          />
        </Form.Item>
        {/* The figure and its unit sit together: "25000" on its own is read as
            a month, and a daily wage entered beside a monthly label is the sort
            of mistake that only surfaces on payday. */}
        <Form.Item label="Salary (৳)" name="salary" normalize={toNumber}>
          <NumberInput placeholder="e.g. 25000" min={0} />
        </Form.Item>
        <Form.Item label="Salary Type" name="salaryType">
          <Select options={SALARY_TYPES} placeholder="Select salary type" />
        </Form.Item>

        {isEdit && (
          <>
            <Form.Item label="Status" name="status">
              <Select
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                  { value: "resigned", label: "Resigned" },
                ]}
                placeholder="Select status"
              />
            </Form.Item>
            <Form.Item label="Resign Date" name="resignDate">
              <DatePicker
                className="w-full"
                format="DD-MM-YYYY"
                placeholder="Only if they have left"
              />
            </Form.Item>
          </>
        )}

        {/* Their own days off. The office does not all take the same one, and
            held against a single company week every exception reads as a
            month of absences. */}
        <Form.Item
          label="Weekly Off Days"
          name="weekendDays"
          extra="Leave empty to follow the company's week (Friday)"
        >
          <Select
            mode="multiple"
            allowClear
            options={WEEKDAYS}
            placeholder="Company default"
          />
        </Form.Item>
      </div>

      <AddressFields form={form} />

      <Divider orientation="left" orientationMargin={0}>
        <span className="text-base font-semibold">Photo, Papers & Notes</span>
      </Divider>

      <div className="mb-4 flex flex-wrap gap-8">
        <div>
          <p className="mb-2 text-sm font-medium text-secondary-700">Photo</p>
          <UploadImage
            form={form}
            fieldPath="photoUrl"
            idFieldPath="profilePhoto"
            mode="single"
          />
        </div>
        <div>
          <p className="mb-2 flex items-center gap-1 text-sm font-medium text-secondary-700">
            Documents
            <Tooltip title="NID, appointment letter, education papers — add as many as needed">
              <CircleHelp
                className="h-3.5 w-3.5 text-secondary-400"
                aria-hidden="true"
              />
            </Tooltip>
          </p>
          <UploadImage
            form={form}
            fieldPath="documentUrls"
            idFieldPath="documents"
            mode="multiple"
          />
        </div>
      </div>

      <Form.Item label="Notes" name="note">
        <Input.TextArea
          rows={2}
          placeholder="Anything the office needs to remember (optional)"
        />
      </Form.Item>

      <div className="flex justify-end gap-2">
        <Button onClick={() => navigate(-1)}>Cancel</Button>
        <Button
          type="primary"
          onClick={() => form.submit()}
          loading={creating || updating}
        >
          {isEdit ? "Save Changes" : "Add Employee"}
        </Button>
      </div>
    </Form>
  );
};

export default EmployeeForm;
