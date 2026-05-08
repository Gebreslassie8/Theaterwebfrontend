// frontend/src/pages/Owner/employes/employee.types.ts

// Employee interface matching your database schema
export interface Employee {
  id: string;
  name: string;
  email: string;
  username: string;
  phone: string;
  salary: number;
  position?: string;
  employment_type?: string;
  status: "Active" | "Inactive";
  assignedRole: string;
  is_active?: boolean;
  employee_id?: string;
  department?: string;
  bank_account_number?: string;
  bank_name?: string;
  tin_number?: string;
  hire_date?: string;
  termination_date?: string;
  termination_reason?: string;
  contract_start_date?: string;
  contract_end_date?: string;
  probation_end_date?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  notes?: string;
  profile_image_url?: string;
  joinDate?: string;
  theater_id?: string;
  theater_name?: string;
  created_at: string;
  created_by: string;
  updated_at?: string;
}

// Role option for dropdowns
export interface RoleOption {
  id: string;
  label: string;
}

// Popup message for notifications
export interface PopupMessage {
  title: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

// Dashboard card configuration
export interface DashboardCard {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  delay: number;
  link?: string;
  trend?: number;
}

// Department statistics
export interface DepartmentStat {
  name: string;
  count: number;
  icon: React.ElementType;
  color: string;
}

// Employee form data for create/update
export interface EmployeeFormData {
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  role: string;
  salary: number;
  theaterId?: string;
  employee_id?: string;
  department?: string;
  position?: string;
  employment_type?: string;
  hire_date?: string;
}

// Employee filters
export interface EmployeeFilters {
  searchTerm: string;
  filterRole: string;
  filterStatus: string;
  filterDepartment?: string;
}

// Employee statistics
export interface EmployeeStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  totalPayroll: number;
  avgSalary: number;
}

// Employee table column configuration
export interface EmployeeColumn {
  Header: string;
  accessor: keyof Employee | string;
  sortable?: boolean;
  Cell?: (row: Employee) => React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}

// User role types (matching your database user_rol enum)
export type UserRole =
  | "super_admin"
  | "theater_owner"
  | "theater_manager"
  | "sales_person"
  | "qr_scanner"
  | "customer";

// Employment types
export type EmploymentType = "full_time" | "part_time" | "contract" | "intern";

// Employee status
export type EmployeeStatus = "active" | "inactive" | "suspended";

// User status from users table
export type UserStatus = "active" | "inactive" | "suspended";

// Employee role configuration for UI display
export interface RoleConfig {
  icon: React.ElementType;
  color: string;
  bgColor: string;
  label: string;
  description?: string;
  permissions?: string[];
}

// Status configuration for UI display
export interface StatusConfig {
  icon: React.ElementType;
  color: string;
  bgColor: string;
  label: string;
}