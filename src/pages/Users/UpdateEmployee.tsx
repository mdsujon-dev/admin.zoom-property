import { Spin } from "antd";
import { useParams } from "react-router-dom";

import PageHeader from "../../components/Common/PageHeader";
import PageMeta from "../../components/Common/PageMeta";
import { useGetEmployeeByIdQuery } from "../../redux/features/employee/employeeApi";
import EmployeeForm from "./EmployeeForm";

const UpdateEmployee = () => {
  const { id } = useParams();
  const { data: employee, isLoading } = useGetEmployeeByIdQuery(id as string, {
    skip: !id,
  });

  return (
    <div>
      <PageMeta
        title="Edit Employee - Zoom Property Admin"
        description="Edit an office staff member and their HR file."
        noindex
      />
      <PageHeader
        title={employee?.name ? `Edit ${employee.name}` : "Edit Employee"}
        subtitle={
          employee?.profile?.employeeId
            ? `Employee ID ${employee.profile.employeeId}`
            : "Account and HR file"
        }
        breadcrumbs={[
          { title: "Dashboard", path: "/" },
          { title: "Employee Management" },
          { title: "Employees", path: "/employees" },
          { title: "Edit" },
        ]}
      />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spin />
        </div>
      ) : (
        /* Keyed on the record: the form fills itself from `employee` in an
           effect, and without a key a move between two employees would show the
           first one's values until that effect caught up. */
        <EmployeeForm key={employee?._id} mode="update" employee={employee} />
      )}
    </div>
  );
};

export default UpdateEmployee;
