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
   * Get current user information from session and fetch theater ID
   */
  async getCurrentUserInfo(): Promise<UserInfo | null> {
    try {
      const userStr =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      if (!userStr) {
        console.warn("No user found in session");
        return null;
      }

      const user = JSON.parse(userStr);
      if (!user?.id) {
        console.warn("Invalid user data in session");
        return null;
      }

      let theaterId: string | null = null;

      // Check employees table first
      const { data: employeeData } = await supabase
        .from("employees")
        .select("theater_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (employeeData?.theater_id) {
        theaterId = employeeData.theater_id;
        console.log("Theater ID from employees:", theaterId);
      }

      // If not found, check theaters table
      if (!theaterId) {
        const { data: theaterData } = await supabase
          .from("theaters")
          .select("id")
          .eq("owner_user_id", user.id)
          .maybeSingle();

        if (theaterData?.id) {
          theaterId = theaterData.id;
          console.log("Theater ID from theaters:", theaterId);
        }
      }

      return {
        user,
        userData: {
          role: user.role,
          full_name: user.name || user.full_name,
          email: user.email,
          phone: user.phone || "",
        },
        theaterId,
      };
    } catch (error) {
      console.error("Error getting user info:", error);
      return null;
    }
  },

  /**
   * Get employees by theater ID
   */
  async getEmployeesByTheater(theaterId: string): Promise<Employee[]> {
    try {
      console.log("Fetching employees for theater:", theaterId);

      const { data: employees, error: employeesError } = await supabase
        .from("employees")
        .select("employee_id, is_active, profile_image_url, user_id")
        .eq("theater_id", theaterId);

      if (employeesError) throw employeesError;
      if (!employees?.length) return [];

      const userIds = employees.map((emp) => emp.user_id);
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select(
          "id, full_name, username, email, phone, role, status, created_at",
        )
        .in("id", userIds)
        .neq("role", "customer");

      if (usersError) throw usersError;

      return employees.map((emp) => {
        const user = users?.find((u) => u.id === emp.user_id);
        return {
          id: emp.user_id,
          name: user?.full_name || "",
          username: user?.username || "",
          email: user?.email || "",
          phone: user?.phone || "",
          employee_id: emp.employee_id,
          status: user?.status === "active" ? "Active" : "Inactive",
          is_active: emp.is_active,
          profile_image_url: emp.profile_image_url,
          theater_id: theaterId,
          assignedRole: user?.role || "",
          created_at: user?.created_at || new Date().toISOString(),
          created_by: user?.full_name || "",
        };
      });
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw error;
    }
  },

  /**
   * Get all employees (for super admin)
   */
  async getAllEmployees(): Promise<Employee[]> {
    try {
      console.log("Fetching all employees for super admin");

      const { data: users, error: usersError } = await supabase
        .from("users")
        .select(
          "id, full_name, username, email, phone, role, status, created_at",
        )
        .in("role", [
          "theater_owner",
          "theater_manager",
          "sales_person",
          "qr_scanner",
          "super_admin",
        ])
        .order("created_at", { ascending: false });

      if (usersError) throw usersError;
      if (!users?.length) return [];

      const employees: Employee[] = [];

      for (const user of users) {
        const { data: empData } = await supabase
          .from("employees")
          .select("employee_id, is_active, profile_image_url, theater_id")
          .eq("user_id", user.id)
          .maybeSingle();

        employees.push({
          id: user.id,
          name: user.full_name,
          username: user.username || "",
          email: user.email,
          phone: user.phone || "",
          employee_id: empData?.employee_id || null,
          status: user.status === "active" ? "Active" : "Inactive",
          is_active: empData?.is_active || false,
          profile_image_url: empData?.profile_image_url,
          theater_id: empData?.theater_id,
          assignedRole: user.role,
          created_at: user.created_at,
          created_by: user.full_name,
        });
      }

      console.log(`Found ${employees.length} employees`);
      return employees;
    } catch (error) {
      console.error("Error fetching all employees:", error);
      throw error;
    }
  },

  /**
   * Create a new employee
   */
  async createEmployee(
    formData: {
      name: string;
      email: string;
      phone: string;
      password: string;
      assignedRole: string;
    },
    theaterId: string,
  ): Promise<void> {
    try {
      const username = await this.generateUniqueUsername(formData.name);
      const employeeId = await this.generateUniqueEmployeeId();

      // Insert user
      const { data: user, error: userError } = await supabase
        .from("users")
        .insert({
          full_name: formData.name,
          username,
          email: formData.email.toLowerCase(),
          phone: formData.phone,
          password: formData.password,
          role: formData.assignedRole,
          status: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (userError) throw userError;

      // Insert employee
      const { error: employeeError } = await supabase.from("employees").insert({
        employee_id: employeeId,
        user_id: user.id,
        theater_id: theaterId,
        employee_role: formData.assignedRole,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (employeeError) throw employeeError;

      console.log("Employee created successfully:", user.id);
    } catch (error) {
      console.error("Error creating employee:", error);
      throw error;
    }
  },

  /**
   * Update an existing employee
   */
  async updateEmployee(
    employeeId: string,
    formData: {
      name: string;
      email: string;
      phone: string;
      password?: string;
      assignedRole: string;
    },
  ): Promise<void> {
    try {
      const updateData: any = {
        full_name: formData.name,
        email: formData.email.toLowerCase(),
        phone: formData.phone,
        role: formData.assignedRole,
        updated_at: new Date().toISOString(),
      };

      if (formData.password?.trim()) {
        updateData.password = formData.password;
      }

      // Update user
      const { error: userError } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", employeeId);

      if (userError) throw userError;

      // Update employee
      const { error: employeeError } = await supabase
        .from("employees")
        .update({
          employee_role: formData.assignedRole,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", employeeId);

      if (employeeError) throw employeeError;

      console.log("Employee updated successfully:", employeeId);
    } catch (error) {
      console.error("Error updating employee:", error);
      throw error;
    }
  },

  /**
   * Delete an employee (soft delete - deactivate instead)
   */
  async deleteEmployee(employeeId: string): Promise<void> {
    try {
      console.log("Deleting employee:", employeeId);

      // Try soft delete first (deactivate)
      await this.deactivateEmployee(employeeId, "Deleted by admin");
      console.log("Employee deactivated successfully:", employeeId);
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

      const { error: userError } = await supabase
        .from("users")
        .update({ status: "inactive", updated_at: now })
        .eq("id", employeeId);

      if (userError) throw userError;

      const { error: employeeError } = await supabase
        .from("employees")
        .update({ is_active: false, updated_at: now })
        .eq("user_id", employeeId);

      if (employeeError) throw employeeError;

      console.log("Employee deactivated:", employeeId, "Reason:", reason);
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

      const { error: userError } = await supabase
        .from("users")
        .update({ status: "active", updated_at: now })
        .eq("id", employeeId);

      if (userError) throw userError;

      const { error: employeeError } = await supabase
        .from("employees")
        .update({ is_active: true, updated_at: now })
        .eq("user_id", employeeId);

      if (employeeError) throw employeeError;

      console.log("Employee reactivated:", employeeId);
    } catch (error) {
      console.error("Error reactivating employee:", error);
      throw error;
    }
  },

  /**
   * Check if email exists
   */
  async isEmailExists(email: string): Promise<boolean> {
    const { data } = await supabase
      .from("users")
      .select("email")
      .eq("email", email.toLowerCase())
      .maybeSingle();
    return !!data;
  },

  /**
   * Check if phone exists
   */
  async isPhoneExists(phone: string): Promise<boolean> {
    const { data } = await supabase
      .from("users")
      .select("phone")
      .eq("phone", phone)
      .maybeSingle();
    return !!data;
  },

  /**
   * Generate unique employee ID
   */
  async generateUniqueEmployeeId(): Promise<string> {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    let employeeId = `EMP-${timestamp}-${random}`;

    while (true) {
      const { data } = await supabase
        .from("employees")
        .select("employee_id")
        .eq("employee_id", employeeId)
        .maybeSingle();

      if (!data) break;
      employeeId = `EMP-${timestamp}-${Math.floor(Math.random() * 10000)}`;
    }

    return employeeId;
  },

  /**
   * Generate unique username
   */
  async generateUniqueUsername(fullName: string): Promise<string> {
    const parts = fullName.toLowerCase().split(" ");
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join("") || "";
    const base = `${firstName}.${lastName}`.replace(/[^a-z0-9.]/g, "");

    let username = base;
    let counter = 1;

    while (true) {
      const { data } = await supabase
        .from("users")
        .select("username")
        .eq("username", username)
        .maybeSingle();

      if (!data) break;
      username = `${base}${counter++}`;
    }

    return username;
  },
};
