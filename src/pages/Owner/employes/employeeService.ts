// frontend/src/services/employeeService.ts
import supabase from "../../../config/supabaseClient";
import { Employee } from "./employee.types";

export interface UserInfo {
  user: any;
  userData: {
    role: string;
    full_name: string;
    email: string;
    phone: string;
  } | null;
  theaterId: string | null;
}

export const employeeService = {
  /**
   * Get current user information from session and fetch theater ID from database
   */
  async getCurrentUserInfo(): Promise<UserInfo | null> {
    try {
      // Get user from localStorage or sessionStorage
      const userStr =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      if (!userStr) {
        console.warn("No user found in session");
        return null;
      }

      const user = JSON.parse(userStr);
      if (!user || !user.id) {
        console.warn("Invalid user data in session");
        return null;
      }

      // Fetch theater_id from employees table for this user
      let theaterId: string | null = null;

      const { data: employeeData, error: employeeError } = await supabase
        .from("employees")
        .select("theater_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (employeeError) {
        console.error("Error fetching employee theater:", employeeError);
      } else if (employeeData) {
        theaterId = employeeData.theater_id;
      }

      // If not found in employees, check if user is a theater owner
      if (!theaterId) {
        const { data: theaterData, error: theaterError } = await supabase
          .from("theaters")
          .select("id")
          .eq("owner_user_id", user.id)
          .maybeSingle();

        if (!theaterError && theaterData) {
          theaterId = theaterData.id;
        }
      }

      console.log("Found theater ID for user:", theaterId);

      return {
        user,
        userData: {
          role: user.role,
          full_name: user.name,
          email: user.email,
          phone: user.phone || "",
        },
        theaterId: theaterId,
      };
    } catch (error) {
      console.error("Error getting user info:", error);
      return null;
    }
  },

  /**
   * Get all employees for a specific theater
   */
  async getEmployeesByTheater(theaterId: string): Promise<Employee[]> {
    try {
      // First get all employees from the employees table for this theater
      const { data: employeesData, error: employeesError } = await supabase
        .from("employees")
        .select(
          `
          employee_id,
          department,
          position,
          employment_type,
          is_active,
          hire_date,
          salary,
          user_id
        `,
        )
        .eq("theater_id", theaterId);

      if (employeesError) throw employeesError;

      if (!employeesData || employeesData.length === 0) {
        return [];
      }

      // Get the user IDs from employees
      const userIds = employeesData.map((emp) => emp.user_id);

      // Get user details for these employees
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select(
          `
          id,
          full_name,
          username,
          email,
          phone,
          role,
          status,
          created_at
        `,
        )
        .in("id", userIds)
        .neq("role", "customer");

      if (usersError) throw usersError;

      // Combine the data
      const employees: Employee[] = employeesData.map((emp) => {
        const user = usersData?.find((u) => u.id === emp.user_id);
        return {
          id: emp.user_id,
          name: user?.full_name || "",
          username: user?.username || "",
          email: user?.email || "",
          phone: user?.phone || "",
          salary: emp.salary || 0,
          employee_id: emp.employee_id,
          department: emp.department,
          position: emp.position,
          employment_type: emp.employment_type,
          status: user?.status === "active" ? "Active" : "Inactive",
          joinDate: user?.created_at?.split("T")[0],
          assignedRole: user?.role || "",
          is_active: emp.is_active,
          hire_date: emp.hire_date,
          created_at: user?.created_at,
          created_by: user?.full_name,
        };
      });

      return employees;
    } catch (error) {
      console.error("Error fetching employees by theater:", error);
      throw error;
    }
  },

  /**
   * Get all employees (for super admin)
   */
  async getAllEmployees(): Promise<Employee[]> {
    try {
      // Get all users with employee roles
      const { data: users, error } = await supabase
        .from("users")
        .select(
          `
          id,
          full_name,
          username,
          email,
          phone,
          role,
          status,
          salary,
          created_at
        `,
        )
        .in("role", [
          "theater_owner",
          "theater_manager",
          "sales_person",
          "qr_scanner",
          "super_admin",
        ])
        .order("created_at", { ascending: false });

      if (error) throw error;

      // For each user, get their employee details
      const employees: Employee[] = [];

      for (const user of users) {
        const { data: empData } = await supabase
          .from("employees")
          .select(
            `
            employee_id,
            department,
            position,
            employment_type,
            is_active,
            hire_date
          `,
          )
          .eq("user_id", user.id)
          .maybeSingle();

        employees.push({
          id: user.id,
          name: user.full_name,
          username: user.username || "",
          email: user.email,
          phone: user.phone || "",
          salary: user.salary || 0,
          employee_id: empData?.employee_id || null,
          department: empData?.department || null,
          position: empData?.position || null,
          employment_type: empData?.employment_type || null,
          status: user.status === "active" ? "Active" : "Inactive",
          joinDate: user.created_at?.split("T")[0],
          assignedRole: user.role,
          is_active: empData?.is_active || false,
          hire_date: empData?.hire_date,
          created_at: user.created_at,
          created_by: user.full_name,
        });
      }

      return employees;
    } catch (error) {
      console.error("Error fetching all employees:", error);
      throw error;
    }
  },

  /**
   * Delete an employee
   */
  async deleteEmployee(employeeId: string): Promise<void> {
    try {
      // Delete from employees table first
      const { error: employeeError } = await supabase
        .from("employees")
        .delete()
        .eq("user_id", employeeId);

      if (employeeError) throw employeeError;

      // Delete from users table
      const { error: userError } = await supabase
        .from("users")
        .delete()
        .eq("id", employeeId);

      if (userError) throw userError;
    } catch (error) {
      console.error("Error deleting employee:", error);
      throw error;
    }
  },

  /**
   * Deactivate an employee
   */
  async deactivateEmployee(employeeId: string, reason: string): Promise<void> {
    try {
      const now = new Date().toISOString();
      const today = new Date().toISOString().split("T")[0];

      // Update users table
      const { error: userError } = await supabase
        .from("users")
        .update({
          status: "inactive",
          updated_at: now,
        })
        .eq("id", employeeId);

      if (userError) throw userError;

      // Update employees table
      const { error: employeeError } = await supabase
        .from("employees")
        .update({
          is_active: false,
          updated_at: now,
          termination_reason: reason,
          termination_date: today,
        })
        .eq("user_id", employeeId);

      if (employeeError) throw employeeError;
    } catch (error) {
      console.error("Error deactivating employee:", error);
      throw error;
    }
  },

  /**
   * Reactivate an employee
   */
  async reactivateEmployee(employeeId: string): Promise<void> {
    try {
      const now = new Date().toISOString();

      // Update users table
      const { error: userError } = await supabase
        .from("users")
        .update({
          status: "active",
          updated_at: now,
        })
        .eq("id", employeeId);

      if (userError) throw userError;

      // Update employees table
      const { error: employeeError } = await supabase
        .from("employees")
        .update({
          is_active: true,
          updated_at: now,
          termination_reason: null,
          termination_date: null,
        })
        .eq("user_id", employeeId);

      if (employeeError) throw employeeError;
    } catch (error) {
      console.error("Error reactivating employee:", error);
      throw error;
    }
  },
};
