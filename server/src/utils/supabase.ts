import { createClient } from "@supabase/supabase-js";

export const superbase_url = process.env.SUPABASE_URL || "";
const key = process.env.SUPABASE_KEY || "";

export const supabase = createClient(superbase_url, key);
