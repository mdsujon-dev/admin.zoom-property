import PageHeader from "../../components/Common/PageHeader";
import PageMeta from "../../components/Common/PageMeta";
import EmployeeForm from "./EmployeeForm";

const CreateEmployee = () => (
  <div>
    <PageMeta
      title="Add Employee - Zoom Property Admin"
      description="Add an office staff member and their HR file."
      noindex
    />
    <PageHeader
      title="Add Employee"
      subtitle="An employee ID is generated automatically once the record is saved"
      breadcrumbs={[
        { title: "Dashboard", path: "/" },
        { title: "Employee Management" },
        { title: "Employees", path: "/employees" },
        { title: "Add Employee" },
      ]}
    />
    <EmployeeForm mode="create" />
  </div>
);

export default CreateEmployee;
