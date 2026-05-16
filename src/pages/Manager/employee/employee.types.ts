// frontend/src/pages/Owner/employees/employee.types.ts

// Employee interface matching your database schema
export interface Employee {
  id: string;
  name: string;
  email: string;
  username: string;
  phone: string;
  status: "Active" | "Inactive";
  assignedRole: string;
  is_active?: boolean;
  employee_id?: string;
  profile_image_url?: string;
  theater_id?: string;
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

// Employee form data for create/update
export interface EmployeeFormData {
  name: string;
  email: string;
  phone: string;
  password?: string;
  assignedRole: string;
}

// Employee filters
export interface EmployeeFilters {
  searchTerm: string;
  filterRole: string;
  filterStatus: string;
}

// Employee statistics
export interface EmployeeStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
}

// User role types
export type UserRole =
  | "super_admin"
  | "theater_owner"
  | "theater_manager"
  | "sales_person"
  | "qr_scanner"
  | "customer";

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