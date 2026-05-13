// frontend/src/services/adminService.ts
import supabase  from "@/config/supabaseClient";

// ==================== TYPES ====================

export interface Theater {
  id: string;
  legal_business_name: string;
  business_type: string;
  business_license_number: string | null;
  license_expiry_date: string | null;
  license_status: string;
  license_document_url: string | null;
  tax_id: string | null;
  tax_registration_certificate_path: string | null;
  country: string;
  city: string;
  address: string;
  email: string;
  phone: string;
  contact_persons: any;
  description: string | null;
  logo_url: string | null;
  account_number: string | null;
  subscription_status: string;
  is_approved: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  owner_user_id: string | null;
  approved_by: string | null;
  total_halls?: number;
  total_seats?: number;
  owner?: {
    full_name: string;
    email: string;
    phone: string;
  };
}

export interface Owner {
  id: string;
  user_id: string;
  national_id: string | null;
  tin_number: string | null;
  date_of_birth: string | null;
  gender: string | null;
  business_name: string | null;
  business_type: string | null;
  years_of_experience: number | null;
  physical_address: string | null;
  city: string | null;
  house_number: string | null;
  profile_image_url: string | null;
  business_license_url: string | null;
  bank_name: string | null;
  bank_account_number: string | null;
  verification_status: string;
  verification_notes: string | null;
  verified_at: string | null;
  verified_by: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    full_name: string;
    email: string;
    phone: string;
  };
}

export interface OwnerContract {
  id: string;
  owner_id: string;
  theater_id: string;
  contract_number: string;
  contract_type: string;
  subscription_plan: string | null;
  base_price: number;
  discounted_price: number | null;
  discount_percent: number | null;
  commission_rate: number;
  contract_start_date: string;
  contract_end_date: string | null;
  payment_frequency: string | null;
  payment_status: string;
  status: string;
  terms_accepted_at: string;
  signed_document_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  theater?: Theater;
  owner?: Owner;
}

export interface User {
  id: string;
  email: string;
  phone: string | null;
  full_name: string;
  username: string | null;
  status: string;
  last_login: string | null;
  created_at: string;
  updated_at: string;
  role: string;
  bio: string | null;
  location: string | null;
  profile_image_url: string | null;
}

export interface DashboardStats {
  totalTheaters: number;
  activeTheaters: number;
  pendingTheaters: number;
  rejectedTheaters: number;
  totalOwners: number;
  verifiedOwners: number;
  activeContracts: number;
  recentTheaters: Theater[];
}

export interface CreateTheaterData {
  legal_business_name: string;
  business_type: string;
  business_license_number?: string;
  license_expiry_date?: string;
  tax_id?: string;
  country?: string;
  city: string;
  address: string;
  email: string;
  phone: string;
  description?: string;
  account_number?: string;
  owner_user_id?: string;
}

export interface UpdateTheaterData {
  legal_business_name?: string;
  business_type?: string;
  business_license_number?: string;
  license_expiry_date?: string | null;
  license_status?: string;
  tax_id?: string;
  city?: string;
  address?: string;
  email?: string;
  phone?: string;
  description?: string;
  status?: string;
  subscription_status?: string;
  is_approved?: boolean;
  updated_at?: string;
}

export interface CreateOwnerData {
  user_id: string;
  national_id?: string;
  tin_number?: string;
  business_name?: string;
  business_type?: string;
  years_of_experience?: number;
  physical_address?: string;
  city?: string;
  verification_status?: string;
}

// ==================== HELPER FUNCTIONS ====================

const handleSupabaseError = (error: any, customMessage?: string): never => {
  console.error("Supabase error:", error);
  throw new Error(
    customMessage || error.message || "An unexpected error occurred",
  );
};

const formatDateForDB = (date: Date): string => {
  return date.toISOString();
};

// ==================== MAIN SERVICE CLASS ====================

class AdminService {
  // ==================== THEATER MANAGEMENT ====================

  /**
   * Get all theaters with optional filtering
   */
  async getTheaters(filters?: {
    status?: string;
    is_approved?: boolean;
  }): Promise<Theater[]> {
    try {
      let query = supabase
        .from("theaters")
        .select(
          `
                    *,
                    owner:owner_user_id (
                        full_name,
                        email,
                        phone
                    )
                `,
        )
        .order("created_at", { ascending: false });

      if (filters?.status) {
        query = query.eq("status", filters.status);
      }
      if (filters?.is_approved !== undefined) {
        query = query.eq("is_approved", filters.is_approved);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      return handleSupabaseError(error, "Failed to fetch theaters");
    }
  }

  /**
   * Get a single theater by ID
   */
  async getTheaterById(id: string): Promise<Theater | null> {
    try {
      const { data, error } = await supabase
        .from("theaters")
        .select(
          `
                    *,
                    owner:owner_user_id (
                        full_name,
                        email,
                        phone
                    )
                `,
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching theater:", error);
      return null;
    }
  }

  /**
   * Create a new theater
   */
  async createTheater(theaterData: CreateTheaterData): Promise<Theater> {
    try {
      const { data, error } = await supabase
        .from("theaters")
        .insert([
          {
            ...theaterData,
            status: "pending",
            is_approved: false,
            subscription_status: "trial",
            license_status: "pending",
            country: theaterData.country || "Ethiopia",
            created_at: formatDateForDB(new Date()),
            updated_at: formatDateForDB(new Date()),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return handleSupabaseError(error, "Failed to create theater");
    }
  }

  /**
   * Update an existing theater
   */
  async updateTheater(
    id: string,
    updates: UpdateTheaterData,
  ): Promise<Theater> {
    try {
      const { data, error } = await supabase
        .from("theaters")
        .update({
          ...updates,
          updated_at: formatDateForDB(new Date()),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return handleSupabaseError(error, "Failed to update theater");
    }
  }

  /**
   * Delete a theater
   */
  async deleteTheater(id: string): Promise<void> {
    try {
      // First check if there are any contracts
      const { data: contracts, error: contractError } = await supabase
        .from("owners_contracts")
        .select("id")
        .eq("theater_id", id);

      if (contractError) throw contractError;

      // Delete contracts if they exist
      if (contracts && contracts.length > 0) {
        const { error: deleteContractError } = await supabase
          .from("owners_contracts")
          .delete()
          .eq("theater_id", id);

        if (deleteContractError) throw deleteContractError;
      }

      // Delete the theater
      const { error } = await supabase.from("theaters").delete().eq("id", id);

      if (error) throw error;
    } catch (error) {
      return handleSupabaseError(error, "Failed to delete theater");
    }
  }

  /**
   * Approve a theater
   */
  async approveTheater(id: string, approvedBy: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("theaters")
        .update({
          is_approved: true,
          status: "approved",
          approved_by: approvedBy,
          updated_at: formatDateForDB(new Date()),
        })
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      return handleSupabaseError(error, "Failed to approve theater");
    }
  }

  /**
   * Reject a theater
   */
  async rejectTheater(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("theaters")
        .update({
          is_approved: false,
          status: "rejected",
          updated_at: formatDateForDB(new Date()),
        })
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      return handleSupabaseError(error, "Failed to reject theater");
    }
  }

  /**
   * Activate a theater
   */
  async activateTheater(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("theaters")
        .update({
          status: "active",
          is_approved: true,
          updated_at: formatDateForDB(new Date()),
        })
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      return handleSupabaseError(error, "Failed to activate theater");
    }
  }

  /**
   * Deactivate a theater
   */
  async deactivateTheater(id: string, reason?: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("theaters")
        .update({
          status: "inactive",
          is_approved: false,
          updated_at: formatDateForDB(new Date()),
        })
        .eq("id", id);

      if (error) throw error;

      // Log deactivation reason if provided
      if (reason) {
        await supabase.from("activity_logs").insert({
          action: "Theater deactivated",
          action_type: "update",
          target_type: "theater",
          target_id: id,
          status: "success",
          new_data: { deactivation_reason: reason },
        });
      }
    } catch (error) {
      return handleSupabaseError(error, "Failed to deactivate theater");
    }
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const [
        { count: totalTheaters },
        { count: activeTheaters },
        { count: pendingTheaters },
        { count: rejectedTheaters },
        { count: totalOwners },
        { count: verifiedOwners },
        { count: activeContracts },
        { data: recentTheaters },
      ] = await Promise.all([
        supabase.from("theaters").select("*", { count: "exact", head: true }),
        supabase
          .from("theaters")
          .select("*", { count: "exact", head: true })
          .eq("status", "active"),
        supabase
          .from("theaters")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("theaters")
          .select("*", { count: "exact", head: true })
          .eq("status", "rejected"),
        supabase.from("owners").select("*", { count: "exact", head: true }),
        supabase
          .from("owners")
          .select("*", { count: "exact", head: true })
          .eq("verification_status", "verified"),
        supabase
          .from("owners_contracts")
          .select("*", { count: "exact", head: true })
          .eq("status", "active"),
        supabase
          .from("theaters")
          .select("*, owner:owner_user_id(full_name, email, phone)")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      return {
        totalTheaters: totalTheaters || 0,
        activeTheaters: activeTheaters || 0,
        pendingTheaters: pendingTheaters || 0,
        rejectedTheaters: rejectedTheaters || 0,
        totalOwners: totalOwners || 0,
        verifiedOwners: verifiedOwners || 0,
        activeContracts: activeContracts || 0,
        recentTheaters: recentTheaters || [],
      };
    } catch (error) {
      return handleSupabaseError(error, "Failed to fetch dashboard stats");
    }
  }

  // ==================== OWNER MANAGEMENT ====================

  /**
   * Get all owners
   */
  async getOwners(): Promise<Owner[]> {
    try {
      const { data, error } = await supabase
        .from("owners")
        .select(
          `
                    *,
                    user:user_id (
                        full_name,
                        email,
                        phone
                    )
                `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      return handleSupabaseError(error, "Failed to fetch owners");
    }
  }

  /**
   * Get owner by ID
   */
  async getOwnerById(id: string): Promise<Owner | null> {
    try {
      const { data, error } = await supabase
        .from("owners")
        .select(
          `
                    *,
                    user:user_id (
                        full_name,
                        email,
                        phone
                    )
                `,
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching owner:", error);
      return null;
    }
  }

  /**
   * Get owner by user ID
   */
  async getOwnerByUserId(userId: string): Promise<Owner | null> {
    try {
      const { data, error } = await supabase
        .from("owners")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching owner by user ID:", error);
      return null;
    }
  }

  /**
   * Create a new owner
   */
  async createOwner(ownerData: CreateOwnerData): Promise<Owner> {
    try {
      const { data, error } = await supabase
        .from("owners")
        .insert([
          {
            ...ownerData,
            verification_status: ownerData.verification_status || "pending",
            created_at: formatDateForDB(new Date()),
            updated_at: formatDateForDB(new Date()),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return handleSupabaseError(error, "Failed to create owner");
    }
  }

  /**
   * Update owner verification status
   */
  async updateOwnerVerification(
    id: string,
    status: string,
    notes?: string,
    verifiedBy?: string,
  ): Promise<void> {
    try {
      const updates: any = {
        verification_status: status,
        verification_notes: notes || null,
        updated_at: formatDateForDB(new Date()),
      };

      if (status === "verified") {
        updates.verified_at = formatDateForDB(new Date());
        updates.verified_by = verifiedBy;
      }

      const { error } = await supabase
        .from("owners")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      return handleSupabaseError(error, "Failed to update owner verification");
    }
  }

  // ==================== CONTRACT MANAGEMENT ====================

  /**
   * Get all contracts
   */
  async getContracts(): Promise<OwnerContract[]> {
    try {
      const { data, error } = await supabase
        .from("owners_contracts")
        .select(
          `
                    *,
                    theater:theater_id (*),
                    owner:owner_id (*)
                `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      return handleSupabaseError(error, "Failed to fetch contracts");
    }
  }

  /**
   * Get contract by ID
   */
  async getContractById(id: string): Promise<OwnerContract | null> {
    try {
      const { data, error } = await supabase
        .from("owners_contracts")
        .select(
          `
                    *,
                    theater:theater_id (*),
                    owner:owner_id (*)
                `,
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching contract:", error);
      return null;
    }
  }

  /**
   * Get contracts by theater ID
   */
  async getContractsByTheater(theaterId: string): Promise<OwnerContract[]> {
    try {
      const { data, error } = await supabase
        .from("owners_contracts")
        .select("*")
        .eq("theater_id", theaterId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      return handleSupabaseError(error, "Failed to fetch theater contracts");
    }
  }

  /**
   * Create a new contract
   */
  async createContract(
    contractData: Partial<OwnerContract>,
  ): Promise<OwnerContract> {
    try {
      const contractNumber = `CTR-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const { data, error } = await supabase
        .from("owners_contracts")
        .insert([
          {
            ...contractData,
            contract_number: contractNumber,
            created_at: formatDateForDB(new Date()),
            updated_at: formatDateForDB(new Date()),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return handleSupabaseError(error, "Failed to create contract");
    }
  }

  /**
   * Update a contract
   */
  async updateContract(
    id: string,
    updates: Partial<OwnerContract>,
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from("owners_contracts")
        .update({
          ...updates,
          updated_at: formatDateForDB(new Date()),
        })
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      return handleSupabaseError(error, "Failed to update contract");
    }
  }

  /**
   * Terminate a contract
   */
  async terminateContract(id: string, notes?: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("owners_contracts")
        .update({
          status: "terminated",
          notes: notes || null,
          updated_at: formatDateForDB(new Date()),
        })
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      return handleSupabaseError(error, "Failed to terminate contract");
    }
  }

  // ==================== USER MANAGEMENT ====================

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  }

  /**
   * Get users by role
   */
  async getUsersByRole(role: string): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("role", role)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      return handleSupabaseError(error, "Failed to fetch users");
    }
  }

  // ==================== ANALYTICS & REPORTS ====================

  /**
   * Get theaters grouped by city
   */
  async getTheatersByCity(): Promise<{ city: string; count: number }[]> {
    try {
      const { data, error } = await supabase
        .from("theaters")
        .select("city, status")
        .eq("is_approved", true);

      if (error) throw error;

      const cityStats: { [key: string]: number } = {};
      data?.forEach((theater) => {
        if (theater.city) {
          cityStats[theater.city] = (cityStats[theater.city] || 0) + 1;
        }
      });

      return Object.entries(cityStats).map(([city, count]) => ({
        city,
        count,
      }));
    } catch (error) {
      return handleSupabaseError(error, "Failed to fetch theaters by city");
    }
  }

  /**
   * Get subscription distribution
   */
  async getSubscriptionDistribution(): Promise<
    { status: string; count: number }[]
  > {
    try {
      const { data, error } = await supabase
        .from("theaters")
        .select("subscription_status");

      if (error) throw error;

      const distribution: { [key: string]: number } = {};
      data?.forEach((theater) => {
        const status = theater.subscription_status || "unknown";
        distribution[status] = (distribution[status] || 0) + 1;
      });

      return Object.entries(distribution).map(([status, count]) => ({
        status,
        count,
      }));
    } catch (error) {
      return handleSupabaseError(
        error,
        "Failed to fetch subscription distribution",
      );
    }
  }

  /**
   * Get contract value statistics
   */
  async getContractStats(): Promise<{
    totalValue: number;
    averageCommission: number;
    totalContracts: number;
  }> {
    try {
      const { data, error } = await supabase
        .from("owners_contracts")
        .select("base_price, discounted_price, commission_rate, status")
        .eq("status", "active");

      if (error) throw error;

      const totalValue =
        data?.reduce(
          (sum, contract) =>
            sum + (contract.discounted_price || contract.base_price || 0),
          0,
        ) || 0;

      const averageCommission =
        data?.reduce(
          (sum, contract) => sum + (contract.commission_rate || 0),
          0,
        ) / (data?.length || 1);

      return {
        totalValue,
        averageCommission,
        totalContracts: data?.length || 0,
      };
    } catch (error) {
      return handleSupabaseError(error, "Failed to fetch contract stats");
    }
  }

  /**
   * Get recent activity logs
   */
  async getRecentActivityLogs(limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      return [];
    }
  }

  /**
   * Log an activity
   */
  async logActivity(
    action: string,
    actionType: string,
    targetType: string,
    targetId: string,
    targetName: string,
    newData?: any,
  ): Promise<void> {
    try {
      await supabase.from("activity_logs").insert({
        action,
        action_type: actionType,
        target_type: targetType,
        target_id: targetId,
        target_name: targetName,
        status: "success",
        new_data: newData,
        created_at: formatDateForDB(new Date()),
      });
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  }

  // ==================== BULK OPERATIONS ====================

  /**
   * Bulk approve theaters
   */
  async bulkApproveTheaters(
    ids: string[],
    approvedBy: string,
  ): Promise<{ success: string[]; failed: string[] }> {
    const success: string[] = [];
    const failed: string[] = [];

    for (const id of ids) {
      try {
        await this.approveTheater(id, approvedBy);
        success.push(id);
      } catch (error) {
        failed.push(id);
      }
    }

    return { success, failed };
  }

  /**
   * Bulk delete theaters
   */
  async bulkDeleteTheaters(
    ids: string[],
  ): Promise<{ success: string[]; failed: string[] }> {
    const success: string[] = [];
    const failed: string[] = [];

    for (const id of ids) {
      try {
        await this.deleteTheater(id);
        success.push(id);
      } catch (error) {
        failed.push(id);
      }
    }

    return { success, failed };
  }

  /**
   * Export theaters data to CSV format
   */
  async exportTheatersToCSV(filters?: { status?: string }): Promise<string> {
    const theaters = await this.getTheaters(filters);

    const headers = [
      "ID",
      "Legal Business Name",
      "Business Type",
      "Email",
      "Phone",
      "City",
      "Status",
      "Subscription Status",
      "Created At",
    ];
    const rows = theaters.map((theater) => [
      theater.id,
      theater.legal_business_name,
      theater.business_type,
      theater.email,
      theater.phone,
      theater.city,
      theater.status,
      theater.subscription_status,
      new Date(theater.created_at).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
    return csvContent;
  }
}

// Export singleton instance
export const adminService = new AdminService();