// frontend/src/pages/Owner/employees/employeeUtils.ts
import { Employee, EmployeeStats } from "./employee.types";

export const filterEmployees = (
  employees: Employee[],
  searchTerm: string,
  filterRole: string,
  filterStatus: string,
): Employee[] => {
  if (!employees?.length) return [];
  if (!searchTerm && filterRole === "all" && filterStatus === "all")
    return employees;

  const searchLower = searchTerm.toLowerCase().trim();

  return employees.filter((employee) => {
    const matchesSearch =
      !searchTerm ||
      employee.name?.toLowerCase().includes(searchLower) ||
      employee.email?.toLowerCase().includes(searchLower) ||
      employee.phone?.includes(searchTerm) ||
      employee.username?.toLowerCase().includes(searchLower) ||
      employee.employee_id?.toLowerCase().includes(searchLower);

    const matchesRole =
      filterRole === "all" || employee.assignedRole === filterRole;
    const matchesStatus =
      filterStatus === "all" || employee.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });
};

export const calculateStats = (employees: Employee[]): EmployeeStats => {
  if (!employees?.length) {
    return { totalEmployees: 0, activeEmployees: 0, inactiveEmployees: 0 };
  }

  return {
    totalEmployees: employees.length,
    activeEmployees: employees.filter((e) => e.status === "Active").length,
    inactiveEmployees: employees.filter((e) => e.status === "Inactive").length,
  };
};

export const exportToCSV = (employees: Employee[]): void => {
  if (!employees?.length) {
    alert("No data to export");
    return;
  }

  const headers = [
    "Name",
    "Email",
    "Phone",
    "Username",
    "Employee ID",
    "Role",
    "Status",
    "Created At",
  ];
  const rows = employees.map((emp) => [
    `"${emp.name || ""}"`,
    `"${emp.email || ""}"`,
    `"${emp.phone || ""}"`,
    `"${emp.username || ""}"`,
    `"${emp.employee_id || ""}"`,
    emp.assignedRole || "",
    emp.status || "",
    emp.created_at ? new Date(emp.created_at).toLocaleDateString() : "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `employees_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const getRoleDisplayName = (role: string): string => {
  const roleMap: Record<string, string> = {
    super_admin: "Super Admin",
    theater_owner: "Theater Owner",
    theater_manager: "Theater Manager",
    sales_person: "Sales Person",
    qr_scanner: "QR Scanner",
    customer: "Customer",
  };
  return roleMap[role] || role;
};