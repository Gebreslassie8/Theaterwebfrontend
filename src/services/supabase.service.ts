// frontend/src/services/supabase.service.ts
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const registerCustomer = async (data: {
  email: string;
  phone: string;
  full_name: string;
  username?: string;
  password: string;
}) => {
  try {
    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(data.password, salt);

    const username = data.username || data.email.split("@")[0];

    const { data: user, error } = await supabase
      .from("users")
      .insert([
        {
          email: data.email,
          phone: data.phone,
          full_name: data.full_name,
          username: username,
          password: hashedPassword,
          role: "customer",
          status: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select("id, email, phone, full_name, username, role, status, created_at")
      .single();

    if (error) throw error;

    return { success: true, data: user };
  } catch (error: any) {
    console.error("Registration error:", error);
    return { success: false, error: error.message };
  }
};