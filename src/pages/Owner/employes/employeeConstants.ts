// frontend/src/constants/employeeConstants.ts
import {
  Crown,
  Shield,
  UserCheck,
  Activity,
  CheckCircle,
  XCircle,
} from "lucide-react";

export const roleOptions = [
  { id: "theater_manager", label: "Theater Manager" },
  { id: "sales_person", label: "Sales Person" },
  { id: "qr_scanner", label: "QR Scanner" },
];

export const roleConfig: Record<string, any> = {
  theater_manager: {
    icon: Shield,
    color: "bg-blue-100 text-blue-700",
    label: "Manager",
  },
  sales_person: {
    icon: UserCheck,
    color: "bg-green-100 text-green-700",
    label: "Sales Person",
  },
  qr_scanner: {
    icon: Activity,
    color: "bg-purple-100 text-purple-700",
    label: "Scanner",
  },
};

// Make sure statusConfig has the correct keys
export const statusConfig: Record<string, any> = {
  Active: {
    icon: CheckCircle,
    color: "bg-green-100 text-green-700",
    label: "Active",
  },
  Inactive: {
    icon: XCircle,
    color: "bg-red-100 text-red-700",
    label: "Inactive",
  },
};

export const deactivationReasons = [
  "Performance issues",
  "Attendance problems",
  "Policy violation",
  "Requested by employee",
  "Role elimination",
  "Other",
];