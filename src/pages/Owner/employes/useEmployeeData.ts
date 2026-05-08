// frontend/src/pages/Owner/employes/useEmployeeData.ts
import { useState, useEffect, useCallback } from "react";
import { employeeService } from "./employeeService";
import { Employee } from "./employee.types";

export const useEmployeeData = (
  theaterId: string | null,
  currentUserRole: string,
) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let data: Employee[] = [];

      console.log(
        "Loading employees - Role:",
        currentUserRole,
        "TheaterId:",
        theaterId,
      );

      if (currentUserRole === "super_admin") {
        data = await employeeService.getAllEmployees();
      } else if (theaterId) {
        data = await employeeService.getEmployeesByTheater(theaterId);
      } else {
        // Try to get theater from current user
        const userInfo = await employeeService.getCurrentUserInfo();
        if (userInfo?.theaterId) {
          data = await employeeService.getEmployeesByTheater(
            userInfo.theaterId,
          );
        } else {
          console.warn("No theater ID available for non-admin user");
        }
      }

      console.log("Employees loaded:", data.length);
      setEmployees(data);
    } catch (err: any) {
      console.error("Error loading employees:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [theaterId, currentUserRole]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  return { employees, loading, error, loadEmployees };
};