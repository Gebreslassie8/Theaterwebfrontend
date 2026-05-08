// frontend/src/components/EmployeeForm/UpdateEmployee.tsx
import React from "react";
import AddNewEmployee from "./AddNewEmployee";

interface UpdateEmployeeProps {
  isOpen: boolean;
  employee: any;
  roles: Array<{ id: string; label: string }>;
  onClose: () => void;
  onUpdate: (data: any) => Promise<void>;
  theaterId?: string;
  currentUserRole?: string;
}

const UpdateEmployee: React.FC<UpdateEmployeeProps> = ({
  isOpen,
  employee,
  roles,
  onClose,
  onUpdate,
  theaterId,
  currentUserRole,
}) => {
  if (!isOpen || !employee) return null;

  // Transform employee data to match AddNewEmployee's expected format
  const editData = {
    id: employee.id,
    name: employee.name,
    email: employee.email,
    phone: employee.phone,
    assignedRole: employee.assignedRole,
    salary: employee.salary,
    username: employee.username,
    employee_id: employee.employee_id,
    status: employee.status,
  };

  console.log("UpdateEmployee - Editing:", editData);

  return (
    <AddNewEmployee
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onUpdate}
      roles={roles}
      editData={editData}
      isEdit={true}
      theaterId={theaterId}
      currentUserRole={currentUserRole}
    />
  );
};

export default UpdateEmployee;