import { createClient as createServerClientUtil } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClientUtil(cookieStore);
}
