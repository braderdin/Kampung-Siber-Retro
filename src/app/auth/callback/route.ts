// Start: Supabase Auth Google OAuth Callback Handler
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client for auth callback
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Start: GET Handler for OAuth Callback
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const requestUrl = new URL(req.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
      // Exchange the code for session
      await supabase.auth.exchangeCodeForSession(code);
    }

    // Return redirect to dashboard
    return NextResponse.redirect('http://localhost:3000/dashboard');
  } catch (error) {
    console.error('Auth callback error:', error);
    // Return redirect to signin on error
    return NextResponse.redirect('http://localhost:3000/signin');
  }
}
// End: GET Handler for OAuth Callback

// Start: POST Handler for Auth Callback
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({
        success: false,
        error: 'Kod pengesahan diperlukan'
      }, { status: 400 });
    }

    await supabase.auth.exchangeCodeForSession(code);

    return NextResponse.json({
      success: true,
      redirectTo: 'http://localhost:3000/dashboard'
    }, { status: 200 });
  } catch (error) {
    console.error('Auth callback POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'Pemprosesan pengesahan gagal'
    }, { status: 500 });
  }
}
// End: POST Handler for Auth Callback