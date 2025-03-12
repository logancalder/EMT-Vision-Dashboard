import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await createClient().auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session.user;
}

export const signOut = async () => {
  const { error } = await createClient().auth.signOut();
  if (error) throw error;
}

