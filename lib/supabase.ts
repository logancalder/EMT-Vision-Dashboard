import { createClient } from "@supabase/supabase-js"

// Default to empty strings during development to prevent crashes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const createClientComponentClient = () => {
  // Check if we're in a browser environment and warn if variables are missing
  if (typeof window !== "undefined" && (!supabaseUrl || !supabaseAnonKey)) {
    console.warn("Missing Supabase environment variables. Authentication features will not work properly.")
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

export const createServerComponentClient = () => {
  // For server components, we still want to warn but not crash
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Missing Supabase environment variables. Authentication features will not work properly.")
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  })
}

