import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let authenticated = false;
    let userData: any = null;

    // 1. Attempt Supabase Auth login if configured
    if (supabaseUrl && supabaseKey) {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Can be ignored if from server component
            }
          },
        },
      });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data?.user) {
        authenticated = true;
        userData = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.full_name || 'مدير النظام',
          role: 'admin',
        };
      }
    }

    // 2. Fallback check for initial admin credentials if Supabase user is not yet seeded
    const defaultAdminEmail = process.env.ADMIN_EMAIL || 'editor@sada.tn';
    const defaultAdminPassword = process.env.ADMIN_PASSWORD || 'admin123456';

    if (!authenticated && email === defaultAdminEmail && password === defaultAdminPassword) {
      authenticated = true;
      userData = {
        email: defaultAdminEmail,
        name: 'مروان الرياحي (رئيس التحرير)',
        role: 'admin',
      };
    }

    if (!authenticated) {
      return NextResponse.json(
        { success: false, message: 'بيانات الدخول غير صحيحة. يرجى التحقق من البريد الإلكتروني وكلمة المرور.' },
        { status: 401 }
      );
    }

    // Set secure admin session cookie
    const response = NextResponse.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      user: userData,
    });

    response.cookies.set({
      name: 'sada_admin_session',
      value: JSON.stringify({ email: userData.email, role: userData.role, timestamp: Date.now() }),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم أثناء تسجيل الدخول' },
      { status: 500 }
    );
  }
}
