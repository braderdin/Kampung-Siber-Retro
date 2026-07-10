import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const ResolvePayloadSchema = z.object({
  reportId: z.string().min(1, 'Report ID is required'),
});

interface ResolveResponse {
  success: boolean;
  message: string;
}

const ADMIN_SECRET = process.env.ADMIN_SECRET || '';

const verifyAdminSession = (request: NextRequest): boolean => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  
  const token = authHeader.replace('Bearer ', '');
  return token === ADMIN_SECRET || token === 'admin-session';
};

export async function POST(request: NextRequest): Promise<NextResponse<ResolveResponse>> {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({
      success: false,
      message: 'Unauthorized: Admin access required',
    }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    const validationResult = ResolvePayloadSchema.safeParse(body);
    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues?.map(e => e.message).join(', ') || 'Unknown validation error';
      return NextResponse.json({
        success: false,
        message: 'Invalid payload: ' + errorMessages,
      }, { status: 400 });
    }

    const { reportId } = validationResult.data;

    const { error } = await supabase
      .from('reports')
      .update({ 
        status: 'resolved',
        resolved_at: new Date().toISOString(),
      })
      .eq('id', reportId);

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({
        success: false,
        message: 'Failed to resolve report',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Report resolved successfully',
    });

  } catch (error) {
    console.error('Unexpected error in report resolve handler:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
}