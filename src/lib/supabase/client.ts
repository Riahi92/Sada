import { createClient as createBrowserClientUtil } from '@/utils/supabase/client';

export function createClient() {
  return createBrowserClientUtil();
}
