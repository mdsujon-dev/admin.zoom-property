import { Button, Form, Input, Select } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import UploadImage from "../../components/shared/UploadImage";
import { useGetDesignationsQuery } from "../../redux/features/designation/designationApi";
import {
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
} from "../../redux/features/employee/employeeApi";
import { useGetRolesQuery } from "../../redux/features/role/roleApi";

interface Props {
  mode: "create" | "update";
  employee?: any;
}

const EmployeeForm = ({ mode, employee }: Props) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const isEdit = mode === "update";

  const [createEmployee, { isLoading: creating }] = useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: updating }] = useUpdateEmployeeMutation();

  const { data: rolesData, isFetching: rolesLoading } = useGetRolesQuery({
    limit: 100,
  });

  const { data: designationsData, isFetching: designationsLoading } =
    useGetDesignationsQuery({ scope: "employee" });

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
    form.setFieldsValue({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      roleId: employee.roleId?._id || employee.roleId,
      designationId: employee.designationId?._id || employee.designationId,
      profilePhoto: employee.profilePhoto,
      photoUrl: employee.profilePhoto,
    });
  }, [employee, form]);

  const onFinish = async (values: any) => {
    const { photoUrl, confirmPassword, ...rest } = values;
    void photoUrl;
    void confirmPassword;

    const body: Record<string, any> = {
      ...rest,
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
      className="rounded-xl border border-secondary-100 bg-white p-5 space-y-4"
    >
      <div className="grid gap-x-4 gap-y-2 md:grid-cols-3">
        <Form.Item
          label="Full Name *"
          name="name"
          rules={[{ required: true, message: "Name is required" }]}
        >
          <Input placeholder="Enter full name" />
        </Form.Item>

        <Form.Item
          label="Email *"
          name="email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Enter a valid email address" },
          ]}
        >
          <Input placeholder="name@example.com" />
        </Form.Item>

        <Form.Item
          label="Mobile *"
          name="phone"
          rules={[{ required: true, message: "Mobile number is required" }]}
        >
          <Input placeholder="01XXXXXXXXX" />
        </Form.Item>

        {!isEdit && (
          <Form.Item
            label="Password *"
            name="password"
            rules={[
              { required: true, message: "Password is required" },
              { min: 6, message: "At least 6 characters" },
            ]}
          >
            <Input.Password placeholder="........" />
          </Form.Item>
        )}

        <Form.Item
          label="Permission Role *"
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

      <div className="pt-2">
        <p className="mb-2 text-sm font-medium text-secondary-700">Photo</p>
        <UploadImage
          form={form}
          fieldPath="photoUrl"
          idFieldPath="profilePhoto"
          mode="single"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
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
