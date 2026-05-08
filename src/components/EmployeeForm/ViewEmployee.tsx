// frontend/src/components/EmployeeForm/ViewEmployee.tsx
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { X,User, Mail, Phone, Briefcase, Calendar, CheckCircle, XCircle, UserCheck, Shield, Coins, Crown, Activity, Building, AlertCircle, Edit, Printer, Download, MapPin, Award, } from "lucide-react";
import supabase from "@/config/supabaseClient";


interface ViewEmployeeProps {
  isOpen: boolean;
  employee: any;
  roles: any[];
  onClose: () => void;
  onEdit?: () => void;
}

const ViewEmployee: React.FC<ViewEmployeeProps> = ({ isOpen, employee, roles, onClose, onEdit, }) => {
  const [currentUserRole, setCurrentUserRole] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [additionalInfo, setAdditionalInfo] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [hasAccess, setHasAccess] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserTheaterId, setCurrentUserTheaterId] = useState<
    string | null
  >(null);

  // Get current user from localStorage/sessionStorage
  const getCurrentUser = useCallback(() => {
    try {
      const userStr =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      if (userStr) {
        return JSON.parse(userStr);
      }
      return null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    if (isOpen && employee) {
      fetchUserAndCheckAccess();
    }
  }, [isOpen, employee]);

  const fetchUserAndCheckAccess = async () => {
    setLoading(true);
    setError(null);

    try {
      const currentUser = getCurrentUser();

      if (!currentUser || !currentUser.id) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      setCurrentUserId(currentUser.id);
      setCurrentUserRole(currentUser.role || "");

      // Get current user's theater ID
      await getCurrentUserTheater(currentUser.id);

      // Check access
      await checkAccess(currentUser);
    } catch (error) {
      console.error("Error fetching user info:", error);
      setError("Failed to load user information");
      setLoading(false);
    }
  };

  const getCurrentUserTheater = async (userId: string) => {
    try {
      // First check employees table
      const { data: employeeData } = await supabase
        .from("employees")
        .select("theater_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (employeeData?.theater_id) {
        setCurrentUserTheaterId(employeeData.theater_id);
        return;
      }

      // If not found, check theaters table as owner
      const { data: theaterData } = await supabase
        .from("theaters")
        .select("id")
        .eq("owner_user_id", userId)
        .maybeSingle();

      if (theaterData?.id) {
        setCurrentUserTheaterId(theaterData.id);
      }
    } catch (error) {
      console.error("Error getting user theater:", error);
    }
  };

  const checkAccess = async (currentUser: any) => {
    try {
      // Super admin can see everyone
      if (currentUser.role === "super_admin") {
        setHasAccess(true);
        await Promise.all([checkIfOwner(), fetchAdditionalEmployeeInfo()]);
        return;
      }

      // Theater owner can see all employees in their theaters
      if (currentUser.role === "theater_owner") {
        // Get all theater IDs owned by this user
        const { data: ownedTheaters } = await supabase
          .from("theaters")
          .select("id")
          .eq("owner_user_id", currentUser.id);

        const ownedTheaterIds = ownedTheaters?.map((t) => t.id) || [];

        // Get employee's theater ID
        const { data: employeeTheater } = await supabase
          .from("employees")
          .select("theater_id")
          .eq("user_id", employee.id)
          .maybeSingle();

        // Check if employee belongs to any theater owned by this user
        if (
          employeeTheater &&
          ownedTheaterIds.includes(employeeTheater.theater_id)
        ) {
          setHasAccess(true);
          await Promise.all([checkIfOwner(), fetchAdditionalEmployeeInfo()]);
        } else if (currentUser.id === employee.id) {
          // Can see own profile
          setHasAccess(true);
          await Promise.all([checkIfOwner(), fetchAdditionalEmployeeInfo()]);
        } else {
          setHasAccess(false);
          setError("You don't have permission to view this employee");
          setLoading(false);
        }
        return;
      }

      // Theater manager can see employees in their assigned theater
      if (currentUser.role === "theater_manager") {
        // Get manager's theater
        const { data: managerTheater } = await supabase
          .from("employees")
          .select("theater_id")
          .eq("user_id", currentUser.id)
          .maybeSingle();

        // Get employee's theater
        const { data: employeeTheater } = await supabase
          .from("employees")
          .select("theater_id")
          .eq("user_id", employee.id)
          .maybeSingle();

        if (managerTheater?.theater_id === employeeTheater?.theater_id) {
          setHasAccess(true);
          await Promise.all([checkIfOwner(), fetchAdditionalEmployeeInfo()]);
        } else if (currentUser.id === employee.id) {
          setHasAccess(true);
          await Promise.all([checkIfOwner(), fetchAdditionalEmployeeInfo()]);
        } else {
          setHasAccess(false);
          setError("You don't have permission to view this employee");
          setLoading(false);
        }
        return;
      }

      // Check if viewing own profile
      if (currentUser.id === employee.id) {
        setHasAccess(true);
        await Promise.all([checkIfOwner(), fetchAdditionalEmployeeInfo()]);
        return;
      }

      // Default - no access
      setHasAccess(false);
      setError("You don't have permission to view this employee");
      setLoading(false);
    } catch (error) {
      console.error("Error checking access:", error);
      setHasAccess(false);
      setError("Access denied");
      setLoading(false);
    }
  };

  const checkIfOwner = async () => {
    try {
      const currentUser = getCurrentUser();
      if (currentUser && employee.id === currentUser.id) {
        const { data: ownerData } = await supabase
          .from("owners")
          .select("business_name, verification_status")
          .eq("user_id", employee.id)
          .maybeSingle();
        if (ownerData) setIsOwner(true);
      }
    } catch (error) {
      console.error("Error checking owner status:", error);
    }
  };

  const fetchAdditionalEmployeeInfo = async () => {
    try {
      // Check if employee is an owner
      const { data: ownerData } = await supabase
        .from("owners")
        .select("*")
        .eq("user_id", employee.id)
        .maybeSingle();

      if (ownerData) {
        setAdditionalInfo(ownerData);
        setLoading(false);
        return;
      }

      // Fetch employee details from employees table
      const { data: employeeData, error: employeeError } = await supabase
        .from("employees")
        .select(
          `
          employee_id,
          department,
          position,
          employment_type,
          bank_account_number,
          bank_name,
          tin_number,
          emergency_contact_name,
          emergency_contact_phone,
          hire_date,
          is_active,
          notes,
          theater:theater_id (
            legal_business_name,
            city,
            address
          )
        `,
        )
        .eq("user_id", employee.id)
        .maybeSingle();

      if (employeeError) throw employeeError;

      setAdditionalInfo(employeeData || null);
    } catch (error) {
      console.error("Error fetching employee info:", error);
      setAdditionalInfo(null);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !employee) return null;

  const getRoleDetails = (roleId: string) => {
    const roleMap: Record<string, any> = {
      super_admin: {
        icon: Crown,
        color: "text-red-600",
        bgColor: "bg-red-100",
        label: "Super Admin",
        description: "Full system access and control",
        permissions: [
          "Manage all theaters",
          "Manage all users",
          "System settings",
          "View all reports",
        ],
      },
      theater_owner: {
        icon: Shield,
        color: "text-amber-600",
        bgColor: "bg-amber-100",
        label: "Theater Owner",
        description: "Manage theaters and overall operations",
        permissions: [
          "Manage own theaters",
          "Hire employees",
          "View sales reports",
          "Manage events",
        ],
      },
      theater_manager: {
        icon: Shield,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        label: "Manager",
        description: "Manage events and daily operations",
        permissions: [
          "Manage events",
          "Manage staff schedules",
          "View daily reports",
          "Handle customer issues",
        ],
      },
      sales_person: {
        icon: UserCheck,
        color: "text-green-600",
        bgColor: "bg-green-100",
        label: "Sales Person",
        description: "Handle ticket sales and customer service",
        permissions: [
          "Sell tickets",
          "Process refunds",
          "Handle customer inquiries",
          "View inventory",
        ],
      },
      qr_scanner: {
        icon: Activity,
        color: "text-purple-600",
        bgColor: "bg-purple-100",
        label: "Scanner",
        description: "Validate tickets at events",
        permissions: [
          "Scan tickets",
          "Validate entries",
          "View event information",
        ],
      },
    };
    return roleMap[roleId] || roleMap.sales_person;
  };

  const getStatusConfig = (status: string) => {
    const statusMap: Record<string, any> = {
      active: {
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-100",
        label: "Active",
      },
      inactive: {
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-100",
        label: "Inactive",
      },
    };
    return statusMap[status] || statusMap.active;
  };

  const role = getRoleDetails(employee.assignedRole || employee.role);
  const RoleIcon = role.icon;
  const statusConfig = getStatusConfig(
    employee.status === "Active" ? "active" : "inactive",
  );
  const StatusIcon = statusConfig.icon;
  const canEdit =
    currentUserRole === "super_admin" || currentUserRole === "theater_owner";

  const handlePrint = () => window.print();

  const handleDownload = () => {
    const data = {
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      role: role.label,
      status: statusConfig.label,
      department: additionalInfo?.department,
      position: additionalInfo?.position,
      hireDate: additionalInfo?.hire_date,
      ...(isOwner && { businessName: additionalInfo?.business_name }),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${employee.name.replace(/\s/g, "_")}_details.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Show loading state
  if (loading) {
    return (
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Employee Details
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Loading employee information...
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4" />
              <p className="text-gray-500">Loading employee details...</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Show access denied state
  if (!hasAccess || error) {
    return (
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Access Denied
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  You don't have permission
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="flex-1 p-6 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Access
            </h3>
            <p className="text-gray-600 mb-6">
              {error ||
                "You don't have permission to view this employee's information."}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-lg">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Employee Details
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                View employee information
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {canEdit && onEdit && (
              <button
                onClick={onEdit}
                className="p-2 hover:bg-teal-50 rounded-lg text-teal-600"
                title="Edit"
              >
                <Edit className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={handlePrint}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Print"
            >
              <Printer className="h-5 w-5 text-gray-500" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Download"
            >
              <Download className="h-5 w-5 text-gray-500" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">
                {employee.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">
                {employee.name}
              </h3>
              <p className="text-sm text-gray-500">@{employee.username}</p>
              {additionalInfo?.employee_id && (
                <p className="text-xs text-gray-400 font-mono mt-1">
                  ID: {additionalInfo.employee_id}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}
                >
                  <StatusIcon className="h-3 w-3" /> {statusConfig.label}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${role.bgColor} ${role.color}`}
                >
                  <RoleIcon className="h-3 w-3" /> {role.label}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-teal-600" /> Personal Information
              </h4>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Full Name</p>
                  <p className="font-medium text-gray-900">{employee.name}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Username</p>
                  <p className="font-medium text-gray-900">
                    @{employee.username}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-gray-400" />
                    <p className="font-medium text-gray-900">
                      {employee.email}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-gray-400" />
                    <p className="font-medium text-gray-900">
                      {employee.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-teal-600" /> Employment
                Information
              </h4>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Role</p>
                  <div className="flex items-center gap-2">
                    <RoleIcon className={`h-4 w-4 ${role.color}`} />
                    <p className="font-medium text-gray-900">{role.label}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {role.description}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Salary</p>
                  <div className="flex items-center gap-1">
                    <Coins className="h-3 w-3 text-green-600" />
                    <p className="font-medium text-green-600">
                      Br {employee.salary?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
                {additionalInfo?.hire_date && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Hire Date</p>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <p className="font-medium text-gray-900">
                        {new Date(
                          additionalInfo.hire_date,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
                {additionalInfo?.department && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Department</p>
                    <p className="font-medium text-gray-900">
                      {additionalInfo.department}
                    </p>
                  </div>
                )}
                {additionalInfo?.position && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Position</p>
                    <p className="font-medium text-gray-900">
                      {additionalInfo.position}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {additionalInfo?.theater && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Building className="h-4 w-4 text-teal-600" /> Assigned Theater
              </h4>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium text-gray-900">
                  {additionalInfo.theater.legal_business_name}
                </p>
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                  <MapPin className="h-3 w-3" />
                  {additionalInfo.theater.city},{" "}
                  {additionalInfo.theater.address}
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Award className="h-4 w-4 text-teal-600" /> Permissions
            </h4>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex flex-wrap gap-2">
                {role.permissions?.map((p: string, i: number) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-teal-100 text-teal-700"
                  >
                    <CheckCircle className="h-3 w-3" /> {p}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 mt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewEmployee;
