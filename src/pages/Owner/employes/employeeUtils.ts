// frontend/src/pages/Owner/employes/employeeUtils.ts
import { Employee } from "./employee.types";

/**
 * Filter employees based on search term, role, and status
 */
export const filterEmployees = (
  employees: Employee[],
  searchTerm: string,
  filterRole: string,
  filterStatus: string,
): Employee[] => {
  if (!employees || !Array.isArray(employees)) {
    return [];
  }

  if (searchTerm === "" && filterRole === "all" && filterStatus === "all") {
    return employees;
  }

  const searchLower = searchTerm.toLowerCase();

  return employees.filter((employee) => {
    const matchesSearch =
      searchTerm === "" ||
      (employee.name && employee.name.toLowerCase().includes(searchLower)) ||
      (employee.email && employee.email.toLowerCase().includes(searchLower)) ||
      (employee.phone && employee.phone.includes(searchTerm)) ||
      (employee.username &&
        employee.username.toLowerCase().includes(searchLower)) ||
      (employee.employee_id &&
        employee.employee_id.toLowerCase().includes(searchLower));

    const matchesRole =
      filterRole === "all" || employee.assignedRole === filterRole;
    const matchesStatus =
      filterStatus === "all" || employee.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });
};

/**
 * Calculate employee statistics
 */
export const calculateStats = (employees: Employee[]) => {
  if (!employees || !Array.isArray(employees)) {
    return {
      totalEmployees: 0,
      activeEmployees: 0,
      inactiveEmployees: 0,
      totalPayroll: 0,
      avgSalary: 0,
    };
  }

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === "Active").length;
  const inactiveEmployees = employees.filter(
    (e) => e.status === "Inactive",
  ).length;
  const totalPayroll = employees.reduce((sum, e) => sum + (e.salary || 0), 0);
  const avgSalary = totalEmployees > 0 ? totalPayroll / totalEmployees : 0;

  return {
    totalEmployees,
    activeEmployees,
    inactiveEmployees,
    totalPayroll,
    avgSalary,
  };
};

/**
 * Export employees to CSV
 */
export const exportToCSV = (employees: Employee[]) => {
  if (!employees || employees.length === 0) {
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
    "Salary",
    "Status",
    "Join Date",
  ];

  const csvRows = [headers.join(",")];

  for (const emp of employees) {
    const row = [
      `"${emp.name || ""}"`,
      `"${emp.email || ""}"`,
      `"${emp.phone || ""}"`,
      `"${emp.username || ""}"`,
      `"${emp.employee_id || ""}"`,
      `"${emp.assignedRole || ""}"`,
      emp.salary || 0,
      emp.status || "",
      emp.joinDate || "",
    ];
    csvRows.push(row.join(","));
  }

  const blob = new Blob([csvRows.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    `employees_${new Date().toISOString().split("T")[0]}.csv`,
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Get role display name
 */
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

/**
 * Get status display name
 */
export const getStatusDisplayName = (status: string): string => {
  const statusMap: Record<string, string> = {
    active: "Active",
    inactive: "Inactive",
    suspended: "Suspended",
  };
  return statusMap[status] || status;
};