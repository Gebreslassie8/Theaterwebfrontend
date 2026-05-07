// frontend/src/services/api.service.ts
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

class ApiService {
  async registerCustomer(data: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          phone: data.phone,
          full_name: data.full_name,
          username: data.username,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registration failed");
      }

      return result;
    } catch (error: any) {
      console.error("API Error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async login(email: string, password: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Login failed");
      }

      return result;
    } catch (error: any) {
      console.error("API Error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getProfile(token: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch profile");
      }

      return result;
    } catch (error: any) {
      console.error("API Error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export default new ApiService();